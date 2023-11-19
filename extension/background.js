let isOnTwitter = false;

chrome.webNavigation.onCompleted.addListener(
  function (obj) {
    if (obj && obj.url.startsWith('https://twitter.com/'))
      isOnTwitter = true;
    else isOnTwitter = false;
  }
)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request && request.messageFromContent) {
    console.log('request.messageFromContent', request.messageFromContent)
    const status = isOnTwitter ? 'true' : 'false';
    chrome.runtime.sendMessage({ messageFromBackground: status });
  }
})