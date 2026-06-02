# 🔍 網頁滑鼠框選 OCR 文字辨識 (ScreenOCR Chrome Extension)

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg?logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![Manifest Version](https://img.shields.io/badge/Manifest-V3-orange.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一個輕量、快速且實用的 Google Chrome 擴充套件。讓你用滑鼠左鍵輕鬆一拖，就能將網頁上的任意區域（如：圖形驗證碼、無法複製的文字、圖片中的密碼）瞬間轉化為純文字，並**自動複製到剪貼簿**！

---

## ✨ 特色功能

* 🎯 **直覺框選**：點擊套件圖示後，畫面自動進入遮罩模式，按住滑鼠左鍵即可自由拉取辨識範圍。
* ⚡ **高畫質裁切**：支援 `Device Pixel Ratio` 自動縮放，完美相容 Retina 等高解析度螢幕，確保驗證碼不失真。
* 🤖 **免費 OCR 整合**：串接免註冊的 `OCR.space` API，無須繁瑣設定即可直接使用。
* 📋 **自動剪貼簿**：辨識完成後自動去除多餘空白與換行，第一時間寫入剪貼簿，直接 `Ctrl + V` 即可貼上。
* 🔒 **安全輕量**：採用最新的 Chrome Extension Manifest V3 架構，動態注入腳本，不佔用後台記憶體。

---

## 🛠️ 技術棧

* **前端技術**: JavaScript (Vanilla JS), HTML5 Canvas, CSS3
* **瀏覽器 API**: `chrome.scripting`, `chrome.tabs.captureVisibleTab`, `navigator.clipboard`
* **後端 OCR**: [OCR.space Free API](https://ocr.space/OCRAPI)

---

## 🚀 本地安裝教學 (Developer Mode)

由於本套件目前為開源專案，您可以透過以下步驟直接載入至 Chrome 瀏覽器中使用：

### 1. 下載專案
將此專案 Clone 到本地，或下載 ZIP 解壓縮至您的電腦資料夾中。
```bash
git clone https://github.com/JoeTseng/ScreenOCR.git

```

### 2. 開啟 Chrome 擴充功能管理頁面

在 Chrome 網址列輸入並前往：

```text
chrome://extensions/

```

### 3. 開啟開發者模式

切換右上角的 **「開發者模式」 (Developer mode)** 開關至 **開啟** 狀態。

### 4. 載入套件

1. 點擊左上角的 **「載入未封裝項目」 (Load unpacked)**。
2. 選擇本專案的根目錄資料夾（該資料夾內需含有 `manifest.json`）。

### 5. 釘選套件

建議點擊 Chrome 右上角的「拼圖圖示」，將 **「滑鼠框選 OCR 文字辨識」** 釘選至工具列，方便隨時點擊使用。

---

## 💡 使用說明

1. 前往任意網頁（*註：Chrome 官方線上商店與 `chrome://` 開頭的系統網頁因安全限制不支援*）。
2. 點擊工具列的套件圖示 🔍，網頁畫面會微微變暗。
3. 按住 **滑鼠左鍵** 並拖曳，拉出一個框格將驗證碼或目標文字包起來。
4. **放開滑鼠左鍵**，系統會自動截圖並送出辨識。
5. 辨識成功後會跳出確認視窗，此時文字已複製，直接前往輸入框按下 `Ctrl + V` 即可！
<img width="1408" height="768" alt="demo" src="https://github.com/user-attachments/assets/7d73bdcf-07ec-4d66-aa06-006df16a70eb" />

> ⚠️ **貼心提醒**：
> 本套件預設使用 OCR.space 的公用金鑰 (`helloworld`)。若您有非常高頻率、大量的使用需求，建議至 [OCR.space 官網](https://ocr.space/ocrapi) 免費申請一組個人專屬的 API Key，並替換掉 `content.js` 中的 `apikey` 欄位，以獲得更穩定的連線速度。

---

## 📁 專案結構

```text
├── manifest.json    # 套件定義與權限設定
├── background.js    # 後台 Service Worker，負責視窗截圖調度
├── content.js       # 核心邏輯：滑鼠框選畫布、Canvas 裁切與 API 呼叫
└── content.css      # 框選時的半透明遮罩與虛線框視覺樣式

```

---

## 📄 開源授權

本專案基於 **MIT License** 進行開源，歡迎自由 Fork、修改或提交 PR！

```

```
