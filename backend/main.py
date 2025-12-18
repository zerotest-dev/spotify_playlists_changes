from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn

from settings import settings
from db import supabase

app = FastAPI(title="Playlist QA Console API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Response models
class Playlist(BaseModel):
    id: str
    name: str
    owner: str
    like_count: int


class LikeResponse(BaseModel):
    playlist_id: str
    like_count: int


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"ok": True}


@app.get("/api/playlists", response_model=List[Playlist])
async def get_playlists():
    """Get all playlists ordered by like_count desc, then created_at desc."""
    try:
        response = supabase.table("playlists").select("*").order("like_count", desc=True).order("created_at", desc=True).execute()
        
        playlists = []
        for row in response.data:
            playlists.append(Playlist(
                id=str(row["id"]),
                name=row["name"],
                owner=row["owner"],
                like_count=row["like_count"]
            ))
        
        return playlists
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch playlists: {str(e)}")


@app.post("/api/playlists/{playlist_id}/like", response_model=LikeResponse)
async def like_playlist(playlist_id: str):
    """Increment like count for a playlist using the SQL function."""
    try:
        # Call the SQL function via RPC
        response = supabase.rpc("increment_playlist_like", {"p_playlist_id": playlist_id}).execute()
        
        # Debug: print response to see structure
        print(f"RPC Response: {response}")
        print(f"Response data: {response.data}")
        print(f"Response type: {type(response.data)}")
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Playlist not found")
        
        result = response.data[0]
        return LikeResponse(
            playlist_id=str(result["playlist_id"]),
            like_count=result["like_count"]
        )
    except HTTPException:
        raise
    except Exception as e:
        # Log the full error for debugging
        import traceback
        error_detail = str(e)
        print(f"Error type: {type(e)}")
        print(f"Error details: {error_detail}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to like playlist: {error_detail}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)

