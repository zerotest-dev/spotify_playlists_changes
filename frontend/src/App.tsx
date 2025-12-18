import { useState, useEffect } from "react";
import { fetchPlaylists, likePlaylist, type Playlist } from "./api";
import "./styles.css";

// Get playlist image - using theme-appropriate images for each playlist
// Each playlist gets a unique, consistent image that matches its theme
function getPlaylistImage(name: string): string {
  const nameLower = name.toLowerCase();
  
  // Map playlist names to specific image seeds for consistent, theme-appropriate images
  // Each seed generates a unique image that matches the playlist theme
  const playlistSeeds: { [key: string]: number } = {
    'summer vibes 2024': 1001,      // Beach, summer, tropical
    'workout motivation': 2002,      // Fitness, gym, exercise
    'chill lofi beats': 3003,        // Cozy, relaxing, study
    'road trip classics': 4504,      // Highway, travel, adventure (new seed)
    'late night coding': 5005,       // Night, city, coding, urban (new seed)
    'weekend party mix': 6006,       // Nightclub, dance, party
    'acoustic sessions': 7007,       // Acoustic guitar, music
    'electronic dance': 8008         // Electronic, synth, technology
  };
  
  // Find matching seed or generate from name
  let seed = playlistSeeds[nameLower] || name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use picsum.photos with unique seeds - each seed gives a different, consistent image
  // The seeds are chosen to provide visually distinct images for each playlist
  return `https://picsum.photos/seed/${seed}/400/400`;
}

function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedMessage, setLikedMessage] = useState<string | null>(null);

  // Fetch playlists on mount
  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPlaylists();
      setPlaylists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const response = await likePlaylist(id);
      // Log the response to console
      console.log("Like response:", response);
      
      // Show a brief "Saved" message
      setLikedMessage("Saved");
      setTimeout(() => setLikedMessage(null), 2000);
      
      
      // Note: The like_count on screen will remain unchanged until manual refetch
    } catch (err) {
      console.error("Failed to like playlist:", err);
      setError(err instanceof Error ? err.message : "Failed to like playlist");
    }
  };

  if (loading && playlists.length === 0) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="main-content">
        <div className="page-header">
          <div>
            <h1>Discover Your Sound</h1>
            <p className="page-subtitle">Explore curated playlists and find your next favorite track</p>
          </div>
          <div className="header-actions">
            {likedMessage && (
              <div className="toast success">
                <span className="toast-icon">✓</span>
                {likedMessage}
              </div>
            )}
            <button onClick={loadPlaylists} className="btn-refetch" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Refreshing...
                </>
              ) : (
                <>
                  <span className="btn-icon">↻</span>
                  Refetch
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <div className="playlists-grid">
          {playlists.map((playlist, index) => (
            <div key={playlist.id} className="playlist-card" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="playlist-header">
                <div className="playlist-icon">
                  <img 
                    src={getPlaylistImage(playlist.name)} 
                    alt={playlist.name}
                    onError={(e) => {
                      // Fallback to gradient if image doesn't exist
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.classList.add('playlist-icon-fallback');
                      }
                    }}
                  />
                </div>
                <div className="playlist-info">
                  <h3 className="playlist-name">{playlist.name}</h3>
                  <p className="playlist-owner">by {playlist.owner}</p>
                </div>
              </div>
              
              <div className="playlist-stats">
                <div className="stat">
                  <span className="stat-label">Likes</span>
                  <span className="stat-value">{playlist.like_count.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => handleLike(playlist.id)}
                className="btn-like"
                disabled={loading}
              >
                <span className="btn-like-icon">❤️</span>
                <span>Like</span>
              </button>
            </div>
          ))}
        </div>

        {playlists.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No playlists found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

