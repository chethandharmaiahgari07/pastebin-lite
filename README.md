# 📝 Pastebin Lite

A simple and lightweight **Pastebin-like application** built as a take-home assignment.  
It allows users to create text pastes and share them via unique URLs with optional expiry rules.

---

## ✨ Features
- 📄 Create a text paste
- 🔗 Generate a unique shareable URL
- 👀 View paste directly in the browser
- ⏳ Optional expiry by time (TTL)
- 🔢 Optional expiry by number of views
- 🗄️ Redis-backed persistence

---

## 🛠️ Tech Stack
- ⚡ **Next.js** (App Router)
- 🟦 **TypeScript**
- 🔴 **Upstash Redis**
- ☁️ **Vercel**

---

## 🔌 API Endpoints

### 🩺 Health Check
**GET** `/api/healthz`

Response:
```json
{ "ok": true }


➕ Create Paste

POST /api/pastes

Request Body:

{
  "content": "Hello Aganitha!",
  "ttl_seconds": 60,
  "max_views": 5
}


Response:

{
  "id": "AbC123",
  "url": "https://<domain>/p/AbC123"
}

📥 Fetch Paste (API)

GET /api/pastes/:id

Response:

{
  "content": "Hello Aganitha!",
  "remaining_views": 4,
  "expires_at": "2025-01-01T10:00:00.000Z"
}

🌐 View Paste (Browser)

GET /p/:id

Displays the paste content directly in the browser.

▶️ Running Locally
npm install
npm run dev


Open 👉 http://localhost:3000

🗄️ Persistence

All paste data is stored using Redis (Upstash) to ensure fast access and persistence across requests.

🧪 Notes
Supports deterministic testing using TEST_MODE and x-test-now-ms header
UI is intentionally minimal — focus is on backend functionality and correctness
