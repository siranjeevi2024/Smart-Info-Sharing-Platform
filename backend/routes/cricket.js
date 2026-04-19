const express = require('express');
const router = express.Router();

const KEY = process.env.CRICAPI_KEY;
const BASE = 'https://api.cricapi.com/v1';

const cricFetch = async (endpoint) => {
  const res = await fetch(`${BASE}/${endpoint}&apikey=${KEY}`);
  return res.json();
};

// Match detail
router.get('/match/:id', async (req, res) => {
  try {
    const data = await cricFetch(`match_info?id=${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Current / recent matches
router.get('/matches', async (req, res) => {
  try {
    const data = await cricFetch('currentMatches?offset=0');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upcoming matches
router.get('/upcoming', async (req, res) => {
  try {
    const data = await cricFetch('matches?offset=0');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Player search
router.get('/players', async (req, res) => {
  const { name = '' } = req.query;
  try {
    const data = await cricFetch(`players?offset=0&search=${encodeURIComponent(name)}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Player info
router.get('/player/:id', async (req, res) => {
  try {
    const data = await cricFetch(`players_info?id=${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Scorecard
router.get('/scorecard/:id', async (req, res) => {
  try {
    const data = await cricFetch(`match_scorecard?id=${req.params.id}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Series list
router.get('/series', async (req, res) => {
  try {
    const data = await cricFetch('series?offset=0');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
