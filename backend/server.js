// backend/server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Import axios

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Adjust based on your frontend's origin
}));
app.use(express.json()); // Built-in middleware for JSON

// Route to handle search requests
app.post('/api/search', async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  console.log(`Received search query: "${query}"`);

  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OpenAI API key is not configured.');
    }

    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', // You can choose the model, e.g., 'gpt-3.5-turbo'
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: query },
        ],
        max_tokens: 150, // Adjust as needed
        temperature: 0.7, // Adjust for creativity
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    const chatGptResponse = openaiResponse.data;

    // Extract the assistant's reply
    const assistantReply = chatGptResponse.choices[0].message.content.trim();

    console.log('ChatGPT response:', assistantReply);

    // Send the response back to the frontend
    res.json({ reply: assistantReply });
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from OpenAI.' });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
