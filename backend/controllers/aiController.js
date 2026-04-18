exports.assistWriting = async (req, res) => {
  try {
    const { title, description, action } = req.body;
    const text = description || '';
    const words = text.trim().split(/\s+/).filter(Boolean);

    const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','this','that','these','those','it','its','i','you','he','she','we','they','as','so','if','then','than','when','where','who','which','what','how']);

    if (action === 'grammar') {
      // Grammar & style fixes
      const fixes = [];
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

      sentences.forEach(s => {
        const trimmed = s.trim();
        // Check capitalization
        if (trimmed && trimmed[0] !== trimmed[0].toUpperCase()) {
          fixes.push({ issue: 'Capitalization', original: trimmed, suggestion: trimmed[0].toUpperCase() + trimmed.slice(1) });
        }
        // Check double spaces
        if (/  +/.test(trimmed)) {
          fixes.push({ issue: 'Extra spaces', original: trimmed, suggestion: trimmed.replace(/  +/g, ' ') });
        }
        // Check common mistakes
        const commonFixes = [
          [/\bi am\b/gi, 'I am'], [/\bdont\b/gi, "don't"], [/\bcant\b/gi, "can't"],
          [/\bwont\b/gi, "won't"], [/\bisnt\b/gi, "isn't"], [/\barent\b/gi, "aren't"],
          [/\bive\b/gi, "I've"], [/\bim\b/gi, "I'm"], [/\bits a\b/gi, "it's a"],
        ];
        commonFixes.forEach(([pattern, replacement]) => {
          if (pattern.test(trimmed)) {
            fixes.push({ issue: 'Grammar', original: trimmed, suggestion: trimmed.replace(pattern, replacement) });
          }
        });
      });

      // Passive voice detection
      const passivePattern = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi;
      const passiveMatches = text.match(passivePattern) || [];
      if (passiveMatches.length > 0) {
        fixes.push({ issue: 'Passive voice detected', original: passiveMatches[0], suggestion: 'Consider using active voice for stronger writing' });
      }

      // Readability score (Flesch-Kincaid simplified)
      const sentenceCount = Math.max(1, (text.match(/[.!?]+/g) || []).length);
      const syllableCount = words.reduce((sum, w) => sum + Math.max(1, w.replace(/[^aeiou]/gi, '').length), 0);
      const fk = 206.835 - 1.015 * (words.length / sentenceCount) - 84.6 * (syllableCount / words.length);
      const readability = fk > 70 ? 'Easy to read ✅' : fk > 50 ? 'Moderate difficulty 📖' : 'Complex - consider simplifying 🔄';

      return res.json({ fixes: fixes.slice(0, 5), readability, wordCount: words.length, sentenceCount });
    }

    if (action === 'improve') {
      const suggestions = [];

      // Weak words to replace
      const weakWords = {
        'very good': 'excellent', 'very bad': 'terrible', 'very big': 'enormous',
        'very small': 'tiny', 'very fast': 'rapid', 'very slow': 'sluggish',
        'very important': 'crucial', 'very interesting': 'fascinating',
        'good': 'effective', 'bad': 'problematic', 'big': 'significant',
        'use': 'utilize', 'show': 'demonstrate', 'help': 'facilitate',
        'make': 'create', 'get': 'obtain', 'give': 'provide', 'think': 'consider',
      };

      Object.entries(weakWords).forEach(([weak, strong]) => {
        const regex = new RegExp(`\\b${weak}\\b`, 'gi');
        if (regex.test(text)) {
          suggestions.push({ type: 'Word Choice', weak, strong });
        }
      });

      // Check sentence length
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      const longSentences = sentences.filter(s => s.split(/\s+/).length > 30);
      if (longSentences.length > 0) {
        suggestions.push({ type: 'Sentence Length', weak: 'Long sentences detected', strong: 'Break sentences over 30 words into shorter ones for clarity' });
      }

      // Check paragraph structure
      if (words.length > 100 && !text.includes('\n')) {
        suggestions.push({ type: 'Structure', weak: 'No paragraph breaks', strong: 'Add paragraph breaks every 3-5 sentences to improve readability' });
      }

      // Check for introduction
      if (words.length > 50 && !text.match(/^(In this|This article|Today|Introduction|Overview)/i)) {
        suggestions.push({ type: 'Opening', weak: 'Generic opening', strong: 'Start with a hook: a question, statistic, or bold statement' });
      }

      // Check for conclusion
      if (words.length > 100 && !text.match(/(conclusion|summary|in summary|to conclude|finally|in conclusion)/i)) {
        suggestions.push({ type: 'Conclusion', weak: 'No conclusion detected', strong: 'Add a conclusion that summarizes key points and calls to action' });
      }

      return res.json({ suggestions: suggestions.slice(0, 6) });
    }

    if (action === 'expand') {
      if (words.length < 5) {
        return res.status(400).json({ error: 'Write at least a sentence to expand' });
      }

      // Extract main topic words
      const topicWords = words
        .map(w => w.replace(/[^a-zA-Z]/g, '').toLowerCase())
        .filter(w => w.length > 4 && !stopWords.has(w));

      const uniqueTopics = [...new Set(topicWords)].slice(0, 3);

      // Generate expansion prompts based on content
      const expansions = [
        `📌 Consider adding: What problem does "${uniqueTopics[0] || 'this topic'}" solve?`,
        `📊 Strengthen with: Include a real-world example or case study about ${uniqueTopics[1] || 'this'}`,
        `🔍 Go deeper: Explain the step-by-step process of ${uniqueTopics[0] || 'this concept'}`,
        `💡 Add value: What are the top 3 benefits of ${uniqueTopics[1] || 'this approach'}?`,
        `⚠️ Balance it: What are the limitations or challenges of ${uniqueTopics[0] || 'this'}?`,
        `🔗 Connect ideas: How does ${uniqueTopics[0] || 'this'} relate to ${uniqueTopics[2] || 'broader trends'}?`,
        `📈 Add data: Support your points with statistics or research findings`,
        `🗣️ Add a quote: Include an expert opinion or testimonial to build credibility`,
      ];

      // Suggest related subtopics
      const subtopics = uniqueTopics.map(t => `• Deep dive into ${t}`).concat([
        '• Historical background and context',
        '• Future trends and predictions',
        '• Practical tips for beginners',
        '• Common misconceptions debunked',
      ]).slice(0, 5);

      return res.json({ expansions: expansions.slice(0, 5), subtopics, currentWordCount: words.length, suggestedWordCount: Math.max(500, words.length * 2) });
    }

    if (action === 'tags') {
      // Auto-suggest tags from content
      const allText = `${title} ${description}`.toLowerCase();
      const wordFreq = {};
      allText.split(/\s+/).forEach(w => {
        const clean = w.replace(/[^a-z]/g, '');
        if (clean.length > 3 && !stopWords.has(clean)) {
          wordFreq[clean] = (wordFreq[clean] || 0) + 1;
        }
      });

      const suggestedTags = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([word]) => word);

      return res.json({ tags: suggestedTags });
    }

    res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    res.status(500).json({ error: 'AI assistant failed' });
  }
};

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
