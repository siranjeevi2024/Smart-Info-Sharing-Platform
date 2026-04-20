const express = require('express');
const router = express.Router();
const axios = require('axios');

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';

const categoryMap = {
  general: 'general', sports: 'sports', technology: 'technology',
  health: 'health', business: 'business', education: 'nation',
  science: 'science', entertainment: 'entertainment',
};

router.get('/', async (req, res) => {
  try {
    const { category = 'general', q } = req.query;
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
    res.json({ articles });
  } catch (error) {
    res.status(500).json({ articles: [], error: 'Failed to fetch news' });
  }
});

module.exports = router;
