const Database = require('better-sqlite3');
const path = require('path');

class EconomyDatabase {
  constructor() {
    this.db = new Database(path.join(__dirname, '../../data/economy.db'));
    this.init();
  }

  init() {
    // Create users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        balance INTEGER DEFAULT 0,
        bank INTEGER DEFAULT 0,
        last_daily TEXT,
        last_work TEXT,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0,
        inventory TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create shop items table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS shop_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        type TEXT NOT NULL,
        effect TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        amount INTEGER NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default shop items if they don't exist
    this.insertDefaultShopItems();
  }

  insertDefaultShopItems() {
    const items = [
      { name: 'Lucky Charm', description: 'Increases gambling odds by 10%', price: 1000, type: 'boost', effect: 'gambling_boost' },
      { name: 'Work Boost', description: 'Doubles work earnings for 1 hour', price: 500, type: 'boost', effect: 'work_boost' },
      { name: 'VIP Badge', description: 'Exclusive VIP status', price: 5000, type: 'cosmetic', effect: 'vip_status' },
      { name: 'Mystery Box', description: 'Random rewards inside!', price: 250, type: 'consumable', effect: 'mystery_reward' }
    ];

    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO shop_items (name, description, price, type, effect)
      VALUES (?, ?, ?, ?, ?)
    `);

    items.forEach(item => {
      stmt.run(item.name, item.description, item.price, item.type, item.effect);
    });
  }

  // User management
  getUser(userId, username) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE user_id = ?');
    let user = stmt.get(userId);
    
    if (!user) {
      const insertStmt = this.db.prepare(`
        INSERT INTO users (user_id, username) VALUES (?, ?)
      `);
      insertStmt.run(userId, username);
      user = stmt.get(userId);
    }
    
    return user;
  }

  updateBalance(userId, amount) {
    const stmt = this.db.prepare(`
      UPDATE users SET balance = balance + ? WHERE user_id = ?
    `);
    return stmt.run(amount, userId);
  }

  updateBank(userId, amount) {
    const stmt = this.db.prepare(`
      UPDATE users SET bank = bank + ? WHERE user_id = ?
    `);
    return stmt.run(amount, userId);
  }

  transferMoney(fromUserId, toUserId, amount) {
    const transaction = this.db.transaction(() => {
      this.updateBalance(fromUserId, -amount);
      this.updateBalance(toUserId, amount);
    });
    return transaction();
  }

  // Daily rewards
  canClaimDaily(userId) {
    const user = this.getUser(userId);
    if (!user.last_daily) return true;
    
    const lastDaily = new Date(user.last_daily);
    const now = new Date();
    const diffHours = (now - lastDaily) / (1000 * 60 * 60);
    
    return diffHours >= 24;
  }

  claimDaily(userId) {
    const stmt = this.db.prepare(`
      UPDATE users SET last_daily = CURRENT_TIMESTAMP WHERE user_id = ?
    `);
    return stmt.run(userId);
  }

  resetDailyRewards() {
    const stmt = this.db.prepare(`
      UPDATE users SET last_daily = NULL WHERE 
      last_daily IS NOT NULL AND 
      datetime(last_daily) < datetime('now', '-24 hours')
    `);
    return stmt.run();
  }

  // Work system
  canWork(userId) {
    const user = this.getUser(userId);
    if (!user.last_work) return true;
    
    const lastWork = new Date(user.last_work);
    const now = new Date();
    const diffMinutes = (now - lastWork) / (1000 * 60);
    
    return diffMinutes >= 30; // 30 minute cooldown
  }

  work(userId) {
    const stmt = this.db.prepare(`
      UPDATE users SET last_work = CURRENT_TIMESTAMP WHERE user_id = ?
    `);
    return stmt.run(userId);
  }

  // XP and leveling
  addXP(userId, xp) {
    const user = this.getUser(userId);
    const newXP = user.xp + xp;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    const stmt = this.db.prepare(`
      UPDATE users SET xp = ?, level = ? WHERE user_id = ?
    `);
    return stmt.run(newXP, newLevel, userId);
  }

  // Shop system
  getShopItems() {
    const stmt = this.db.prepare('SELECT * FROM shop_items ORDER BY price');
    return stmt.all();
  }

  buyItem(userId, itemId) {
    const itemStmt = this.db.prepare('SELECT * FROM shop_items WHERE id = ?');
    const item = itemStmt.get(itemId);
    
    if (!item) throw new Error('Item not found');
    
    const user = this.getUser(userId);
    if (user.balance < item.price) throw new Error('Insufficient funds');
    
    const transaction = this.db.transaction(() => {
      this.updateBalance(userId, -item.price);
      this.addToInventory(userId, item);
      this.logTransaction(userId, 'purchase', -item.price, `Bought ${item.name}`);
    });
    
    return transaction();
  }

  addToInventory(userId, item) {
    const user = this.getUser(userId);
    const inventory = JSON.parse(user.inventory || '[]');
    inventory.push({
      id: item.id,
      name: item.name,
      type: item.type,
      effect: item.effect,
      purchased_at: new Date().toISOString()
    });
    
    const stmt = this.db.prepare(`
      UPDATE users SET inventory = ? WHERE user_id = ?
    `);
    return stmt.run(JSON.stringify(inventory), userId);
  }

  // Transaction logging
  logTransaction(userId, type, amount, description) {
    const stmt = this.db.prepare(`
      INSERT INTO transactions (user_id, type, amount, description)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(userId, type, amount, description);
  }

  getTransactionHistory(userId, limit = 10) {
    const stmt = this.db.prepare(`
      SELECT * FROM transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }

  // Leaderboards
  getTopUsers(limit = 10) {
    const stmt = this.db.prepare(`
      SELECT user_id, username, balance, bank, level, xp
      FROM users 
      ORDER BY (balance + bank) DESC 
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  // Close database connection
  close() {
    this.db.close();
  }
}

module.exports = EconomyDatabase; 