const express = require('express');
const router = require('express').Router();
const axios = require('axios');

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';

// Cache for 30 minutes
const cache = {};
const CACHE_TTL = 30 * 60 * 1000;

function getCache(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.time < CACHE_TTL) return entry.data;
  return null;
}
function setCache(key, data) {
  cache[key] = { data, time: Date.now() };
}

const categoryMap = {
  general: 'general', sports: 'sports', technology: 'technology',
  health: 'health', business: 'business', education: 'nation',
  science: 'science', entertainment: 'entertainment',
};

router.get('/', async (req, res) => {
  try {
    const { category = 'general', q } = req.query;
    const cacheKey = q ? `search_${q}` : `cat_${category}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    let url;
    if (q) {
      url = `${BASE_URL}/search?q=${encodeURIComponent(q)}&lang=en&max=20&apikey=${GNEWS_API_KEY}`;
    } else {
      const mapped = categoryMap[category] || 'general';
      url = `${BASE_URL}/top-headlines?category=${mapped}&lang=en&max=20&apikey=${GNEWS_API_KEY}`;
    }
    const { data } = await axios.get(url, { timeout: 10000 });
    const articles = (data.articles || []).map(a => ({
      title: a.title,
      description: a.description,
      url: a.url,
      image: a.image,
      publishedAt: a.publishedAt,
      source: { name: a.source?.name },
    }));
    const result = { articles };
    setCache(cacheKey, result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ articles: [], error: 'Failed to fetch news' });
  }
});

module.exports = router;
