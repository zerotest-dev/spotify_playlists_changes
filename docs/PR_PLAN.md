# PR Plan

## Title
Fix **Follow Artist** button so UI updates immediately

## Summary
When a user clicks **Follow**, the request succeeds and the backend updates, but the UI doesn't reflect the new follow state until a refresh. This PR updates the UI immediately by applying the follow response to local React state.

## Changes
### Frontend (React)
- Update the Follow click handler to:
  - call `POST /api/artists/{id}/follow`
  - read the response `{ artist_id, is_following }`
  - update the matching artist in the local `artists` state array so the UI re-renders instantly

## Testing Plan
### Manual
1. Open the artist list
2. Click **Follow** on one artist -> button state changes immediately (no refresh)
3. Refresh the page -> state persists

## Notes for Reviewers
Please focus review on the state update logic (matching by `artist_id`) and the follow handler flow.

---

# Technical Explanation

The bug happened because the artist list is rendered from a React `artists` state array, but that state was not updated after the Follow request completed. The backend successfully updated the follow status and returned `{ artist_id, is_following }`, but the frontend didn't apply that response to the matching artist in state, so React didn't re-render until a refresh/refetch.

The fix updates the Follow click handler to take the API response and immutably update the correct artist in the local state array (match by `artist_id`, then replace `is_following`). Updating state triggers React to re-render immediately, so the button reflects the new follow state right after the click.
