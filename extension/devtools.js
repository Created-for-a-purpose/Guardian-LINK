let retrieved = false;

chrome.devtools.network.getHAR((request) => {
    if(retrieved) return;
    retrieved = true;
    const jsonData = JSON.stringify(request);
    const url = `data:application/json,${jsonData}`;
    const filename = 'response.json';
    console.log('jaasoo', jsonData)
    chrome.downloads.download({ url, filename });
})
