// 監聽點擊套件圖示事件
chrome.action.onClicked.addListener(async (tab) => {
  // 忽略不支援的 chrome:// 網頁或空白頁
  if (!tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
    console.log("此網頁不支援執行擴充套件");
    return;
  }

  try {
    // 【核心優化】點擊時，強制再注入一次 content.js 與 content.css，確保腳本一定存在
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["content.css"]
    });

    // 注入成功後，發送啟動訊號
    chrome.tabs.sendMessage(tab.id, { action: "start_selection" });
  } catch (err) {
    console.error("腳本注入失敗: ", err);
  }
});

// 監聽來自 content.js 的截圖請求
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "capture_tab") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      sendResponse({ dataUrl: dataUrl });
    });
    return true; // 保持非同步通道開啟
  }
});
