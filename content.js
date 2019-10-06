/**
 * Our content script can interact with the DOM, so we register a listener 
 * that hides the news feed and side news panel when the 'block_news' message
 * is sent by the background script.
 */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'block_news') {
        // We hide the HTML elements with class names that match the news 
        // feed and emerging news panel
        document.getElementsByClassName('feed-shared-news-module')[0].style.display = 'none'
        document.getElementsByClassName('core-rail')[0].style.display = 'none'
}
});