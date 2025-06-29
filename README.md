# Discord Economy Bot

A comprehensive Discord economy bot with currency, gambling, shop system, and more features. Built with Discord.js and SQLite, designed for easy deployment on Railway.

## Features

### 💰 Economy System
- **Balance Management**: Wallet and bank accounts
- **Daily Rewards**: Claim daily bonuses with level-based rewards
- **Work System**: Earn money through various jobs with 30-minute cooldowns
- **Money Transfer**: Send money to other users
- **Banking**: Deposit and withdraw money

### 🎰 Gambling
- **Slot Machine**: 3-reel slots with various symbols and multipliers
- **Coin Flip**: Simple heads/tails betting with 2x payout

### 🏪 Shop System
- **Item Shop**: Purchase boosts and cosmetic items
- **Inventory**: Track purchased items
- **Boosts**: Lucky charms, work boosts, and more

### 📊 Utility Features
- **Leaderboards**: View richest users
- **Transaction History**: Track all financial activities
- **Level System**: Gain XP and level up for better rewards
- **Help System**: Comprehensive command documentation

## Commands

### Economy Commands
- `/balance [user]` - Check balance (yours or another user's)
- `/daily` - Claim daily reward
- `/work` - Work to earn money
- `/deposit <amount>` - Deposit money to bank
- `/withdraw <amount>` - Withdraw money from bank
- `/transfer <user> <amount>` - Transfer money to another user

### Gambling Commands
- `/slots <bet>` - Play slot machine
- `/coinflip <bet> <choice>` - Flip a coin (heads/tails)

### Shop Commands
- `/shop` - View available items
- `/buy <item_id>` - Purchase an item

### Utility Commands
- `/leaderboard [limit]` - View richest users
- `/help` - Show all commands

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- Discord Bot Token
- Discord Application ID

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd discord-economy-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   Create a `.env` file in the root directory:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_application_id
   ```

4. **Deploy commands**
   ```bash
   npm run deploy
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

### Railway Deployment

1. **Create a Railway account**
   Visit [Railway](https://railway.com/) and create an account

2. **Connect your GitHub repository**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Set environment variables**
   In Railway dashboard, add these variables:
   - `DISCORD_TOKEN`: Your Discord bot token
   - `CLIENT_ID`: Your Discord application ID

4. **Deploy**
   Railway will automatically build and deploy your bot

5. **Deploy commands**
   After deployment, run the command deployment:
   ```bash
   npm run deploy
   ```

## Discord Bot Setup

1. **Create a Discord Application**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application"
   - Give it a name

2. **Create a Bot**
   - Go to the "Bot" section
   - Click "Add Bot"
   - Copy the bot token

3. **Set Bot Permissions**
   - Go to "OAuth2" > "URL Generator"
   - Select scopes: `bot`, `applications.commands`
   - Select permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
   - Use the generated URL to invite the bot to your server

4. **Get Application ID**
   - Copy the Application ID from the "General Information" section

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Your Discord bot token | Yes |
| `CLIENT_ID` | Your Discord application ID | Yes |

## Database

The bot uses SQLite for data storage. The database file is automatically created in the `data/` directory and includes:

- **Users table**: User balances, levels, XP, and timestamps
- **Shop items table**: Available items for purchase
- **Transactions table**: History of all financial activities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy earning! 💰** 