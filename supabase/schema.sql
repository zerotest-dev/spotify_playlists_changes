-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    owner text NOT NULL,
    like_count integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create function to increment playlist like count atomically
CREATE OR REPLACE FUNCTION increment_playlist_like(p_playlist_id uuid)
RETURNS TABLE (playlist_id uuid, like_count integer)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE playlists p
    SET like_count = p.like_count + 1,
        updated_at = now()
    WHERE p.id = p_playlist_id
    RETURNING p.id AS playlist_id, p.like_count;
END;
$$;

