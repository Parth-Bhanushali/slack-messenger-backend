import { WebClient, WebAPICallResult, ConversationsListResponse, ConversationsHistoryResponse, UsersInfoResponse } from '@slack/web-api';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const token = process.env.SLACK_TOKEN || '';

if (!token) {
  throw new Error('Slack token is missing!');
}

export class SlackClient {
  private client: WebClient;

  constructor() {
    this.client = new WebClient(token);
  }

  // Get the list of channels in the workspace
  async getChannels(): Promise<{ id: string; name: string }[]> {
    try {
      const result: ConversationsListResponse = await this.client.conversations.list();
      if (result.channels) {
        return result.channels
          .filter((channel) => channel.id && channel.name)
          .map((channel) => ({
            id: channel.id as string,
            name: channel.name as string,
          }));
      }
      return [];
    } catch (error) {
      console.error('Error retrieving channels:', error);
      throw error;
    }
  }

  // Helper function to get user info (name) by user ID
  async getUserName(userId: string): Promise<string> {
    try {
      const result: UsersInfoResponse = await this.client.users.info({ user: userId });
      if (result.user) {
        return result.user.real_name || result.user.name || userId;
      }
      
      return userId;
    } catch (error) {
      console.error('Error retrieving user info:', error);
      return userId;
    }
  }

  // Get messages from a specific channel
  async getMessages(channelId: string): Promise<any[]> {
  try {
    // Fetch the message history from the specified channel
    const result: ConversationsHistoryResponse = await this.client.conversations.history({
      channel: channelId,
    });

    // Filter out system messages like "has joined the channel"
    const messages = result.messages?.filter(
      (message) => !message.subtype || message.subtype !== 'channel_join'
    ) || [];

    // Process each message to add the username and replace mentions with real names
    const processedMessages = await Promise.all(
      messages.map(async (message) => {
        let text = message.text || '';

        // Get the user's real name and add it as a 'username' field in the message
        const username = await this.getUserName(message.username ?? message?.user ?? 'User');

        // Check for user mentions <@USER_ID> in the message text
        const userMentions = text.match(/<@([A-Z0-9]+)>/g); // Match all mentions like <@USER_ID>

        // If user mentions exist, process them
        if (userMentions) {
          for (const mention of userMentions) {
            const userId = mention.replace(/[<@>]/g, ''); // Extract user ID from <@USER_ID>
            const userName = await this.getUserName(userId); // Get user's real name
            text = text.replace(mention, userName); // Replace mention with the real name
          }
        }

        // Return the processed message with the updated text and username field
        return { ...message, text, username }; // Add 'username' field here
      })
    );

    return processedMessages || [];
  } catch (error) {
    console.error('Error retrieving messages:', error);
    throw error;
  }
}

  // Send a message to a specific channel
  async sendMessage(channelId: string, message: string): Promise<WebAPICallResult | null> {
    try {
      const result = await this.client.chat.postMessage({
        channel: channelId,
        text: message,
      });
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
