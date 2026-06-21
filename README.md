# Moodex 🌸

[![CI](https://github.com/shriabiju/moodex/actions/workflows/ci.yml/badge.svg)](https://github.com/shriabiju/moodex/actions/workflows/ci.yml)
[![Python](https://img.shields.io/badge/python-3.12-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-19-61DAFB)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](#license)

> AI-powered emotional wellness analytics platform

Moodex helps you track your mood, journal your thoughts, and discover beautiful patterns in your emotional life — all powered by AI and NLP.

---

## Screenshots

**Landing Page**
![Landing page](screenshots/ss1.png)

**Login**
![Login page](screenshots/ss2.png)

**Sign Up / Onboarding**
![Sign up and onboarding](screenshots/ss3.png)

**Dashboard**
![Dashboard](screenshots/ss4.png)

**Mood Tracker**
![Mood tracker](screenshots/ss5.png)

**Journal**
![Journal](screenshots/ss6.png)

**Journal Entry with Sentiment Analysis**
![Journal entry with sentiment analysis](screenshots/ss7.png)

**Analytics**
![Analytics dashboard](screenshots/ss8.png)

**AI Insights**
![AI wellness insights](screenshots/ss9.png)

**Settings**
![Settings page](screenshots/ss10.png)

---

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- React Router

**Backend**
- FastAPI (Python)
- SQLAlchemy ORM
- MySQL (pymysql)
- JWT Authentication
- VADER + TextBlob NLP

---

## Project Structure

```
moodex/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       └── utils/
├── backend/
│   └── app/
│       ├── api/
│       ├── core/
│       ├── db/
│       ├── models/
│       ├── schemas/
│       └── services/
└── README.md
```

---

## Getting Started

### Quickest path: Docker Compose

If you have Docker installed, this spins up the backend, frontend, and a MySQL database with one command:

```bash
cp backend/.env.example backend/.env   # adjust SECRET_KEY if you like
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend + API docs: http://localhost:8000/docs

---

### Manual Setup

#### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8.0+

---

### Backend Setup

```bash
cd backend
cp .env.example .env   # then fill in your MySQL credentials and a real SECRET_KEY
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000

API docs at: http://localhost:8000/docs

---

### Running Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest -v
```

Tests run against an isolated in-memory SQLite database, so no MySQL connection is needed to run the suite. The same command runs automatically in CI on every push (see the badge above).

---

### Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

### Database Setup

```sql
CREATE DATABASE moodex;
```

Tables are created automatically on first backend startup.

---

## Environment Variables

Copy `.env.example` to `.env` in both `backend/` and `frontend/` and fill in real values. Never commit your actual `.env` files (they're already gitignored).

### backend/.env

```env
DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/moodex
SECRET_KEY=your-super-secret-key   # generate with: python -c "import secrets; print(secrets.token_hex(32))"
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

### frontend/.env

```env
VITE_API_URL=http://localhost:8000
```

---

## Features

| Feature | Status |
|---------|--------|
| JWT Authentication (bcrypt + rate-limited) | Done |
| Mood Tracking | Done |
| Journaling | Done |
| NLP Sentiment Analysis (VADER + TextBlob ensemble) | Done |
| Analytics Dashboard (SQL-aggregated) | Done |
| AI Wellness Insights | Done |
| Weekly Report | Done |
| Onboarding Flow | Done |
| Settings | Done |
| Landing Page | Done |
| Responsive Design | Done |
| Automated test suite (pytest, 37 tests) | Done |
| CI (GitHub Actions) | Done |
| Dockerized (backend + frontend + MySQL) | Done |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |
| POST | /api/mood/ | Log mood entry |
| GET | /api/mood/ | Get mood history |
| GET | /api/mood/weekly | Get weekly moods |
| POST | /api/journal/ | Create journal entry |
| GET | /api/journal/ | Get journal entries |
| PUT | /api/journal/{id} | Update entry |
| DELETE | /api/journal/{id} | Delete entry |
| GET | /api/analytics/summary | Weekly averages |
| GET | /api/analytics/mood-trend | Mood trend data |
| GET | /api/analytics/mood-distribution | Mood breakdown |
| GET | /api/analytics/correlations | Sleep vs productivity |
| GET | /api/insights/ | AI wellness insights |

---

## Deployment

### Frontend to Vercel

```bash
cd frontend
npm run build
```

Push to GitHub and connect repo to Vercel. Set environment variable VITE_API_URL to your backend URL.

### Backend to Render

Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Set all environment variables from backend/.env in the Render dashboard.

### Database

Use PlanetScale, Railway, or any hosted MySQL provider. Copy the connection string into DATABASE_URL.

---

## NLP Pipeline

Journal entries are automatically analyzed using:

- VADER Sentiment Analysis for compound scoring
- TextBlob for polarity and subjectivity
- Custom emotion keyword detection for tags like anxiety, stress, motivation, happiness, calm, anger, sadness

Results stored per entry: sentiment label, sentiment score, emotional tags.

---

## AI Insights Engine

Insights are generated from your last 7 days of mood data. Examples:

- Your stress tends to be higher on low-sleep days. Try to aim for 7-8 hours.
- Your productivity has been strong this week. Keep up the momentum.
- Good sleep strongly correlates with your productive days.

No external AI API required for basic insights. Gemini or OpenAI can be plugged in for Phase 2 summaries.

---

## Running Both Servers

Open two terminals:

Terminal 1 - Backend:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## Pages

| Route | Page | Access |
|-------|------|--------|
| / | Landing | Public |
| /signup | Sign Up | Public |
| /login | Login | Public |
| /onboarding | Onboarding | Protected |
| /dashboard | Dashboard | Protected |
| /mood | Mood Tracker | Protected |
| /journal | Journal | Protected |
| /analytics | Analytics | Protected |
| /report | Weekly Report | Protected |
| /settings | Settings | Protected |

---

## Customizing the Theme

Edit the CSS variables at the top of frontend/src/index.css:

```css
:root {
  --color-primary:   #9333EA;
  --color-secondary: #C084FC;
  --page-bg-from:    #F9F5FF;
  --page-bg-mid:     #F5F0FF;
  --page-bg-to:      #FDF0FF;
  --text-primary:    #3B0764;
  --text-secondary:  #A855F7;
  --text-muted:      #C084FC;
  --border-light:    #F5D0FE;
  --blob-1:          rgba(147,51,234,0.12);
  --blob-2:          rgba(192,132,252,0.12);
  --btn-shadow:      rgba(147,51,234,0.25);
  --scrollbar-color: #C084FC;
}
```

---

## Future Roadmap

| Feature | Effort |
|---------|--------|
| PDF weekly report download | Medium |
| Voice journaling via Web Speech API | Medium |
| Gemini or OpenAI AI summaries | Medium |
| Dark mode toggle | Easy |
| Mood streak tracking | Easy |
| HuggingFace transformer NLP | Hard |

---

## License

MIT. Free to use for portfolio, learning, and personal projects.

---

Built with love using FastAPI and React.