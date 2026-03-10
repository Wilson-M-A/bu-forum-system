const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const fs = require('fs');

function localizeBoard(board, lang) {
  if (lang === 'en' && board.name_en) { board.name = board.name_en; board.description = board.desc_en || board.description; }
  else if (lang === 'zh-TW' && board.name_zh_tw) { board.name = board.name_zh_tw; board.description = board.desc_zh_tw || board.description; }
  return board;
}
function getSidebarBoards(lang) {
  return db.prepare(`SELECT b.*, (SELECT COUNT(*) FROM threads t WHERE t.board_id=b.id) as thread_count FROM boards b ORDER BY b.sort_order`).all().map(b => localizeBoard({...b}, lang));
}
const requireLogin = (req, res, next) => { if (!req.session.user) return res.redirect('/login'); next(); };

// Messages page
router.get('/messages', requireLogin, (req, res) => {
  const uid = req.session.user.id;
  const conversations = db.prepare(`
    SELECT c.*,
      CASE WHEN c.user1_id=? THEN u2.username ELSE u1.username END as other_name,
      CASE WHEN c.user1_id=? THEN u2.avatar_color ELSE u1.avatar_color END as other_color,
      CASE WHEN c.user1_id=? THEN c.user2_id ELSE c.user1_id END as other_id,
      (SELECT m.content FROM messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) as last_msg,
      (SELECT m.msg_type FROM messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) as last_msg_type,
      (SELECT m.created_at FROM messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) as last_msg_time,
      (SELECT COUNT(*) FROM messages m WHERE m.conversation_id=c.id AND m.sender_id!=? AND m.is_read=0) as unread_count
    FROM conversations c
    JOIN users u1 ON c.user1_id=u1.id
    JOIN users u2 ON c.user2_id=u2.id
    WHERE c.user1_id=? OR c.user2_id=?
    ORDER BY c.last_message_at DESC
  `).all(uid, uid, uid, uid, uid, uid);

  res.render('messages', {
    conversations,
    activeConv: null,
    messages: [],
    sidebarBoards: getSidebarBoards(res.locals.lang),
    activePage: 'messages',
    pageTitle: res.locals.t('msg.title'),
    title: 'Messages'
  });
});

// Open specific conversation
router.get('/messages/:convId', requireLogin, (req, res) => {
  const uid = req.session.user.id;
  const conv = db.prepare(`SELECT * FROM conversations WHERE id=? AND (user1_id=? OR user2_id=?)`).get(req.params.convId, uid, uid);
  if (!conv) return res.redirect('/messages');

  // Mark messages as read
  db.prepare(`UPDATE messages SET is_read=1 WHERE conversation_id=? AND sender_id!=? AND is_read=0`).run(conv.id, uid);

  const messages = db.prepare(`
    SELECT m.*, u.username, u.avatar_color FROM messages m JOIN users u ON m.sender_id=u.id
    WHERE m.conversation_id=? ORDER BY m.created_at ASC
  `).all(conv.id);

  const conversations = db.prepare(`
    SELECT c.*,
      CASE WHEN c.user1_id=? THEN u2.username ELSE u1.username END as other_name,
      CASE WHEN c.user1_id=? THEN u2.avatar_color ELSE u1.avatar_color END as other_color,
      CASE WHEN c.user1_id=? THEN c.user2_id ELSE c.user1_id END as other_id,
      (SELECT m.content FROM messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) as last_msg,
      (SELECT m.msg_type FROM messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) as last_msg_type,
      (SELECT m.created_at FROM messages m WHERE m.conversation_id=c.id ORDER BY m.created_at DESC LIMIT 1) as last_msg_time,
      (SELECT COUNT(*) FROM messages m WHERE m.conversation_id=c.id AND m.sender_id!=? AND m.is_read=0) as unread_count
    FROM conversations c
    JOIN users u1 ON c.user1_id=u1.id
    JOIN users u2 ON c.user2_id=u2.id
    WHERE c.user1_id=? OR c.user2_id=?
    ORDER BY c.last_message_at DESC
  `).all(uid, uid, uid, uid, uid, uid);

  const otherId = conv.user1_id === uid ? conv.user2_id : conv.user1_id;
  const otherUser = db.prepare('SELECT username, avatar_color FROM users WHERE id=?').get(otherId);

  res.render('messages', {
    conversations,
    activeConv: { ...conv, other_name: otherUser.username, other_color: otherUser.avatar_color, other_id: otherId },
    messages,
    sidebarBoards: getSidebarBoards(res.locals.lang),
    activePage: 'messages',
    pageTitle: res.locals.t('msg.title'),
    title: 'Messages'
  });
});

// Start new conversation
router.post('/messages/new', requireLogin, (req, res) => {
  const uid = req.session.user.id;
  const { username } = req.body;
  const target = db.prepare('SELECT id FROM users WHERE username=?').get(username);
  if (!target || target.id === uid) return res.redirect('/messages');

  const id1 = Math.min(uid, target.id), id2 = Math.max(uid, target.id);
  let conv = db.prepare('SELECT * FROM conversations WHERE user1_id=? AND user2_id=?').get(id1, id2);
  if (!conv) {
    const r = db.prepare('INSERT INTO conversations (user1_id, user2_id) VALUES (?,?)').run(id1, id2);
    conv = { id: r.lastInsertRowid };
  }
  res.redirect('/messages/' + conv.id);
});

// Send text message
router.post('/messages/:convId/send', requireLogin, (req, res) => {
  const uid = req.session.user.id;
  const conv = db.prepare('SELECT * FROM conversations WHERE id=? AND (user1_id=? OR user2_id=?)').get(req.params.convId, uid, uid);
  if (!conv) return res.json({ error: 'invalid' });

  const { content, msg_type, file_data, file_ext } = req.body;
  let filePath = '';

  if (msg_type && msg_type !== 'text' && file_data) {
    // Save base64 file
    const ext = file_ext || (msg_type === 'image' ? 'png' : msg_type === 'video' ? 'mp4' : 'webm');
    const fname = `msg_${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`;
    const fpath = path.join(__dirname, '..', 'public', 'uploads', fname);
    const buffer = Buffer.from(file_data, 'base64');
    fs.writeFileSync(fpath, buffer);
    filePath = '/uploads/' + fname;
  }

  db.prepare('INSERT INTO messages (conversation_id, sender_id, content, msg_type, file_path) VALUES (?,?,?,?,?)').run(
    conv.id, uid, content || '', msg_type || 'text', filePath
  );
  db.prepare('UPDATE conversations SET last_message_at=CURRENT_TIMESTAMP WHERE id=?').run(conv.id);

  res.json({ ok: true });
});

// API: Get messages for polling
router.get('/api/messages/:convId', requireLogin, (req, res) => {
  const uid = req.session.user.id;
  const conv = db.prepare('SELECT * FROM conversations WHERE id=? AND (user1_id=? OR user2_id=?)').get(req.params.convId, uid, uid);
  if (!conv) return res.json([]);
  db.prepare('UPDATE messages SET is_read=1 WHERE conversation_id=? AND sender_id!=? AND is_read=0').run(conv.id, uid);
  const msgs = db.prepare('SELECT m.*, u.username, u.avatar_color FROM messages m JOIN users u ON m.sender_id=u.id WHERE m.conversation_id=? ORDER BY m.created_at ASC').all(conv.id);
  res.json(msgs);
});

// API: Search users for new conversation
router.get('/api/users/search', requireLogin, (req, res) => {
  const q = req.query.q || '';
  if (q.length < 1) return res.json([]);
  const users = db.prepare("SELECT id, username, avatar_color FROM users WHERE username LIKE ? AND id!=? LIMIT 10").all(`%${q}%`, req.session.user.id);
  res.json(users);
});

// API: Unread count
router.get('/api/messages/unread-count', requireLogin, (req, res) => {
  const uid = req.session.user.id;
  const r = db.prepare(`
    SELECT COUNT(*) as c FROM messages m
    JOIN conversations co ON m.conversation_id=co.id
    WHERE m.sender_id!=? AND m.is_read=0 AND (co.user1_id=? OR co.user2_id=?)
  `).get(uid, uid, uid);
  res.json({ count: r.c });
});

module.exports = router;
