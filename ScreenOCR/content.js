let isSelecting = false;
let startX, startY;
let overlay, selectionBox;

// 監聽 Background 傳來的啟動指令
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start_selection") {
    createOverlay();
  }
});

// 建立全螢幕遮罩與框選盒
function createOverlay() {
  if (overlay) return;

  overlay = document.createElement("div");
  overlay.id = "ocr-selector-overlay";

  selectionBox = document.createElement("div");
  selectionBox.id = "ocr-selection-box";
  overlay.appendChild(selectionBox);

  document.body.appendChild(overlay);

  overlay.addEventListener("mousedown", startSelection);
  overlay.addEventListener("mousemove", drawSelection);
  overlay.addEventListener("mouseup", endSelection);
}

function startSelection(e) {
  if (e.button !== 0) return; // 只允許滑鼠左鍵
  isSelecting = true;
  startX = e.clientX;
  startY = e.clientY;

  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  selectionBox.style.width = "0px";
  selectionBox.style.height = "0px";
  selectionBox.style.display = "block";
}

function drawSelection(e) {
  if (!isSelecting) return;

  const currentX = e.clientX;
  const currentY = e.clientY;

  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  selectionBox.style.left = `${Math.min(currentX, startX)}px`;
  selectionBox.style.top = `${Math.min(currentY, startY)}px`;
  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
}

function endSelection(e) {
  if (!isSelecting) return;
  isSelecting = false;

  const rect = selectionBox.getBoundingClientRect();
  removeOverlay();

  // 寬高太小則視為誤觸
  if (rect.width < 10 || rect.height < 10) return;

  // 向 Background 請求全螢幕截圖
  chrome.runtime.sendMessage({ action: "capture_tab" }, (response) => {
    if (response && response.dataUrl) {
      cropImage(response.dataUrl, rect);
    }
  });
}

function removeOverlay() {
  if (overlay) {
    overlay.remove();
    overlay = null;
    selectionBox = null;
  }
}

// 根據滑鼠框選的座標，用 Canvas 裁切圖片
function cropImage(dataUrl, rect) {
  const img = new Image();
  img.src = dataUrl;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // 考量 Retina 高解析度螢幕的縮放比 (Device Pixel Ratio)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.drawImage(
      img,
      rect.left * dpr,
      rect.top * dpr,
      rect.width * dpr,
      rect.height * dpr,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // 將裁切後的圖片轉為 Base64 並送去 OCR
    const croppedDataUrl = canvas.toDataURL("image/png");
    performOCR(croppedDataUrl);
  };
}

// 呼叫免費 OCR API 辨識文字
function performOCR(base64Image) {
  console.log("正在辨識文字...");
  
  // 建立 FormData 格式
  const formData = new FormData();
  formData.append("base64Image", base64Image);
  formData.append("language", "eng"); // 驗證碼多為英文數字，這裡設為 eng。若要中文可改 chs
  formData.append("isOverlayRequired", "false");

  // 使用 OCR.space 免費 API Key (這是官方公開的免費測試 Key)
  fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: { "apikey": "helloworld" },
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data && data.ParsedResults && data.ParsedResults.length > 0) {
      let text = data.ParsedResults[0].ParsedText.trim();
      // 去除可能因為驗證碼雜訊產生的換行
      text = text.replace(/\s+/g, ''); 
      
      if (text) {
        copyToClipboard(text);
      } else {
        alert("未能辨識出文字，請再試一次。");
      }
    } else {
      alert("OCR 辨識失敗。");
    }
  })
  .catch(err => {
    console.error(err);
    alert("連線 OCR 伺服器失敗。");
  });
}

// 複製到剪貼簿並提示
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`辨識成功並已複製：\n${text}`);
  }).catch(err => {
    alert("複製到剪貼簿失敗，請手動複製：" + text);
  });
}