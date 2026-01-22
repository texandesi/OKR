# OKR Manager

A web application for managing Objectives and Key Results (OKRs) with KPI tracking.

## Features

- Document objectives with descriptions
- Attach key results to objectives with progress tracking
- Track KPIs to measure in-flight progress
- Manage users, roles, groups, and organizations
- Simple, intuitive interface

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy 2.0** - Async ORM with aiosqlite
- **Pydantic** - Data validation and serialization
- **SQLite** - Database (easily swappable)

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Server state management
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Client-side routing

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+

### Backend Setup

```bash
cd back-end
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at http://127.0.0.1:8000

API documentation available at http://127.0.0.1:8000/docs

### Frontend Setup

```bash
cd front-end
npm install
npm run dev
```

Frontend runs at http://localhost:5173

## Project Structure

```
OKR/
├── back-end/
│   ├── app/
│   │   ├── models/      # SQLAlchemy models
│   │   ├── routers/     # API endpoints
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── config.py    # Settings
│   │   ├── database.py  # DB connection
│   │   └── main.py      # FastAPI app
│   ├── requirements.txt
│   └── okr.db           # SQLite database
│
├── front-end/
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── components/  # Reusable components
│   │   ├── features/    # Feature pages
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilities
│   │   └── types/       # TypeScript types
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| GET/POST `/objectives/` | List/Create objectives |
| GET/PUT/DELETE `/objectives/{id}/` | Get/Update/Delete objective |
| GET/POST `/keyresults/` | List/Create key results |
| GET/PUT/DELETE `/keyresults/{id}/` | Get/Update/Delete key result |
| GET/POST `/kpis/` | List/Create KPIs |
| GET/POST `/users/` | List/Create users |
| GET/POST `/roles/` | List/Create roles |
| GET/POST `/groups/` | List/Create groups |
| GET/POST `/organizations/` | List/Create organizations |

## License

MIT License - see LICENSE.md
