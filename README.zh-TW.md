<p align="center">
  <img src="assets/clean-link-final.png" width="88" height="88" alt="TidyShareLink：藍底、米白剪角紙張、深色連結與黃色紙角">
</p>
<h1 align="center">TidyShareLink</h1>
<p align="center">整理好連結，再分享。</p>
<p align="center">免費、開源的 Raycast 擴充功能，在 Mac 本機移除常見追蹤參數。<br>先看清楚變更，再複製或貼上。</p>
<p align="center"><a href="#安裝">在 Mac 安裝</a> · <a href="README.md">English</a> · <a href="#隱私與限制">隱私</a> · <a href="CONTRIBUTING.md">參與開發</a></p>

<p align="center"><a href="https://github.com/bblurock/tidy-share-link/releases/download/v0.1.0/tidysharelink-product-video.mp4"><img src="docs/images/demo.gif" width="750" alt="TidyShareLink 實錄：複製瀏覽器網址，在 Raycast 預覽移除追蹤參數，再將整理後的連結貼回瀏覽器。"></a></p>

<p align="center">10 秒操作示範：複製連結、在 Raycast 整理，再貼上結果。使用 <a href="https://github.com/getopenscreen/openscreen">OpenScreen</a> 編輯。<a href="https://github.com/bblurock/tidy-share-link/releases/download/v0.1.0/tidysharelink-product-video.mp4">高畫質影片（MP4）</a> · <a href="docs/images/preview.jpg">靜態截圖</a>。</p>

```text
整理前   https://example.com/?id=42&fbclid=demo
整理後   https://example.com/?id=42
```

## 日常分享的小工具

- **先看見變更。** 複製前，同時顯示整理後的連結與移除的參數名稱。
- **保留有用資訊。** 內建規則保留時間戳記、播放清單、未知參數與片段識別碼；常見簽章連結保持原樣。
- **依需求調整。** 新增要移除的參數或前綴規則，也能指定永遠保留的參數。

整理過程在本機執行，不抓取連結、不傳送使用分析，也不建立自己的網址紀錄。目前擴充功能介面為英文。

## 安裝

**目前提供 macOS 原始碼安裝，尚未上架 Raycast Store。** 需要 [Raycast](https://www.raycast.com/)、含 npm 的 [Node.js](https://nodejs.org/en/download) 22.22.2 以上版本，以及 Git。Node 24 也可使用。

1. 下載專案並安裝相依套件：

   ```sh
   git clone https://github.com/bblurock/tidy-share-link.git
   cd tidy-share-link
   npm ci
   ```

2. 將擴充功能加入 Raycast：

   ```sh
   npm run dev
   ```

3. 開啟 Raycast，搜尋 **Tidy Link**，試貼 `https://example.com/?id=42&fbclid=demo`。

指令出現後，可以在終端機按 **Ctrl+C** 停止開發程序。擴充功能會留在 Raycast 中，重新啟動 Mac 後仍可使用，無須讓終端機持續執行。這是 [Raycast 支援的本機開發流程](https://developers.raycast.com/basics/create-your-first-extension)。若 Raycast 要求登入以完成開發設定，請依提示操作；TidyShareLink 沒有另外的帳號。

也可以在 GitHub 選擇 **Code → Download ZIP**，解壓縮後在該資料夾開啟終端機，從 `npm ci` 開始。

## 使用方式

開啟 **Tidy Link** 時，若已啟用剪貼簿預覽，會載入剪貼簿中的完整 HTTP/HTTPS 網址。也可以自行在 **Link** 欄位貼上。確認結果後，再選擇動作：

| 動作 | 快捷鍵 |
| --- | --- |
| 複製並關閉 Raycast | ⌘Return |
| 貼到先前使用的 App | ⌘⇧Return |
| 重新載入剪貼簿連結 | ⌘⇧V |
| 設定規則 | ⌘⇧P |
| 顯示所有動作 | ⌘K |

預覽不會自動複製或貼上。

### 更新與移除

以 Git 安裝的使用者，可在專案資料夾依序執行 `git pull --ff-only`、`npm ci`、`npm run dev`，完成註冊後按 Ctrl+C。更新前請先保護自己的本機修改。使用 ZIP 安裝時，下載新版並重新執行安裝流程。目前沒有自動更新檢查。

移除時，開啟 **Raycast Settings → Extensions**，選取 **TidyShareLink** 並使用移除功能。只刪除原始碼資料夾，不會移除已註冊的指令。

## 自訂規則

按 **⌘⇧P** 開啟 **Configure Rules**，或到 Raycast Settings → Extensions 找到 TidyShareLink。修改設定後，請重新開啟指令。

| 設定 | 範例 | 用途 |
| --- | --- | --- |
| Additional Parameters to Remove | `campaign_id, track_*` | 在所有網站額外移除這些參數 |
| Parameters to Always Keep | `ref, campaign_id` | 優先保留，覆蓋內建與額外移除規則 |
| Start with Clipboard | 預設開啟 | 開啟時預覽剪貼簿網址 |

參數名稱不分大小寫，以逗號或空白分隔。結尾的 `*` 表示前綴比對：`track_*` 會符合 `track_source`，但不符合 `track`。支援英文字母、數字、`_`、`-`、`.`、`~`；只需輸入名稱，不含 `?`、`&` 或 `=值`。

不接受單獨的 `*`、正規表示式，或出現在名稱中間的萬用字元。設定格式錯誤時會顯示說明，修正前無法複製結果。兩個規則欄位留白即可使用預設規則。常見簽章連結保護的優先順序高於所有自訂規則。

## 會移除哪些內容？

| 連結 | 內建行為 |
| --- | --- |
| 所有網站 | 移除 `utm_*`、`fbclid`、`gclid`、`msclkid` 等常見追蹤參數 |
| YouTube | 移除 `si`；保留影片 ID、`t`、播放清單等資訊 |
| Instagram | 移除 `igsh` 與通用規則中的 `igshid` |
| Facebook | 移除 `mibextid` 與通用追蹤參數 |
| Spotify | 移除 `open.spotify.com` 的 `si` |
| X / Twitter 貼文 | 移除數字 status 路徑中的 `s`、`t` |
| 常見簽章／存取權杖連結 | 保留整條網址，並顯示原因 |

[完整規則](src/clean-url.ts)可直接檢視。保留的查詢值維持原始編碼、順序及重複值。未知參數、路徑與 `#` 後的片段不變。這是一組保守規則，無法保證移除所有追蹤，或適用於所有網站。

## 隱私與限制

擴充功能不會開啟輸入的連結、不會為了解析網址發送網路請求、不執行網頁腳本、不傳送使用分析，也不保存自己的網址歷史。只有在啟用啟動預覽，或主動選擇 **Use Link from Clipboard** 時才讀取剪貼簿。複製或貼上後，仍適用 Raycast 本身的剪貼簿歷史設定。

安裝或更新相依套件會連線到 npm、GitHub。Raycast 自身的服務與此擴充功能的本機整理行為是分開的。

**短網址維持原樣。** `threads.com/share/...`、`bit.ly/...`、`t.co/...` 等不透明短碼不會展開。目的地可能只存在服務商的伺服器；即使不帶瀏覽器 Cookie，查詢本身仍可能被記錄。看起來簡短的網址，不代表完全沒有追蹤。

這個版本不解析任何重新導向包裝，包含已內嵌目的地的包裝網址，也不移除藏在路徑或片段中的追蹤資訊。簽章偵測採啟發式規則，無法保證所有連結都不受影響。分享特殊連結前，請先確認預覽。

## 一起改善

發現遺漏的參數？歡迎[提出追蹤規則](https://github.com/bblurock/tidy-share-link/issues/new?template=tracking_rule.yml)，附上不含個人資訊的範例與可安全移除的依據。也可以[回報問題](https://github.com/bblurock/tidy-share-link/issues/new?template=bug_report.yml)、修正翻譯，或分享給需要的人。

由 [Benson Lu](https://github.com/bblurock) 製作。可以在 GitHub 追蹤後續作品。

## 開發與授權

```sh
npm ci
npm test
npm run typecheck
npm run build
```

網址邏輯位於 [`src/clean-url.ts`](src/clean-url.ts)，Raycast 表單位於 [`src/clean-link.tsx`](src/clean-link.tsx)。測試與型別檢查不需要 Raycast；在 macOS 建置／註冊擴充功能時，Raycast CLI 會寫入本機設定資料夾。

執行 `npm run icons` 可重新匯出圖示。另見[貢獻指南](CONTRIBUTING.md)、[圖示設計說明](design/ICONS.md)與[更新紀錄](CHANGELOG.md)。

採用 [MIT 授權](LICENSE)，可自由使用、修改及分享。使用 [Raycast API](https://developers.raycast.com/) 建置；相依套件各自保有原授權。主圖示透過 AI 圖像生成並經視覺檢視調整，專案包含選定的原圖與工具 SVG，延續 Benson 的 Open Studio 紙張、墨色與藍色設計方向。
