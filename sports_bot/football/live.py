#!/usr/bin/env python3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Configuration ─────────────────────────────────────────────────────────────
USER = "thenecpt"
SECRET = "0c55322e8e196d6ef9066fa4252cf386"
DETAIL_LIVE_URL = "https://api.thesports.com/v1/football/match/detail_live"

app = FastAPI()

# Enable CORS so your React frontend (or any client) can call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

async def fetch_from_api(url: str):
    params = {"user": USER, "secret": SECRET}
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=10.0)
            response.raise_for_status()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Upstream API error: {e}")
        data = response.json()
        logger.info(f"Fetched data from {url}: {data}")
        return data

@app.get("/live")
async def get_live_matches():
    return await fetch_from_api(DETAIL_LIVE_URL)

# The following endpoints currently mirror `/live`. Adjust URLs or logic as needed.
@app.get("/merged")
async def get_merged_matches():
    return await get_live_matches()

@app.get("/recent")
async def get_recent_matches():
    return await get_live_matches()

@app.get("/teams")
async def get_teams_matches():
    return await get_live_matches()

@app.get("/competition")
async def get_competition_matches():
    return await get_live_matches()

@app.get("/country")
async def get_country_matches():
    return await get_live_matches()
