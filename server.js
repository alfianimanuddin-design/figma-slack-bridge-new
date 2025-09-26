const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'Figma Slack Bridge is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/send-to-slack', async (req, res) => {
  try {
    const { webhookUrl, payload } = req.body;

    if (!webhookUrl || !payload) {
      return res.status(400).json({ error: 'Missing webhookUrl or payload' });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      res.json({ success: true, message: 'Successfully sent to Slack' });
    } else {
      const errorText = await response.text();
      res.status(500).json({ error: 'Failed to send to Slack', details: errorText });
    }

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
