// API base URL from environment variable, fallback to relative path for production
// In production (Vercel), use relative paths since API is on the same domain
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.PROD ? "" : "http://localhost:8000");

// Types
export interface Playlist {
  id: string;
  name: string;
  owner: string;
  like_count: number;
}

export interface LikeResponse {
  playlist_id: string;
  like_count: number;
}

/**
 * Fetch all playlists from the API.
 */
export async function fetchPlaylists(): Promise<Playlist[]> {
  const response = await fetch(`${API_BASE_URL}/api/playlists`);
  if (!response.ok) {
    throw new Error(`Failed to fetch playlists: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Like a playlist by incrementing its like count.
 * Returns the updated like count.
 */
export async function likePlaylist(id: string): Promise<LikeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/playlists/${id}/like`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Failed to like playlist: ${response.statusText}`);
  }
  return response.json();
}

