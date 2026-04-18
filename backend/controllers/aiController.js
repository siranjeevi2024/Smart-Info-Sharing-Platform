const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.summarizePost = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that summarizes articles. 
          Return a JSON object with exactly these fields:
          - summary: a 2-3 sentence TL;DR summary
          - keyPoints: array of exactly 3 key takeaways (short bullet points)
          - readTime: estimated read time as a string like "3 min read"
          - sentiment: one word - either "Positive", "Neutral", or "Informative"
          Respond with only valid JSON, no extra text.`
        },
        {
          role: 'user',
          content: `Title: ${title}\n\nContent: ${description}`
        }
      ],
      max_tokens: 400,
      temperature: 0.5,
    });

    const raw = completion.choices[0].message.content.trim();
    const result = JSON.parse(raw);
    res.json(result);
  } catch (error) {
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'OpenAI rate limit reached. Try again later.' });
    }
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};
