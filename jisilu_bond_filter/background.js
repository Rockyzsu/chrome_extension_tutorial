chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'callPageFunction') {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      world: 'MAIN',
      func: (fnName) => { window[fnName](); },
      args: [message.fnName]
    });
  }
});
