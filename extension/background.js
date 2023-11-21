let isOnTwitter = false;
let jsonData = null

function queryTabs() {
  chrome.tabs.query({active: true},
    function(tab) {
      console.log('tab', tab[0].url)
      if(tab[0] && tab[0].url.startsWith('https://twitter.com/'))
        isOnTwitter = true;
      else isOnTwitter = false;
    }
  )
}

queryTabs();

chrome.tabs.onActivated.addListener(queryTabs)

chrome.webNavigation.onCompleted.addListener(
  function (obj) {
    console.log('obj', obj.url)
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
    chrome.runtime.sendMessage({ dataFromBackground: jsonData });
  }
  else if (request.messageFromDevTools) {
    console.log('request.messageFromDevTools', request.messageFromDevTools)
    jsonData = request.messageFromDevTools;
  }
})