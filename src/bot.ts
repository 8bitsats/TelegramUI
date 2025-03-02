import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);
const mongoClient = new MongoClient(process.env.MONGO_URI!);

interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  liquidity: number;
}

async function connectDB() {
  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

// Initialize bot and database connection
connectDB();

// Handle /start command
bot.command('start', (ctx) => {
  ctx.reply('Welcome to the Trading Bot! Use the mini app to start trading.', {
    reply_markup: {
      inline_keyboard: [[
        { text: 'Open Mini App', web_app: { url: 'https://your-mini-app-url.com' } }
      ]]
    }
  });
});

// Handle mini app data
bot.on(message('web_app_data'), async (ctx) => {
  const data = JSON.parse(ctx.message.web_app_data.data);
  
  switch (data.action) {
    case 'send':
      ctx.reply('Send tokens functionality coming soon!');
      break;
      
    case 'receive':
      ctx.reply('Receive tokens functionality coming soon!');
      break;
      
    case 'orders':
      ctx.reply('Orders functionality coming soon!');
      break;
      
    case 'viewToken':
      // Fetch and display detailed token information
      const token = await getTokenInfo(data.symbol);
      if (token) {
        ctx.reply(
          `${token.symbol} Information:\n` +
          `Price: $${token.price}\n` +
          `24h Change: ${token.change24h}%\n` +
          `Liquidity: $${token.liquidity.toLocaleString()}`
        );
      }
      break;
  }
});

// API endpoint to get token data
async function getTokenInfo(symbol: string): Promise<TokenData | null> {
  const db = mongoClient.db('trading');
  const token = await db.collection('tokens').findOne({ symbol });
  return token as TokenData | null;
}

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('An error occurred while processing your request.');
});

// Start the bot
bot.launch().then(() => {
  console.log('Bot is running!');
}).catch((error) => {
  console.error('Error starting bot:', error);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
