use eyre::Result;
use hyper::{body::to_bytes, client::conn::Parts, Body, Request, StatusCode};
use rustls::{Certificate, ClientConfig, RootCertStore};
use serde::{Deserialize, Serialize};
use std::{env, fs::File as StdFile, io::BufReader, ops::Range, sync::Arc};
use tokio::{fs::File, io::AsyncWriteExt as _, net::TcpStream};
use tokio_rustls::TlsConnector;
use tlsn_prover::tls::{Prover, ProverConfig};

#[macro_use] extern crate rocket;
use rocket::serde::json::Json;

const twitter_domain: &str = "twitter.com";
const route: &str = "/home";
const user_agent : &str = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";

const NOTARY_HOST: &str = "127.0.0.1";
const NOTARY_PORT: u16 = 7047;
const NOTARY_CA_CERT_PATH: &str = "../tlsn/notary-server/fixture/tls/rootCA.crt";
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
    auth_token: String,
}

// #[tokio::main]
#[post("/inject", format="json", data = "<x>")]
fn inject(x: Json<InjectWrapper>) -> &'static str {
  env::set_var("CSRF_TOKEN", &x.csrf);
  env::set_var("UUID", &x.uuid);
  env::set_var("AUTH_TOKEN", &x.auth_token);
    "OK"
}

#[launch]
async fn rocket() -> _{
  rocket::build().attach(CORS).mount("/", routes![inject])
}
