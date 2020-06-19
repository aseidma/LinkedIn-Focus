/**
 * Our content script can interact with the DOM, so we register a listener 
 * that hides the news feed and side news panel when the 'focus' message
 * is sent by the background script.
 */
const port = chrome.runtime.connect({ name: "linkedin-infocus" });

port.onMessage.addListener((msg) => {
    console.log(msg.type)
    if (msg.type === "focus") {
        blockNewsFeed()
    } else if (msg.type === "unfocus") {
        setNewsVisibility(true)
    }
});

var intervalTimerId;

function blockNewsFeed() {
    function tryBlockingNewsFeed() {
        if (!hasNewsLoaded()) {
            return
        }
        if (isNewsBlocked()) {
            clearInterval(intervalTimerId)
            return;
        }
        setNewsVisibility(false)
    }
    if (!isNewsBlocked()) {
        intervalTimerId = setInterval(tryBlockingNewsFeed, 1000)
    }
}

function setNewsVisibility(isVisible) {
    if (!isVisible) {
        document.getElementsByClassName('feed-shared-news-module')[0].style.visibility = 'hidden'
        document.getElementsByClassName('core-rail')[0].style.visibility = 'hidden'
    } else {
        document.getElementsByClassName('feed-shared-news-module')[0].style.visibility = 'visible'
        document.getElementsByClassName('core-rail')[0].style.visibility = 'visible'
    }
}

function isNewsBlocked() {
    if (!hasNewsLoaded()) {
        return false
    }
    return document.getElementsByClassName('feed-shared-news-module')[0].style.visibility == 'hidden' &&
        document.getElementsByClassName('core-rail')[0].style.visibility == 'hidden'
}

function hasNewsLoaded() {
    return document.getElementsByClassName('feed-shared-news-module')[0] &&
        document.getElementsByClassName('core-rail')[0]
}
