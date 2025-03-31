import express, { Request, Response } from 'express';
import { SlackClient } from './SlackClient';
import cors from 'cors';

const app = express();
const port = 3001;

// Initialize the Slack client
const slackClient = new SlackClient();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from React app on port 3000
  methods: ['GET', 'POST'],        // Allow GET and POST methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow these headers
}));

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to get the list of channels
app.get('/api/channels', async (req: Request, res: Response): Promise<void> => {
  try {
    const channels = await slackClient.getChannels();
    res.status(200).json(channels);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to retrieve channels', error: error.message });
  }
});

// API endpoint to get messages from a specific channel
app.get('/api/messages/:channelId', async (req: Request, res: Response): Promise<void> => {
  const { channelId } = req.params;
  try {
    const messages = await slackClient.getMessages(channelId);
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to retrieve messages', error: error.message });
  }
});

// API endpoint to send a message to a specific channel
app.post('/api/messages/:channelId', async (req: Request, res: Response): Promise<void> => {
  const { channelId } = req.params;
  const { text: message } = req.body;

  if (!message) {
    res.status(400).json({ message: 'Message body is required' });
    return;
  }

  try {
    const result = await slackClient.sendMessage(channelId, message);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

// Start the Express server on port 3001
app.listen(port, (): void => {
  console.log(`Server is running on http://localhost:${port}`);
});
