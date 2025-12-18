# Playlist QA Console

An internal tool for managing and testing playlist interactions. The console displays playlists with like counts and allows users to interact with them.

## Architecture

- **Frontend**: React + Vite + TypeScript (runs on `:5173`)
- **Backend**: FastAPI + Python (runs on `:8000`)
- **Database**: Supabase (PostgreSQL)

## Local Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Supabase account and project

### 1. Supabase Configuration

1. Create a new Supabase project or use an existing one
2. Copy `backend/.env.example` to `backend/.env`
3. Fill in your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   PORT=8000
   CORS_ORIGINS=http://localhost:5173
   ```

### 2. Database Setup

1. Open the Supabase SQL Editor in your project dashboard
2. Run `supabase/schema.sql` first to create the table and function
3. Run `supabase/seed.sql` to insert sample data

### 3. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will run on `http://localhost:8000`

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env  # Edit if needed
npm run dev
```

The web app will run on `http://localhost:5173`

## API Endpoints

- `GET /health` - Health check
- `GET /api/playlists` - List all playlists (ordered by like_count desc, then created_at desc)
- `POST /api/playlists/{playlist_id}/like` - Increment like count for a playlist

## Known Issue

The like count displayed in the UI may become stale after clicking the Like button. The backend correctly updates the count, but the UI does not automatically refresh to reflect the change. Use the "Refetch" button to manually update the playlist list and see the latest like counts.

## DB Inspection (Beekeeper)

If you need to inspect the playlists in the dev database, see:

- docs/BEKEEPER.md




