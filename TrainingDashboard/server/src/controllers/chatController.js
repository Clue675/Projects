// server/src/controllers/chatController.js

const axios = require('axios');

const openaiEndpoint = 'https://api.openai.com/v1/engines/davinci/completions';
const openaiApiKey = process.env.OPENAI_API_KEY; // Store your API key in an environment variable

exports.getChatResponse = async (req, res) => {
  try {
    const prompt = req.body.prompt; // The user's input to the chatbot

    const response = await axios.post(openaiEndpoint, {
      prompt: prompt,
      max_tokens: 150 // Adjust as needed
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ response: response.data.choices[0].text.trim() });
  } catch (err) {
    console.error('Error calling OpenAI:', err);
    res.status(500).send('Error processing chat response');
  }
};
