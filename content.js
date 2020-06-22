/**
 * Our content script can interact with the DOM, so we register a listener 
 * that hides the news feed and side news panel when the 'focus' message
 * is sent by the background script.
 */
const port = chrome.runtime.connect({ name: "linkedin-infocus" });
var quotes = ["Do today what others won't and achieve tomorrow what others can't.",
"In character, in manner, in style, in all things, the supreme excellence is simplicity.",
"If we don't discipline ourselves, the world will do it for us.",
"Rule your mind or it will rule you.",
"All that we are is the result of what we have thought.",
"Never leave that till tomorrow which you can do today.",
"There is only one success--to be able to spend your life in your own way.",
"Success is the good fortune that comes from aspiration, desperation, perspiration and inspiration."
];
var html = document.getElementsByClassName('core-rail')[0].innerHTML
port.onMessage.addListener((msg) => {
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
            displayQuote()
            return;
        }
        setNewsVisibility(false)
    }
    if (!isNewsBlocked()) {
        intervalTimerId = setInterval(tryBlockingNewsFeed, 1000)
    }
}

function displayQuote(){
    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    document.getElementsByClassName('core-rail')[0].style.visibility = 'visible'
    document.getElementsByClassName('core-rail')[0].innerHTML = quote;
    document.getElementsByClassName('core-rail')[0].style.color = "olive";
    document.getElementsByClassName('core-rail')[0].style.fontSize ="xx-large";
    document.getElementsByClassName('core-rail')[0].style.fontFamily = "Arial, Helvetica";
}

function setNewsVisibility(isVisible) {
    if (!isVisible) {
        document.getElementsByClassName('feed-shared-news-module')[0].style.visibility = 'hidden'
        document.getElementsByClassName('core-rail')[0].style.visibility = 'hidden'
    } else {
        document.getElementsByClassName('feed-shared-news-module')[0].style.visibility = 'visible'
        document.getElementsByClassName('core-rail')[0].style.visibility = 'visible'
        document.getElementsByClassName('core-rail')[0].innerHTML = html
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
