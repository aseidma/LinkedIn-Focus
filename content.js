/**
 * Our content script can interact with the DOM, so we register a listener 
 * that hides the news feed and side news panel when the 'focus' message
 * is sent by the background script.
 */

const port = chrome.runtime.connect({name: "linkedin-infocus"});

port.onMessage.addListener((msg) => {
    if (msg.type === "focus") {
        document.getElementsByClassName('feed-shared-news-module')[0].style.visibility = 'hidden'
        document.getElementsByClassName('core-rail')[0].style.visibility = 'hidden'
    } else if (msg.type === "unfocus") {
        document.getElementsByClassName('feed-shared-news-module')[0].style.visibility = 'visible'
        document.getElementsByClassName('core-rail')[0].style.visibility = 'visible'
    }
});
