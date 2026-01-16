# 藤原豆腐店訂單系統 

一個模擬小型商家（頭文字D 藤原豆腐店）的 **完整訂單系統**，  
包含「客戶端下單 / 查詢」與「後台管理」功能，  
涵蓋前後端、JWT 驗證、訂單狀態管理與 PDF 單據產生。

---

## Live Demo

- **Client（客戶端）**  
  [https://fujiwara-tofu-shop.onrender.com](https://fujiwara-tofu-shop.onrender.com)

- **Admin Dashboard（後台）**  
  [https://fujiwara-tofu-shop.onrender.com/admin.html](https://fujiwara-tofu-shop.onrender.com/admin.html)

>  Render free 方案可能需要 **20–40 seconds** 冷啟動喚醒 (cold start).

---

## Deployment Architecture

本專案採用 **前後端整合部署** 的方式：

- React（Vite）負責前端開發與 build
- Express 提供 API 並 serve 前端 build 後的靜態檔
- 前後端共用同一個 domain / origin

### 考量點
- 避免前後端分開部署造成的冷啟動延遲
- 不需處理 CORS 與跨域問題
- 適合 Render / Railway 等平台部署

### 架構流程

Vite build  
→ 產生 `client/dist`  
→ Express serve static files  
→ 同一個 Server 處理 API 與前端請求


## 技術棧

### Frontend
- React + TypeScript
- Vite
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- PDFKit（產生訂單明細 PDF）

---

## 功能介紹

### 客戶端（Client）
- 建立訂單（後端驗證商品與金額）
- 輸入電話號碼查詢歷史訂單
- 即時計算訂單總金額

### 管理員端（Admin）
- 管理員登入（JWT）
- 查看所有訂單（依建立時間排序）
- 更新訂單狀態（準備中 / 已出貨）
- 刪除訂單
- 產生並開啟訂單 PDF 明細（需驗證 Token）

---

### Deployment
- Render (single service for frontend + backend)
- MongoDB Atlas

---

## 系統設計重點

- **後端不信任前端資料**
  - 商品價格與總金額皆由後端重新計算驗證
- **JWT 驗證保護後台 API**
  - 所有 admin API 皆需帶 Authorization header
- **Multi Page 架構**
  - client 與 admin 使用不同 HTML entry
- **HashRouter**
  - 解決 Vite Multi Page 在 dev/prod 的 routing 問題
- **PDF 即時串流**
  - 不落地存檔，直接產生並回傳給前端開啟

---

## 備註
- 本專案為學習與展示用途
- 重點放在 系統設計、資料驗證與前後端整合。# Fujiwara-Tofu-Shop
