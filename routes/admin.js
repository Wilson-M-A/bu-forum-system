const express = require('express');
const router = express.Router();
const db = require('../db');

router.use((req, res, next) => {
  if (!req.session.user?.is_admin) return res.redirect('/');
  next();
});

router.get('/', (req, res) => {
  const stats = {
    users: db.prepare('SELECT COUNT(*) as c FROM users').get().c,
    threads: db.prepare('SELECT COUNT(*) as c FROM threads').get().c,
    replies: db.prepare('SELECT COUNT(*) as c FROM replies').get().c,
    boards: db.prepare('SELECT COUNT(*) as c FROM boards').get().c,
  };
  const recentUsers = db.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT 8').all();
  const recentThreads = db.prepare(`
    SELECT t.*, u.username, b.name as board_name
    FROM threads t JOIN users u ON t.user_id = u.id JOIN boards b ON t.board_id = b.id
    ORDER BY t.created_at DESC LIMIT 10
  `).all();
  res.render('admin/index', { stats, recentUsers, recentThreads });
});

// ── BOARDS (with multilingual support) ──
router.get('/boards', (req, res) => {
  const boards = db.prepare(`
    SELECT b.*, (SELECT COUNT(*) FROM threads t WHERE t.board_id = b.id) as thread_count
    FROM boards b ORDER BY b.sort_order
  `).all();
  res.render('admin/boards', { boards, msg: req.query.msg || null });
});

router.post('/boards/create', (req, res) => {
  const { name, name_zh_tw, name_en, description, desc_zh_tw, desc_en, icon } = req.body;
  if (!name?.trim()) return res.redirect('/admin/boards');
  const maxOrder = db.prepare('SELECT MAX(sort_order) as m FROM boards').get().m || 0;
  db.prepare('INSERT INTO boards (name, name_zh_tw, name_en, description, desc_zh_tw, desc_en, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
    name.trim(),
    (name_zh_tw || '').trim(),
    (name_en || '').trim(),
    (description || '').trim(),
    (desc_zh_tw || '').trim(),
    (desc_en || '').trim(),
    icon || '💬',
    maxOrder + 1
  );
  res.redirect('/admin/boards?msg=created');
});

router.post('/boards/delete/:id', (req, res) => {
  db.prepare('DELETE FROM boards WHERE id = ?').run(req.params.id);
  res.redirect('/admin/boards?msg=deleted');
});

// ── USERS ──
router.get('/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
  res.render('admin/users', { users });
});

router.post('/users/toggle-admin/:id', (req, res) => {
  const target = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (target && target.id !== req.session.user.id) {
    db.prepare('UPDATE users SET is_admin = ? WHERE id = ?').run(target.is_admin ? 0 : 1, target.id);
  }
  res.redirect('/admin/users');
});

router.post('/users/delete/:id', (req, res) => {
  const target = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (target && target.id !== req.session.user.id) {
    db.prepare('DELETE FROM users WHERE id = ?').run(target.id);
  }
  res.redirect('/admin/users');
});

// ── THREADS ──
router.post('/threads/delete/:id', (req, res) => {
  db.prepare('DELETE FROM threads WHERE id = ?').run(req.params.id);
  res.redirect('/admin');
});

router.post('/threads/pin/:id', (req, res) => {
  const t = db.prepare('SELECT is_pinned FROM threads WHERE id = ?').get(req.params.id);
  if (t) db.prepare('UPDATE threads SET is_pinned = ? WHERE id = ?').run(t.is_pinned ? 0 : 1, req.params.id);
  res.redirect('/thread/' + req.params.id);
});

router.post('/threads/lock/:id', (req, res) => {
  const t = db.prepare('SELECT is_locked FROM threads WHERE id = ?').get(req.params.id);
  if (t) db.prepare('UPDATE threads SET is_locked = ? WHERE id = ?').run(t.is_locked ? 0 : 1, req.params.id);
  res.redirect('/thread/' + req.params.id);
});

// ── CALENDAR ──
router.get('/calendar', (req, res) => {
  const events = db.prepare(`SELECT ce.*, u.username FROM calendar_events ce JOIN users u ON ce.created_by=u.id ORDER BY ce.event_date DESC`).all();
  res.render('admin/calendar', { events, msg: req.query.msg || null });
});

router.post('/calendar/create', (req, res) => {
  const { title, description, event_date, event_time, location } = req.body;
  if (!title?.trim() || !event_date) return res.redirect('/admin/calendar');
  db.prepare('INSERT INTO calendar_events (title, description, event_date, event_time, location, created_by) VALUES (?,?,?,?,?,?)').run(
    title.trim(), description || '', event_date, event_time || '', location || '', req.session.user.id
  );
  res.redirect('/admin/calendar?msg=created');
});

router.post('/calendar/delete/:id', (req, res) => {
  db.prepare('DELETE FROM calendar_events WHERE id=?').run(req.params.id);
  res.redirect('/admin/calendar?msg=deleted');
});

module.exports = router;
