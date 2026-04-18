exports.summarizePost = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Calculate read time (avg 200 words per minute)
    const wordCount = description.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    // Extract key sentences for summary (extractive summarization)
    const sentences = description.match(/[^.!?]+[.!?]+/g) || [description];
    const words = description.toLowerCase().split(/\s+/);
    const wordFreq = {};
    const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','this','that','these','those','it','its','i','you','he','she','we','they']);

    words.forEach(w => {
      const clean = w.replace(/[^a-z]/g, '');
      if (clean && !stopWords.has(clean)) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });

    // Score each sentence
    const scored = sentences.map(sentence => {
      const sWords = sentence.toLowerCase().split(/\s+/);
      const score = sWords.reduce((sum, w) => {
        const clean = w.replace(/[^a-z]/g, '');
        return sum + (wordFreq[clean] || 0);
      }, 0) / (sWords.length || 1);
      return { sentence: sentence.trim(), score };
    });

    // Top 2-3 sentences as summary
    const topSentences = [...scored]
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(3, scored.length))
      .map(s => s.sentence);
    const summary = topSentences.join(' ');

    // Extract key points (top unique keywords as phrases)
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([w]) => w);

    // Build 3 key points from sentences containing top words
    const keyPoints = [];
    for (const word of topWords) {
      if (keyPoints.length >= 3) break;
      const match = sentences.find(s =>
        s.toLowerCase().includes(word) &&
        !keyPoints.some(kp => kp === s.trim())
      );
      if (match && match.trim().length < 120) {
        keyPoints.push(match.trim());
      }
    }

    // Fallback key points
    while (keyPoints.length < 3 && scored.length > keyPoints.length) {
      const next = scored
        .sort((a, b) => b.score - a.score)
        .find(s => !keyPoints.includes(s.sentence));
      if (next) keyPoints.push(next.sentence);
      else break;
    }

    // Detect sentiment from keywords
    const positiveWords = ['great','good','excellent','amazing','best','improve','success','benefit','effective','innovative','powerful','useful','helpful','important','significant'];
    const negativeWords = ['bad','poor','fail','problem','issue','difficult','challenge','risk','danger','wrong','error','lack','missing'];
    const textLower = description.toLowerCase();
    const posCount = positiveWords.filter(w => textLower.includes(w)).length;
    const negCount = negativeWords.filter(w => textLower.includes(w)).length;
    const sentiment = posCount > negCount ? 'Positive' : negCount > posCount ? 'Neutral' : 'Informative';

    res.json({ summary, keyPoints, readTime, sentiment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};
