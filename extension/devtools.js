let retrieved = false;

chrome.devtools.inspectedWindow.eval("window.location.href", function (result, isException) {
  if (!isException && result.startsWith('https://twitter.com/')) {
    chrome.devtools.network.getHAR(function (request) {
      if (retrieved) return;
      retrieved = true;
      const jsonData = JSON.stringify(request);
      const url = `data:application/json,${encodeURIComponent(jsonData)}`;
      const filename = 'response.json';
      alert('Guardian-X will download your network HAR file now.')
      chrome.downloads.download({ url, filename })
    })
}
})