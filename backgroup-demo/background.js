chrome.runtime.onStartup.addListener(() => {
    chrome.scripting.executeScript({
      target: { tabId: chrome.tabs.TAB_ID_NONE },
      func: () => {
        alert('欢迎使用本Chrome扩展，这是一个基于Manifest V3的示例！');
      }
    });
  });