chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.method === "getStorage") {
        if (message.extensionSettings === "storage") {
            sendResponse({extdata: JSON.parse(localStorage.getItem("extdata") || '{}')});
        }
    }
    else if (message.method === "setStorage") {
        localStorage.setItem("extdata", JSON.stringify(message.newData));
    }
})

var todos = [
    {text: 'use.typekit.net', done: true},
    {text: 'googleapis.com', done: true}
];

localStorage.setItem("extdata", JSON.stringify(todos));

function checkUrl(url) {
    var todoitems = JSON.parse(localStorage.getItem("extdata")) || {};
    for (var i = 0; i < todoitems.length; i++) {
        if (todoitems[i].done) {
            if (url.match("/.*" + todoitems[i].text + ".*/")) {
                return true;
            }
        }
    }
    return false;
};

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        return {cancel: checkUrl(details.url) !== false};
    },
    {urls: ["<all_urls>"]},
    ["blocking"]);