# Slack Messenger Backend

This backend application interacts with Slack channels to retrieve and send messages using the Slack Web API.

## Features
- Get list of Slack channels
- Fetch message history from a channel
- Send messages to a channel
- Replace user mentions (`<@USER_ID>`) with real user names

## Prerequisites
- **Node.js**: [Install Node.js](https://nodejs.org/)
- **Slack Workspace & Token**: Create a Slack app to obtain your API token. [Create Slack App](https://api.slack.com/apps)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/parth-bhanushali/slack-messenger-backend.git
   cd slack-messenger-backend
   ```
   
2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Set up environment variables**:
   ```bash
   SLACK_TOKEN=your-slack-token
   ```
   - **SLACK_TOKEN**: This is your Slack API token. You can get it by creating a Slack app from Slack API. Use the Bot Token from the OAuth & Permissions section.

4. **Sack App Permissions**:
  For the application to function properly, the Slack Bot Token must have the following OAuth scopes/permissions:

  - ```channels:history```: View messages and other content in public channels that Slack Demo App has been added to
  
  - ```channels:read```: To list channels in the workspace.

  - ```groups:read```: To read private channels (if applicable).

  - ```chat:write```: To send messages to channels.
  
  - ```chat:write.public```: Send messages to channels @Slack Demo App isn't a member of.

  - ```conversations:history```: To retrieve the message history from channels.

  - ```users:read```: To fetch user details such as real name and profile.

    To add these permissions, navigate to your Slack app's OAuth & Permissions section, and under OAuth Scopes, add the following:

    Bot Token Scopes: channels:read, groups:read, chat:write, conversations:history, users:read


    After adding the permissions, reinstall the app to apply the changes.

5. **Running Application**:
   ```bash
   yarn dev
   ```
  
