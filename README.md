# 🚀 News App (YOLO Edition)

Modern News Aggregator with FastAPI backend and React frontend.

## ⚡ Quick Start (Docker)

If you have Docker installed, this is all you need:

```bash
# 1. Clone & Enter
git clone <repo-url> news-app && cd news-app

# 2. Setup Env
cp .env.example .env

# 3. Just Run It
docker-compose up -d --build
```

---

## 🔗 Access Points

| Service | URL |
| :--- | :--- |
| **Frontend** | [http://localhost:3050](http://localhost:3050) |
| **Backend API** | [http://localhost:8050/api](http://localhost:8050/api) |
| **API Docs (Swagger)** | [http://localhost:8050/docs](http://localhost:8050/docs) |

---

## 🛠️ Local Development

### Backend (Python 3.11+)
```bash
cd backend
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend (Node 20+)
```bash
cd frontend
npm install
npm run dev
```

---

## ⚙️ Config
Edit `.env` to set:
- `TELEGRAM_BOT_TOKEN`: For notifications.
- `APP_USERNAME` / `APP_PASSWORD`: Default admin login.

## 🧪 Tech Stack
- **Backend:** FastAPI, PostgreSQL, SQLAlchemy, Pydantic.
- **Frontend:** React, TypeScript, Vite, Tailwind CSS.
- **Ops:** Docker, Docker Compose, Nginx.
