window.frontendSigned = {};
window.frontendConnected = {};
window.siteConnected = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.data.opened) {
      chrome.tabs.query({active: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { opened: true });
      });
    }

    if ('authSuccess' in message.data) {
      chrome.tabs.query({active: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { ...message.data });
      });
    }

    if (message.type === 'sollar-is-signed-response') {
      window.siteConnected[sender.tab.id] = message.data.isAuth || false;
    }

    if (message.valid) {
      if (window.frontendMethods) {
        window.frontendMethods[sender.tab.id] = message.data || null;
        window.frontendConnected[sender.tab.id] = {connected: true, tab: sender.tab.title};
      } else {
        window.frontendMethods = {};
        window.frontendConnected = {};
        window.frontendMethods[sender.tab.id] = message.data || null;
        window.frontendConnected[sender.tab.id] = {connected: true, tab: sender.tab.title};
      }
    }
});
