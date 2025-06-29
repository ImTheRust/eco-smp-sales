# Railway Deployment Guide

This guide will walk you through deploying your Discord Economy Bot to Railway.

## Prerequisites

1. **Discord Bot Setup**
   - Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a bot and get your bot token
   - Note your application ID

2. **GitHub Repository**
   - Push this code to a GitHub repository
   - Make sure the repository is public or you have Railway access

## Step-by-Step Deployment

### 1. Create Railway Account
1. Go to [Railway](https://railway.com/)
2. Sign up with your GitHub account
3. Complete the verification process

### 2. Create New Project
1. Click "New Project" in Railway dashboard
2. Select "Deploy from GitHub repo"
3. Choose your repository containing the Discord bot
4. Click "Deploy Now"

### 3. Configure Environment Variables
1. In your Railway project dashboard, go to the "Variables" tab
2. Add the following environment variables:

   **Required Variables:**
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_discord_application_id_here
   ```

   **Optional Variables:**
   ```
   PORT=3000
   ```

### 4. Deploy Commands
After the initial deployment, you need to deploy the Discord slash commands:

1. Go to the "Deployments" tab in Railway
2. Click on your latest deployment
3. Open the terminal/console
4. Run the command deployment:
   ```bash
   npm run deploy
   ```

### 5. Invite Bot to Server
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to "OAuth2" > "URL Generator"
4. Select scopes: `bot`, `applications.commands`
5. Select permissions:
   - Send Messages
   - Use Slash Commands
   - Embed Links
   - Read Message History
6. Copy the generated URL and open it in a browser
7. Select your server and authorize the bot

## Verification

### Check Bot Status
1. In Railway dashboard, check the "Deployments" tab
2. Ensure the deployment status is "Deployed"
3. Check the logs for any errors

### Test Bot Commands
1. Go to your Discord server
2. Try using `/help` to see if the bot responds
3. Test basic commands like `/balance` and `/daily`

## Troubleshooting

### Common Issues

**Bot not responding:**
- Check if `DISCORD_TOKEN` is correct
- Verify the bot is online in Discord
- Check Railway logs for errors

**Commands not working:**
- Ensure you ran `npm run deploy` after deployment
- Check if `CLIENT_ID` is correct
- Verify bot has proper permissions

**Database errors:**
- Railway automatically creates the data directory
- Check if the bot has write permissions

### Viewing Logs
1. In Railway dashboard, go to your deployment
2. Click on the deployment to view logs
3. Look for any error messages or warnings

### Restarting the Bot
1. In Railway dashboard, go to "Deployments"
2. Click "Redeploy" to restart the bot
3. Wait for the deployment to complete

## Monitoring

### Railway Dashboard
- Monitor resource usage in the "Metrics" tab
- Check deployment status and logs
- View environment variables

### Bot Health
- The bot includes a health check endpoint at `/health`
- Railway automatically monitors this endpoint
- Check the endpoint returns `{"status":"healthy"}`

## Updates

To update your bot:
1. Push changes to your GitHub repository
2. Railway will automatically detect changes and redeploy
3. Run `npm run deploy` again if you added new commands

## Cost

Railway offers:
- **Free tier**: $5 credit per month
- **Pro tier**: Pay-as-you-go pricing
- This bot should run comfortably on the free tier

## Support

If you encounter issues:
1. Check Railway documentation
2. Review Discord.js documentation
3. Check the bot logs in Railway dashboard
4. Open an issue in the GitHub repository

---

**Your Discord Economy Bot is now live on Railway! 🚀** 