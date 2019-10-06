/**
 * We log to the console to ensure our extension was correctly installed. 
 */
chrome.runtime.onInstalled.addListener(function () {
    console.log("You must Focus!");
});

/**
 * When the Linkedin InFocus extension button is clicked, we
 * send a 'block_news' message to the content scripts on our 
 * tab to hide the elements we want to get rid of. 
 */
chrome.browserAction.onClicked.addListener(function (tab) {
    console.log("Extension button clicked")
    chrome.tabs.sendMessage(tab.id, { text: 'block_news' });
    console.log("Block news message sent")
});

