const express = require('express');
const router = express.Router();

const CRICAPI_KEY = process.env.CRICAPI_KEY || '';
const BASE = 'https://api.cricapi.com/v1';

// Simple in-memory cache (10 minutes)
const cache = {};
const CACHE_TTL = 10 * 60 * 1000;

function getCache(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
  return null;
}

function setCache(key, data) {
  cache[key] = { data, time: Date.now() };
}

async function cricFetch(endpoint, params = {}) {
  const url = new URL(`${BASE}/${endpoint}`);
  url.searchParams.set('apikey', CRICAPI_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`CricAPI error: ${res.status}`);
  const json = await res.json();
  if (json.status === 'failure') throw new Error(json.reason || 'CricAPI request failed');
  return json;
}

router.get('/matches', async (req, res) => {
  try {
    const cached = getCache('matches');
    if (cached) return res.json(cached);
    const data = await cricFetch('matches', { offset: 0 });
    setCache('matches', data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/match/:id', async (req, res) => {
  try {
    const key = `match_${req.params.id}`;
    const cached = getCache(key);
    if (cached) return res.json(cached);
    const data = await cricFetch('match_info', { id: req.params.id });
    setCache(key, data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/scorecard/:id', async (req, res) => {
  try {
    const key = `scorecard_${req.params.id}`;
    const cached = getCache(key);
    if (cached) return res.json(cached);
    const data = await cricFetch('match_scorecard', { id: req.params.id });
    setCache(key, data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/players', async (req, res) => {
  try {
    const { search = '' } = req.query;
    const key = `players_${search}`;
    const cached = getCache(key);
    if (cached) return res.json(cached);
    const data = await cricFetch('players', { search, offset: 0 });
    setCache(key, data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/player/:id', async (req, res) => {
  try {
    const key = `player_${req.params.id}`;
    const cached = getCache(key);
    if (cached) return res.json(cached);
    const data = await cricFetch('players_info', { id: req.params.id });
    setCache(key, data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/series', async (req, res) => {
  try {
    const cached = getCache('series');
    if (cached) return res.json(cached);
    const data = await cricFetch('series', { offset: 0 });
    setCache('series', data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
