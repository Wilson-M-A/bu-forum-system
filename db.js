const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, 'forum.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    avatar_color TEXT DEFAULT '#2A5C1B',
    post_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_zh_tw TEXT DEFAULT '',
    name_en TEXT DEFAULT '',
    description TEXT DEFAULT '',
    desc_zh_tw TEXT DEFAULT '',
    desc_en TEXT DEFAULT '',
    icon TEXT DEFAULT '💬',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    is_pinned INTEGER DEFAULT 0,
    is_locked INTEGER DEFAULT 0,
    last_reply_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS thread_likes (
    user_id INTEGER NOT NULL,
    thread_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, thread_id)
  );

  CREATE TABLE IF NOT EXISTS reply_likes (
    user_id INTEGER NOT NULL,
    reply_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, reply_id)
  );

  CREATE TABLE IF NOT EXISTS favorites (
    user_id INTEGER NOT NULL,
    thread_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, thread_id)
  );

  CREATE TABLE IF NOT EXISTS calendar_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    event_date TEXT NOT NULL,
    event_time TEXT DEFAULT '',
    location TEXT DEFAULT '',
    thread_id INTEGER DEFAULT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id),
    UNIQUE(user1_id, user2_id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT DEFAULT '',
    msg_type TEXT DEFAULT 'text',
    file_path TEXT DEFAULT '',
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
  );
`);

// Seed admin + default boards on first run
const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
if (userCount === 0) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare(`INSERT INTO users (username, email, password_hash, is_admin, avatar_color)
    VALUES ('admin', 'admin@forum.com', ?, 1, '#2A5C1B')`).run(hash);

  const boards = [
    ['📢 通知公告','📢 通知公告','📢 Announcements',
     '由管理员发布学校或社团重要通知','由管理員發布學校或社團重要通知','Official announcements from administrators',
     '📢', 0],
    ['💬 综合讨论','💬 綜合討論','💬 General Discussion',
     '自由讨论，无特定主题','自由討論，無特定主題','Free discussion, no specific topic',
     '💬', 1],
    ['🎨 兴趣爱好','🎨 興趣愛好','🎨 Hobbies & Interests',
     '摄影、音乐、游戏等兴趣话题分享','攝影、音樂、遊戲等興趣話題分享','Photography, music, gaming and more',
     '🎨', 2],
    ['🆘 求助广场','🆘 求助廣場','🆘 Help & Support',
     '学业、生活、技术等各类求助','學業、生活、技術等各類求助','Academic, life, and tech support',
     '🆘', 3],
    ['🥾 登山交流','🥾 登山交流','🥾 Hiking & Trails',
     '分享登山体验与路线','分享登山體驗與路線','Share hiking experiences and routes',
     '🥾', 4],
    ['📅 活动分享','📅 活動分享','📅 Campus Events',
     '发布或讨论校园活动','發布或討論校園活動','Post or discuss campus events',
     '📅', 5],
  ];
  const ins = db.prepare('INSERT INTO boards (name, name_zh_tw, name_en, description, desc_zh_tw, desc_en, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  boards.forEach(b => ins.run(...b));
}

module.exports = db;
