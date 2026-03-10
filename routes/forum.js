const express = require('express');
const router = express.Router();
const db = require('../db');

const requireLogin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

// ── Board localization helper ──
function localizeBoard(board, lang) {
  if (lang === 'en' && board.name_en) {
    board.name = board.name_en;
    board.description = board.desc_en || board.description;
  } else if (lang === 'zh-TW' && board.name_zh_tw) {
    board.name = board.name_zh_tw;
    board.description = board.desc_zh_tw || board.description;
  }
  return board;
}

function getSidebarBoards(lang) {
  const boards = db.prepare(`SELECT b.*, (SELECT COUNT(*) FROM threads t WHERE t.board_id=b.id) as thread_count FROM boards b ORDER BY b.sort_order`).all();
  return boards.map(b => localizeBoard({...b}, lang));
}

// ── HOME ──
router.get('/', (req, res) => {
  const lang = res.locals.lang;
  const boards = db.prepare(`
    SELECT b.*,
      (SELECT COUNT(*) FROM threads t WHERE t.board_id=b.id) as thread_count,
      (SELECT COUNT(*) FROM replies r JOIN threads t ON r.thread_id=t.id WHERE t.board_id=b.id) as reply_count,
      (SELECT t.title FROM threads t WHERE t.board_id=b.id ORDER BY t.last_reply_at DESC LIMIT 1) as latest_title,
      (SELECT t.id FROM threads t WHERE t.board_id=b.id ORDER BY t.last_reply_at DESC LIMIT 1) as latest_id,
      (SELECT u.username FROM threads t JOIN users u ON t.user_id=u.id WHERE t.board_id=b.id ORDER BY t.last_reply_at DESC LIMIT 1) as latest_user
    FROM boards b ORDER BY b.sort_order
  `).all().map(b => localizeBoard({...b}, lang));

  const stats = {
    users: db.prepare('SELECT COUNT(*) as c FROM users').get().c,
    threads: db.prepare('SELECT COUNT(*) as c FROM threads').get().c,
    replies: db.prepare('SELECT COUNT(*) as c FROM replies').get().c,
  };
  res.render('index', { boards, stats, sidebarBoards: getSidebarBoards(lang), activePage: 'home', pageTitle: 'Home · HKBU Forum', title: 'Home' });
});

// ── BOARD ──
router.get('/board/:id', (req, res) => {
  const lang = res.locals.lang;
  const board = db.prepare('SELECT * FROM boards WHERE id=?').get(req.params.id);
  if (!board) return res.redirect('/');
  localizeBoard(board, lang);

  const page = Math.max(1, parseInt(req.query.page)||1);
  const limit = 25, offset = (page-1)*limit;
  const sort = req.query.sort || 'latest';
  let orderBy = 't.is_pinned DESC, t.last_reply_at DESC';
  if (sort === 'hot') orderBy = 't.is_pinned DESC, (t.like_count + t.reply_count*2) DESC';
  if (sort === 'unanswered') orderBy = 't.is_pinned DESC, t.reply_count ASC, t.created_at DESC';
  const threads = db.prepare(`SELECT t.*, u.username, u.avatar_color FROM threads t JOIN users u ON t.user_id=u.id WHERE t.board_id=? ORDER BY ${orderBy} LIMIT ? OFFSET ?`).all(req.params.id, limit, offset);
  const total = db.prepare('SELECT COUNT(*) as c FROM threads WHERE board_id=?').get(req.params.id).c;
  res.render('board', { board, threads, page, totalPages: Math.ceil(total/limit), total, sort, sidebarBoards: getSidebarBoards(lang), pageTitle: board.name, title: board.name });
});

// ── THREAD ──
router.get('/thread/:id', (req, res) => {
  const lang = res.locals.lang;
  const thread = db.prepare(`SELECT t.*, u.username, u.avatar_color, u.post_count, b.name as board_name, b.id as board_id_ref FROM threads t JOIN users u ON t.user_id=u.id JOIN boards b ON t.board_id=b.id WHERE t.id=?`).get(req.params.id);
  if (!thread) return res.redirect('/');
  db.prepare('UPDATE threads SET views=views+1 WHERE id=?').run(thread.id);
  const replies = db.prepare(`SELECT r.*, u.username, u.avatar_color, u.post_count FROM replies r JOIN users u ON r.user_id=u.id WHERE r.thread_id=? ORDER BY r.created_at ASC`).all(thread.id);
  let userLiked=false, userFavorited=false, likedReplies=[];
  if (req.session.user) {
    userLiked = !!db.prepare('SELECT 1 FROM thread_likes WHERE user_id=? AND thread_id=?').get(req.session.user.id, thread.id);
    userFavorited = !!db.prepare('SELECT 1 FROM favorites WHERE user_id=? AND thread_id=?').get(req.session.user.id, thread.id);
    likedReplies = db.prepare('SELECT reply_id FROM reply_likes WHERE user_id=?').all(req.session.user.id).map(r=>r.reply_id);
  }
  res.render('thread', { thread, replies, userLiked, userFavorited, likedReplies, sidebarBoards: getSidebarBoards(lang), pageTitle: thread.title, title: thread.title });
});

// ── NEW THREAD ──
router.get('/new-thread/:boardId', requireLogin, (req, res) => {
  const lang = res.locals.lang;
  const board = db.prepare('SELECT * FROM boards WHERE id=?').get(req.params.boardId);
  if (!board) return res.redirect('/');
  localizeBoard(board, lang);
  res.render('new-thread', { board, error: null, sidebarBoards: getSidebarBoards(lang), pageTitle: 'New Post', title: 'New Post' });
});

router.post('/new-thread/:boardId', requireLogin, (req, res) => {
  const lang = res.locals.lang;
  const { title, content, add_to_calendar, event_date, event_time, event_location } = req.body;
  const board = db.prepare('SELECT * FROM boards WHERE id=?').get(req.params.boardId);
  if (!board) return res.redirect('/');
  localizeBoard(board, lang);
  if (!title?.trim() || !content?.trim()) return res.render('new-thread', { board, error: 'Title and content cannot be empty.', sidebarBoards: getSidebarBoards(lang), pageTitle: 'New Post', title: 'New Post' });
  if (title.length > 100) return res.render('new-thread', { board, error: 'Title cannot exceed 100 characters.', sidebarBoards: getSidebarBoards(lang), pageTitle: 'New Post', title: 'New Post' });
  const r = db.prepare('INSERT INTO threads (board_id,user_id,title,content) VALUES (?,?,?,?)').run(req.params.boardId, req.session.user.id, title.trim(), content.trim());
  db.prepare('UPDATE users SET post_count=post_count+1 WHERE id=?').run(req.session.user.id);

  if (add_to_calendar && event_date) {
    db.prepare('INSERT INTO calendar_events (title, description, event_date, event_time, location, thread_id, created_by) VALUES (?,?,?,?,?,?,?)').run(
      title.trim(), content.trim().substring(0, 200), event_date, event_time || '', event_location || '', r.lastInsertRowid, req.session.user.id
    );
  }

  res.redirect('/thread/'+r.lastInsertRowid);
});

// ── REPLY ──
router.post('/reply/:threadId', requireLogin, (req, res) => {
  const { content } = req.body;
  const thread = db.prepare('SELECT * FROM threads WHERE id=?').get(req.params.threadId);
  if (!thread || thread.is_locked || !content?.trim()) return res.redirect('/thread/'+req.params.threadId);
  db.prepare('INSERT INTO replies (thread_id,user_id,content) VALUES (?,?,?)').run(thread.id, req.session.user.id, content.trim());
  db.prepare('UPDATE threads SET reply_count=reply_count+1, last_reply_at=CURRENT_TIMESTAMP WHERE id=?').run(thread.id);
  db.prepare('UPDATE users SET post_count=post_count+1 WHERE id=?').run(req.session.user.id);
  res.redirect('/thread/'+thread.id+'#end');
});

// ── LIKES ──
router.post('/like/thread/:id', requireLogin, (req, res) => {
  const tid=parseInt(req.params.id), uid=req.session.user.id;
  const exists=db.prepare('SELECT 1 FROM thread_likes WHERE user_id=? AND thread_id=?').get(uid,tid);
  if (exists) { db.prepare('DELETE FROM thread_likes WHERE user_id=? AND thread_id=?').run(uid,tid); db.prepare('UPDATE threads SET like_count=MAX(0,like_count-1) WHERE id=?').run(tid); }
  else { db.prepare('INSERT OR IGNORE INTO thread_likes (user_id,thread_id) VALUES (?,?)').run(uid,tid); db.prepare('UPDATE threads SET like_count=like_count+1 WHERE id=?').run(tid); }
  const t=db.prepare('SELECT like_count FROM threads WHERE id=?').get(tid);
  res.json({ liked: !exists, count: t.like_count });
});

router.post('/like/reply/:id', requireLogin, (req, res) => {
  const rid=parseInt(req.params.id), uid=req.session.user.id;
  const exists=db.prepare('SELECT 1 FROM reply_likes WHERE user_id=? AND reply_id=?').get(uid,rid);
  if (exists) { db.prepare('DELETE FROM reply_likes WHERE user_id=? AND reply_id=?').run(uid,rid); db.prepare('UPDATE replies SET like_count=MAX(0,like_count-1) WHERE id=?').run(rid); }
  else { db.prepare('INSERT OR IGNORE INTO reply_likes (user_id,reply_id) VALUES (?,?)').run(uid,rid); db.prepare('UPDATE replies SET like_count=like_count+1 WHERE id=?').run(rid); }
  const r=db.prepare('SELECT like_count FROM replies WHERE id=?').get(rid);
  res.json({ liked: !exists, count: r.like_count });
});

// ── FAVORITES ──
router.post('/favorite/:threadId', requireLogin, (req, res) => {
  const tid=parseInt(req.params.threadId), uid=req.session.user.id;
  const exists=db.prepare('SELECT 1 FROM favorites WHERE user_id=? AND thread_id=?').get(uid,tid);
  if (exists) { db.prepare('DELETE FROM favorites WHERE user_id=? AND thread_id=?').run(uid,tid); return res.json({favorited:false}); }
  db.prepare('INSERT OR IGNORE INTO favorites (user_id,thread_id) VALUES (?,?)').run(uid,tid);
  res.json({favorited:true});
});

router.get('/my-favorites', requireLogin, (req, res) => {
  const lang = res.locals.lang;
  const favorites = db.prepare(`SELECT t.*, u.username, u.avatar_color, b.name as board_name FROM favorites f JOIN threads t ON f.thread_id=t.id JOIN users u ON t.user_id=u.id JOIN boards b ON t.board_id=b.id WHERE f.user_id=? ORDER BY f.created_at DESC`).all(req.session.user.id);
  res.render('favorites', { favorites, sidebarBoards: getSidebarBoards(lang), activePage: 'favorites', pageTitle: 'My Favorites', title: 'Favorites' });
});

// ── HIKING MAP ──
router.get('/hiking-map', (req, res) => {
  const lang = res.locals.lang;
  res.render('hiking-map', { sidebarBoards: getSidebarBoards(lang), activePage: 'hiking', pageTitle: res.locals.t('nav.hiking_map'), title: 'Hiking Map' });
});

module.exports = router;
