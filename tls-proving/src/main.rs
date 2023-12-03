use eyre::Result;
use hyper::{body::to_bytes, client::conn::Parts, Body, Request, StatusCode};
use rustls::{Certificate, ClientConfig, RootCertStore};
use serde::{Deserialize, Serialize};
use std::{env, fs::File as StdFile, io::BufReader, ops::Range, sync::Arc, time::Duration};
use tokio::{fs::File, io::AsyncWriteExt as _, net::TcpStream};
use tokio_rustls::TlsConnector;
use tokio_util::compat::{FuturesAsyncReadCompatExt, TokioAsyncReadCompatExt};
use tlsn_prover::tls::{Prover, ProverConfig};
use tlsn_core::proof::SessionProof;
use crate::rocket::futures::AsyncWriteExt;

#[macro_use] extern crate rocket;
use rocket::serde::json::Json;

const SERVER_DOMAIN: &str = "twitter.com";
const ROUTE: &str = "i/api/graphql/aQ-b88K_Lp7dgHX53MqNQQ/GetUserClaims?variables=%7B%7D";
const USER_AGENT : &str = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";

const NOTARY_HOST: &str = "127.0.0.1";
const NOTARY_PORT: u16 = 7047;
const NOTARY_CA_CERT_PATH: &str = "./tlsn/notary-server/fixture/tls/rootCA.crt";
const NOTARY_MAX_TRANSCRIPT_SIZE: usize = 16384;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NotarizationSessionResponse {
    pub session_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NotarizationSessionRequest {
    pub client_type: ClientType,
    pub max_transcript_size: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum ClientType {
    Tcp,
    Websocket,
}

use rocket::http::Header;
use rocket::{Request as RocketRequest, Response};
use rocket::fairing::{Fairing, Info, Kind};

pub struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Attaching CORS headers to responses",
            kind: Kind::Response
        }
    }

    async fn on_response<'r>(&self, request: &'r RocketRequest<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));

        // Handle preflight requests
        if request.method() == rocket::http::Method::Options {
          response.set_status(rocket::http::Status::NoContent);
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
struct InjectWrapper{
    csrf: String,
    uuid: String,
    access_token: String,
    auth_token: String
}

#[post("/inject", format="json", data = "<x>")]
fn inject(x: Json<InjectWrapper>) -> &'static str {
  env::set_var("CSRF_TOKEN", &x.csrf);
  env::set_var("CLIENT_UUID", &x.uuid);
  env::set_var("ACCESS_TOKEN", &x.access_token);
  env::set_var("AUTH_TOKEN", &x.auth_token);

    "OK"
}

#[launch]
async fn rocket() -> _{
  rocket::build().attach(CORS).mount("/", routes![inject, notarize])
}

#[get("/notarize")]
async fn notarize() -> Vec<u8>{

    let client_uuid = env::var("CLIENT_UUID").unwrap();
    let access_token = env::var("ACCESS_TOKEN").unwrap();
    let csrf_token = env::var("CSRF_TOKEN").unwrap();
    let auth_token = env::var("AUTH_TOKEN").unwrap();

    let (notary_tls_socket, session_id) = setup_notary_connection().await;

    // Basic default prover config using the session_id returned from /session endpoint just now
    let config = ProverConfig::builder()
        .id(session_id)
        .server_dns(SERVER_DOMAIN)
        .build()
        .unwrap();

    // Create a new prover and set up the MPC backend.
    let prover = Prover::new(config)
        .setup(notary_tls_socket.compat())
        .await
        .unwrap();

    let client_socket = tokio::net::TcpStream::connect((SERVER_DOMAIN, 443))
        .await
        .unwrap();

    // Bind the Prover to server connection
    let (tls_connection, prover_fut) = prover.connect(client_socket.compat()).await.unwrap();

    // Spawn the Prover to be run concurrently
    let prover_task = tokio::spawn(prover_fut);

    // Attach the hyper HTTP client to the TLS connection
    let (mut request_sender, connection) = hyper::client::conn::handshake(tls_connection.compat())
        .await
        .unwrap();

    // Spawn the HTTP task to be run concurrently
    let connection_task = tokio::spawn(connection.without_shutdown());

    // Build the HTTP request to fetch the profile
    println!("{}", format!("https://{SERVER_DOMAIN}/{ROUTE}"));
    let request = Request::builder()
        .uri(format!(
            "https://{SERVER_DOMAIN}/{ROUTE}"
        ))
        .header("Host", SERVER_DOMAIN)
        .header("Accept", "*/*")
         .header("Accept-Encoding", "gzip, deflate, br")
        .header("Connection", "close")
        .header("User-Agent", USER_AGENT)
        .header("authorization", format!("Bearer {access_token}"))
        .header(
                "Cookie",
                format!("auth_token={auth_token}; ct0={csrf_token}"),
            )
            .header("Authority", SERVER_DOMAIN)
            .header("X-Twitter-Auth-Type", "OAuth2Session")
            .header("x-twitter-active-user", "yes")
            .header("X-Client-Uuid", client_uuid)
            .header("X-Csrf-Token", csrf_token.clone())
        .body(Body::empty())
        .unwrap();

    println!("Sending request");

    let response = request_sender.send_request(request).await.unwrap();

    println!("Sent request");
    println!("{:?}", response);
    assert!(response.status() == StatusCode::OK);

    println!("Request OK");

    // Pretty printing :)
    let payload = to_bytes(response.into_body()).await.unwrap().to_vec();
    println!("{:?}", payload);

    // Close the connection to the server
    let mut client_socket = connection_task.await.unwrap().unwrap().io.into_inner();
    client_socket.close().await.unwrap();

    // The Prover task should be done now, so we can grab it.
    let prover = prover_task.await.unwrap().unwrap();

    // Prepare for notarization
    let mut prover = prover.start_notarize();

    // Identify the ranges in the transcript that contain secrets
    let (public_ranges, private_ranges) = find_ranges(
        prover.sent_transcript().data(),
        &[
            access_token.as_bytes(),
            csrf_token.as_bytes(),
            auth_token.as_bytes(),
        ],
    );

    let recv_len = prover.recv_transcript().data().len();

    let builder = prover.commitment_builder();

    let mut commitment_ids = Vec::new();
    // Commit to the outbound transcript, isolating the data that contain secrets
    for range in public_ranges.iter().chain(private_ranges.iter()) {
        commitment_ids.push(builder.commit_sent(range.clone()).unwrap());
    }

    // Commit to the full received transcript in one shot, as we don't need to redact anything
    commitment_ids.push(builder.commit_recv(0..recv_len).unwrap());

    // Finalize, returning the notarized session
    let notarized_session = prover.finalize().await.unwrap();

    println!("Notarization complete!");

    let session_proof = notarized_session.session_proof();
    let mut proof_builder = notarized_session.data().build_substrings_proof();

    // Reveal select commitments to the proof
    proof_builder.reveal(commitment_ids[0]).unwrap();
    proof_builder.reveal(commitment_ids[1]).unwrap();
    proof_builder.reveal(commitment_ids[2]).unwrap();

    let substrings_proof = proof_builder.build().unwrap();

    let SessionProof{
        header,
        server_name,
        ..
    } = session_proof;

    let time = Duration::from_secs(header.time());
    let (mut sent, mut recv) = substrings_proof.verify(&header).unwrap();
    sent.set_redacted(b'X');
    recv.set_redacted(b'X');

    println!("-------------------------------------------------------------------");
    println!(
        "Successfully verified that the bytes below came from a session with {:?} at {:?}.",
        server_name, time
    );
    println!("Note that the bytes which the Prover chose not to disclose are shown as X.");
    println!();
    println!("Bytes sent:");
    println!();
    print!("{}", String::from_utf8(sent.data().to_vec()).unwrap());
    println!();
    println!("Bytes received:");
    println!();
    println!("{}", String::from_utf8(recv.data().to_vec()).unwrap());
    println!("-------------------------------------------------------------------");

    vec![1]
}

async fn setup_notary_connection() -> (tokio_rustls::client::TlsStream<TcpStream>, String) {
    // Connect to the Notary via TLS-TCP
    let mut certificate_file_reader = read_pem_file(NOTARY_CA_CERT_PATH).await.unwrap();
    let mut certificates: Vec<Certificate> = rustls_pemfile::certs(&mut certificate_file_reader)
        .unwrap()
        .into_iter()
        .map(Certificate)
        .collect();
    let certificate = certificates.remove(0);

    let mut root_store = RootCertStore::empty();
    root_store.add(&certificate).unwrap();

    let client_notary_config = ClientConfig::builder()
        .with_safe_defaults()
        .with_root_certificates(root_store)
        .with_no_client_auth();
    let notary_connector = TlsConnector::from(Arc::new(client_notary_config));

    let notary_socket = tokio::net::TcpStream::connect((NOTARY_HOST, NOTARY_PORT))
        .await
        .unwrap();

    let notary_tls_socket = notary_connector
        // Require the domain name of notary server to be the same as that in the server cert
        .connect("tlsnotaryserver.io".try_into().unwrap(), notary_socket)
        .await
        .unwrap();

    // Attach the hyper HTTP client to the notary TLS connection to send request to the /session endpoint to configure notarization and obtain session id
    let (mut request_sender, connection) = hyper::client::conn::handshake(notary_tls_socket)
        .await
        .unwrap();

    // Spawn the HTTP task to be run concurrently
    let connection_task = tokio::spawn(connection.without_shutdown());

    // Build the HTTP request to configure notarization
    let payload = serde_json::to_string(&NotarizationSessionRequest {
        client_type: ClientType::Tcp,
        max_transcript_size: Some(NOTARY_MAX_TRANSCRIPT_SIZE),
    })
    .unwrap();

    let request = Request::builder()
        .uri(format!("https://{NOTARY_HOST}:{NOTARY_PORT}/session"))
        .method("POST")
        .header("Host", NOTARY_HOST)
        // Need to specify application/json for axum to parse it as json
        .header("Content-Type", "application/json")
        .body(Body::from(payload))
        .unwrap();

    debug!("Sending configuration request");

    let configuration_response = request_sender.send_request(request).await.unwrap();

    debug!("Sent configuration request");

    assert!(configuration_response.status() == StatusCode::OK);

    debug!("Response OK");

    // Pretty printing :)
    let payload = to_bytes(configuration_response.into_body())
        .await
        .unwrap()
        .to_vec();
    let notarization_response =
        serde_json::from_str::<NotarizationSessionResponse>(&String::from_utf8_lossy(&payload))
            .unwrap();

    debug!("Notarization response: {:?}", notarization_response,);

    // Send notarization request via HTTP, where the underlying TCP connection will be extracted later
    let request = Request::builder()
        // Need to specify the session_id so that notary server knows the right configuration to use
        // as the configuration is set in the previous HTTP call
        .uri(format!(
            "https://{}:{}/notarize?sessionId={}",
            NOTARY_HOST,
            NOTARY_PORT,
            notarization_response.session_id.clone()
        ))
        .method("GET")
        .header("Host", NOTARY_HOST)
        .header("Connection", "Upgrade")
        // Need to specify this upgrade header for server to extract tcp connection later
        .header("Upgrade", "TCP")
        .body(Body::empty())
        .unwrap();

    debug!("Sending notarization request");

    let response = request_sender.send_request(request).await.unwrap();

    debug!("Sent notarization request");

    assert!(response.status() == StatusCode::SWITCHING_PROTOCOLS);

    debug!("Switched protocol OK");

    // Claim back the TLS socket after HTTP exchange is done
    let Parts {
        io: notary_tls_socket,
        ..
    } = connection_task.await.unwrap().unwrap();

    (notary_tls_socket, notarization_response.session_id)
}

/// Find the ranges of the public and private parts of a sequence.
///
/// Returns a tuple of `(public, private)` ranges.
fn find_ranges(seq: &[u8], sub_seq: &[&[u8]]) -> (Vec<Range<usize>>, Vec<Range<usize>>) {
    let mut private_ranges = Vec::new();
    for s in sub_seq {
        for (idx, w) in seq.windows(s.len()).enumerate() {
            if w == *s {
                private_ranges.push(idx..(idx + w.len()));
            }
        }
    }

    let mut sorted_ranges = private_ranges.clone();
    sorted_ranges.sort_by_key(|r| r.start);

    let mut public_ranges = Vec::new();
    let mut last_end = 0;
    for r in sorted_ranges {
        if r.start > last_end {
            public_ranges.push(last_end..r.start);
        }
        last_end = r.end;
    }

    if last_end < seq.len() {
        public_ranges.push(last_end..seq.len());
    }

    (public_ranges, private_ranges)
}

/// Read a PEM-formatted file and return its buffer reader
async fn read_pem_file(file_path: &str) -> Result<BufReader<StdFile>> {
    let key_file = File::open(file_path).await?.into_std().await;
    Ok(BufReader::new(key_file))
}
