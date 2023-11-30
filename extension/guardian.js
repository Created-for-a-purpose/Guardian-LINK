console.log('GuardianX frontend loaded!');

let DATA = {}

const CSRF_KEY = 'x-csrf-token'
const UUID_KEY = 'X-Client-UUID'
const ACCESS_TOKEN = 'authorization'
let AUTH_TOKEN = "auth_token"

chrome.runtime.sendMessage({ messageFromContent: 'Extension ready' })

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request && request.messageFromBackground) {
        const status = request.messageFromBackground === 'true' ? `You're on X!` : 'Please navigate to x.com!!';
        document.getElementById('status').textContent = status;
        if (status === `You're on X!`) {
            document.getElementById('status').style.color = 'lightgreen';
            document.getElementById('innerContent').innerHTML = `<p>🛜 Capturing network traffic...</p>
            <p><b>CSRF:</b>
            <span id="csrf">Please open DevTools🔃</span>
            </p>
            <p><b>UUID:</b>
            <span id="uuid">Please open DevTools🔃</span>
            </p>
            <p><b>Access:</b>
            <span id="access">Please open DevTools🔃</span>
            </p>`;
        }
    }
    else if (request.dataFromBackground) {
        const data = request.dataFromBackground;
        DATA = data;
        document.getElementById('csrf').textContent = data[CSRF_KEY];
        document.getElementById('uuid').textContent = data[UUID_KEY];
        document.getElementById('access').textContent = data[ACCESS_TOKEN];
    }
    else if (request.authFromBackground) {
        const auth = request.authFromBackground;
        AUTH_TOKEN = auth;
    }
})

document.getElementById('injectButton').addEventListener('click', async () => {
    const toInject = {
        'csrf': DATA[CSRF_KEY],
        'uuid': DATA[UUID_KEY],
        'access_token': DATA[ACCESS_TOKEN].slice(7),
        'auth_token': AUTH_TOKEN
    }
    const jsonData = JSON.stringify(toInject);
    const url = "http://localhost:8000/inject"
    const fileurl = `data:application/json,${encodeURIComponent(jsonData)}`;
    const filename = 'response.json';
    chrome.downloads.download({ url: fileurl, filename })
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonData
    });
    if(response.ok){
        document.getElementById('innerContent').innerHTML = `<p>✅ Injected successfully!</p>`;
    }
})

// ------ Capture network traffic

// chrome.action.onClicked.addListener(function (tab) {
//     if (tab.url.startsWith('http')) {
//         chrome.debugger.attach({ tabId: tab.id }, '1.2', function () {
//             chrome.debugger.sendCommand(
//                 { tabId: tab.id },
//                 'Network.enable',
//                 {},
//                 function () {
//                     if (chrome.runtime.lastError) {
//                         console.error(chrome.runtime.lastError);
//                     }
//                 }
//             );
//         });
//     } else {
//         console.log('Debugger can only be attached to HTTP/HTTPS pages.');
//     }
// });

// chrome.debugger.onEvent.addListener(function (source, method, params) {
//     if (method === 'Network.responseReceived' && !retrieved) {
//         downloadJSON(params.response);
//         // Perform your desired action with the response data
//     }
// });

// function downloadJSON(response) {
//     retrieved = true;
//     const jsonData = JSON.stringify(response, null, 2);
//     const url = `data:text/plain,${jsonData}`;
//     const filename = 'response.json';
//     // chrome.downloads.download({ url, filename });
// }