const express = require('express');
const router = express.Router();

const CRICAPI_KEY = process.env.CRICAPI_KEY || '';
const BASE = 'https://api.cricapi.com/v1';

async function cricFetch(endpoint, params = {}) {
  const url = new URL(`${BASE}/${endpoint}`);
  url.searchParams.set('apikey', CRICAPI_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`CricAPI error: ${res.status}`);
  return res.json();
}

// GET /api/cricket/matches?status=live|upcoming|recent
router.get('/matches', async (req, res) => {
  try {
    const { status = 'live', offset = 0 } = req.query;
    const data = await cricFetch('matches', { status, offset });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cricket/match/:id
router.get('/match/:id', async (req, res) => {
  try {
    const data = await cricFetch('match_info', { id: req.params.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cricket/scorecard/:id
router.get('/scorecard/:id', async (req, res) => {
  try {
    const data = await cricFetch('match_scorecard', { id: req.params.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cricket/players?search=name
router.get('/players', async (req, res) => {
  try {
    const { search = '' } = req.query;
    const data = await cricFetch('players', { search, offset: 0 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cricket/player/:id
router.get('/player/:id', async (req, res) => {
  try {
    const data = await cricFetch('players_info', { id: req.params.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cricket/series
router.get('/series', async (req, res) => {
  try {
    const data = await cricFetch('series', { offset: 0 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
