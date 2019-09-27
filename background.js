// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
    
    chrome.tabs.sendMessage(tab.id, { text: 'block_news' });
    console.log("Block news message sent")
});

chrome.runtime.onInstalled.addListener(function () {
    console.log("You must Focus!");
});