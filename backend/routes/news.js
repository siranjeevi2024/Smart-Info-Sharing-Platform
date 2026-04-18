const express = require('express');
const router = express.Router();

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';

router.get('/', async (req, res) => {
  const { category = 'general', q, lang = 'en', max = 10 } = req.query;
  try {
    const endpoint = q
      ? `${BASE_URL}/search?q=${encodeURIComponent(q)}&lang=${lang}&max=${max}&apikey=${GNEWS_API_KEY}`
      : `${BASE_URL}/top-headlines?category=${category}&lang=${lang}&max=${max}&apikey=${GNEWS_API_KEY}`;

    const response = await fetch(endpoint);
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;
