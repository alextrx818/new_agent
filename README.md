# Sports Bot Frontend & API

Last Updated: 2025-04-28 14:14 UTC

## Overview

This project consists of:
- A FastAPI backend (`sports_bot/football/live.py`) that proxies live football match data from theSports API.
- A React frontend (`sports_bot/frontend/`) built with Create React App and Material-UI for a polished tabs interface.

## Backend

- Uses FastAPI and httpx.
- Exposes endpoints:
  - `/live` – live match data
  - `/merged`, `/recent`, `/teams`, `/competition`, `/country` – currently mirror `/live` for future expansion.
- CORS enabled to allow frontend to fetch via proxy.

## Frontend

- Routes powered by React Router v7.
- Material-UI `AppBar`, `Tabs`, and `Tab` components replace basic NavLink tabs.
- Only **Live** tab is active now; it fetches JSON from `/live` and renders the full response inside a styled `<pre>` block.
- Other tabs (`Merged`, `Recent`, `Teams`, `Competition`, `Country`) render empty placeholders.

### Notable Changes (2025-04-28)

1. **Tabs overhaul**  
   - Switched from CSS-only NavLink tabs to Material-UI Tabs for better styling, responsiveness, and clear active indicator.
   - Customized indicator height, colors, typography.

2. **Proxy configuration**  
   - Added `"proxy": "http://localhost:8000"` to `package.json` to simplify fetch calls (`fetch('/live')`).

3. **LiveMatches component**  
   - Fetches from `http://localhost:8000/live` (backend) and renders JSON.
   - Styled background, scrollable horizontal overflow.

4. **Empty placeholders**  
   - Configured React Router routes for all tabs.
   - Only Live tab renders data; others await future implementation.

## Running the Project

1. Start the backend:
   ```bash
   cd sports_bot
   uvicorn football.live:app --reload --port 8000
   ```
2. Start the frontend:
   ```bash
   cd sports_bot/frontend
   npm install
   npm start
   ```
3. Open your browser at `http://localhost:3000/live` to view live JSON.

## Next Steps

- Implement data rendering for other tabs.
- Add styling, layout enhancements, and match details.
- Build production bundle with `npm run build` and deploy.
