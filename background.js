var port;

chrome.runtime.onInstalled.addListener(function () {
    chrome.runtime.onConnect.addListener(function (p) {
        port = p
        p.postMessage({type: "focus"})
    })
});

chrome.browserAction.onClicked.addListener(function (tab) {
    focus = !focus;
    if (focus) {
        port.postMessage({type: "focus"})
    } else {
        port.postMessage({type: "unfocus"})
    }
});
