/**
 * Our content script can interact with the DOM, so we register a listener 
 * that hides the news feed and side news panel when the 'focus' message
 * is sent by the background script.
 */
const port = chrome.runtime.connect({ name: "linkedin-infocus" });

const logoUrl = chrome.runtime.getURL("icon.png")
const gslogoUrl = chrome.runtime.getURL("logo.png")
const tooninlogoUrl = chrome.runtime.getURL("toonin_logo.png")
const matmathlogoUrl = chrome.runtime.getURL("material_math_logo.png")
port.onMessage.addListener((msg) => {
    if (msg.type === "focus") {
        blockNewsFeed()
    } else if (msg.type === "unfocus") {
        setNewsVisibility(true)
    }
});

var intervalTimerId;

function blockNewsFeed () {
    function tryBlockingNewsFeed () {
        if (!hasNewsLoaded()) {
            return
        }
        setNewsVisibility(false)
        if (isNewsBlocked()) {
            clearInterval(intervalTimerId)
            displayQuote()
            return;
        }
    }
    if (!isNewsBlocked()) {
        intervalTimerId = setInterval(tryBlockingNewsFeed, 1000)
    }
}

function displayQuote () {
    var quote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementsByClassName('core-rail')[0].style.visibility = 'visible'

    const quoteStyle = "style=\"color:#293E4A;font-size:24px;\margin-bottom:4px;\""
    const lfTitleStyle = "style=\"color:#0477B5;font-size:32px;font-weight:700;margin-bottom:16px;\""
    const gsTitleStyle = "style=\"color:#434343;font-size:32px;font-weight:700;margin-right:auto;\""
    const gsGithubStyle = "style=\"height: 32px;width: 32px;font-size: 32px;margin: 0px 6px;\""
    const gsSocialLinkedInStyle = "style=\"background: #007bb5;color: white;height: 32px;width: 32px;font-size: 24px;margin: 0px 6px;padding: 6px;border-radius:4px;\""
    const quoteSourceStyle = "style=\"color:#293E4A;font-size:20px;font-style:italic;margin-bottom:16px;\""
    const instructionStyle = "style=\"color:#293E4A;font-size:16px;\margin-bottom:4px;\""
    const logoStyle = " style=\"height: 24px;margin: 0px 4px;\" "
    const gspanelTitleStyle = "style=\"color:#434343;font-size:24px;font-weight:700;text-align:center;margin-bottom:25px;\""
    const gsDesc = "This web extension was developed by Grey Software. Grey Software is a non-profit organization that aims to create the open source ecosystem of the future where software maintainers mentor students and build free software together!"
    const hyperlinkStyle = "<style>a{text-decoration: none;color: black;} a:visited{text-decoration: none;color: black;} a:hover{text-decoration: none !important;opacity: 0.7;} </style>"
    const gsCta = "To learn more, please visit the Grey Software website at "

    const instruction = "To exit focus mode, click on the LinkedInFocus extension:"

    var linkedInFocusHTML = "<h1 " + lfTitleStyle + ">LinkedInFocus</h1>"
    linkedInFocusHTML += "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\"></link>"
    linkedInFocusHTML += "<p " + quoteStyle + ">" + quote.text + "</p>"
    linkedInFocusHTML += "<p " + quoteSourceStyle + ">- " + quote.source + "</p>"
    linkedInFocusHTML += "<p " + instructionStyle + ">" + instruction
    linkedInFocusHTML += "<img src=\"" + logoUrl + "\" " + logoStyle + ">" + " from the extensions panel on the top right corner of your screen.</p>"
    linkedInFocusHTML += "<br>"

    linkedInFocusHTML += "<div style=\"border: 2px;border-style:solid;border-color:#434343;padding: 1em;width: 500px;height: 269px;margin-top: 24px;padding-top:24px;border-radius:4px;\">"
    linkedInFocusHTML += "<div style=\"display: flex; align-items: center;margin-bottom:16px;\">"
    linkedInFocusHTML += "<img src=\"" + gslogoUrl + "\" style=\"height: 50px;float:left;margin-right: 6px;\" />"
    linkedInFocusHTML += "<span " + gsTitleStyle + ">Grey Software</span>"
    linkedInFocusHTML += "<a " + gsSocialLinkedInStyle + " href=\"https://www.linkedin.com/company/grey-software/\" class=\"fa fa-linkedin\"></a>"
    linkedInFocusHTML += "<a " + gsGithubStyle + " href=\"https://github.com/grey-software\" class=\"fa fa-github\"></a></div>"
    linkedInFocusHTML += hyperlinkStyle
    linkedInFocusHTML += "<div>" + gsDesc + "<p style=\"margin-top: 12px;\">" + gsCta + "</p><a href=\"https://org.grey.software/\">grey.software</a></div>"
    linkedInFocusHTML += "</div>"

    const quoteHtmlNode = document.createElement("div")
    quoteHtmlNode.innerHTML = linkedInFocusHTML

    // HTML for side panel
    var sidePanelHTML = "<div style=\"padding:15px;\">"
    sidePanelHTML += "<h2 " + gspanelTitleStyle + ">Grey Software Initiatives</h2>"
    sidePanelHTML += "<div style=\"display:flex;\">"
    sidePanelHTML += "<div style=\"flex:50%;\">"
    sidePanelHTML += "<center><img src=\"" + tooninlogoUrl + "\" style=\"width:40%;\"/></center>"
    sidePanelHTML += "<p style=\"text-align:center;width=40%;\"><a href=\"https://github.com/grey-software/toonin\">Toonin</a></p>"
    sidePanelHTML += "</div>"
    sidePanelHTML += "<div style=\"flex:50%;\">"
    sidePanelHTML += "<center><img src=\"" + matmathlogoUrl + "\" style=\"width:40%;\"/></center>"
    sidePanelHTML += "<p style=\"text-align:center;width=40%;\"><a href=\"https://github.com/grey-software/Material-Math\">Material Math</a></p>"
    sidePanelHTML += "</div>"
    sidePanelHTML += hyperlinkStyle
    sidePanelHTML += "</div>"
    // Change the HTML of the side panel
    document.getElementsByClassName('artdeco-card ember-view')[4].innerHTML = sidePanelHTML

    document.getElementsByClassName('core-rail')[0].prepend(quoteHtmlNode)
    document.getElementsByClassName('core-rail')[0].style.fontFamily = "Arial, Helvetica";
}

function setNewsVisibility (isVisible) {
    const newsFeedContainer = document.getElementsByClassName('core-rail')[0]
    if (!isVisible) {
        document.getElementsByClassName('feed-shared-news-module')[0].style.visibility = 'hidden'
        for (let i = 0; i < newsFeedContainer.children.length; i++) {
            newsFeedContainer.children[i].style.visibility = 'hidden';
        }
        document.getElementsByClassName('ad-banner-container is-header-zone ember-view')[0].style.visibility = 'hidden'
        document.getElementsByClassName('ad-banner-container artdeco-card ember-view')[0].style.visibility = 'hidden'
        for (i = 0; i < document.getElementsByClassName('nav-item__badge').length; i++) {
            document.getElementsByClassName('nav-item__badge')[i].style.visibility = 'hidden';
        }
    } else {
        document.getElementsByClassName('feed-shared-news-module')[0].style.visibility = 'visible'
        document.getElementsByClassName('core-rail')[0].children[0].remove()
        for (let i = 0; i < newsFeedContainer.children.length; i++) {
            newsFeedContainer.children[i].style.visibility = 'visible';
        }
        document.getElementsByClassName('ad-banner-container is-header-zone ember-view')[0].style.visibility = 'visible'
        document.getElementsByClassName('ad-banner-container artdeco-card ember-view')[0].style.visibility = 'visible'
        for (i = 0; i < document.getElementsByClassName('nav-item__badge').length; i++) {
            document.getElementsByClassName('nav-item__badge')[i].style.visibility = 'visible';
        }
    }
}

function isNewsBlocked () {
    if (!hasNewsLoaded()) {
        return false
    }
    return document.getElementsByClassName('feed-shared-news-module')[0].style.visibility == 'hidden'
}

function hasNewsLoaded () {
    return document.getElementsByClassName('feed-shared-news-module')[0] &&
        document.getElementsByClassName('core-rail')[0]
}