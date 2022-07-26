window.addEventListener("load",() => {

    window.postMessage({ target: 'sollar-wallet-inpage' }, '*');
    window.postMessage({ type: "sollar-handshake-extension", data: "nothing" });
    window.postMessage({ type: "sollar-is-signed" });
})

window.addEventListener("message", function (event) {
    if (event.source != window)
        return;

    if (event.data?.target?.includes('metamask'))
        return;

    if (event.data?.wappalyzer)
        return;

    // console.log('app.js', event.data);

    if (event.data?.type == 'sollar-handshake-frontend' && typeof chrome.app.isInstalled !== 'undefined') {
        chrome.runtime.sendMessage({ valid: true, data: event.data.data });
        // console.log("ЕСТЬ КОНТАКТ!", event.data);
    }

    if (event.data?.type == 'sollar-is-signed-response') {
        chrome.runtime.sendMessage({ type: event.data.type, data: event.data.data})
    }
}, false);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // console.log('app.js message', message);

    if ('authSuccess' in message) {
      window.postMessage({
            type: "sollar-signed",
            data: {
                ...message,
            }
        });
    }

    if (message.opened === true) {
        window.postMessage({ type: "sollar-handshake-extension", data: "nothing" });
    }
});
