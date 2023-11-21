let retrieved = false;

const CSRF_KEY = 'x-csrf-token'
const UUID_KEY = 'X-Client-UUID'
const AUTH_TOKEN = 'authorization'

const data = {
  [CSRF_KEY]: '',
  [UUID_KEY]: '',
  [AUTH_TOKEN]: ''
}

const preprocess = (obj) => {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      if (prop === "headers" && Array.isArray(obj[prop])) {
        // Extract values from the "headers" array
        obj[prop].map(header => {
          if(header.name === AUTH_TOKEN)
          data[AUTH_TOKEN] = header.value
          else if(header.name === UUID_KEY)
          data[UUID_KEY] = header.value
          else if(header.name === CSRF_KEY)
          data[CSRF_KEY] = header.value
        });
      } else if (typeof obj[prop] === "object") {
        // Continue searching recursively
        preprocess(obj[prop]);
      }
    }
  }
}

chrome.devtools.inspectedWindow.eval("window.location.href", function (result, isException) {
  if (!isException && result.startsWith('https://twitter.com/')) {
    chrome.devtools.network.getHAR(function (request) {
      if (retrieved) return;
      retrieved = true;

      alert('Guardian-X will load your network HAR now..')
      preprocess(request)
      chrome.runtime.sendMessage({ messageFromDevTools: data })
    })
  }
})