console.log('Guardian extension loaded');
let retrieved = false;
const filter ={
    urls: ["<all_urls>"],
}

chrome.action.onClicked.addListener(function (tab) {
    if (tab.url.startsWith('http')) {
        chrome.debugger.attach({ tabId: tab.id }, '1.2', function () {
            chrome.debugger.sendCommand(
                { tabId: tab.id },
                'Network.enable',
                {},
                function () {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    }
                }
            );
        });
    } else {
        console.log('Debugger can only be attached to HTTP/HTTPS pages.');
    }
});

chrome.debugger.onEvent.addListener(function (source, method, params) {
    if (method === 'Network.responseReceived' && !retrieved) {
        downloadJSON(params.response);
        // Perform your desired action with the response data
    }
});

function downloadJSON(response) {
    retrieved = true;
    const jsonData = JSON.stringify(response, null, 2);
    const url = `data:text/plain,${jsonData}`;
    const filename = 'response.json';
    console.log('jaasoo', jsonData)
    // chrome.downloads.download({ url, filename });
}