// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'block_news') {
        console.log("Blocking news")
        // Hide the HTML element with class name feed-shared-news-module
        document.getElementsByClassName('feed-shared-news-module')[0].style.display = 'none'
    }
});