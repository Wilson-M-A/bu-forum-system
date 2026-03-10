const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.render('login', { error: '用户名或密码错误' });
  }
  req.session.user = { id: user.id, username: user.username, is_admin: user.is_admin, avatar_color: user.avatar_color };
  res.redirect('/');
});

router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register', { error: null });
});

router.post('/register', (req, res) => {
  const { username, email, password, confirm } = req.body;
  if (password !== confirm) return res.render('register', { error: '两次密码不一致' });
  if (password.length < 6) return res.render('register', { error: '密码至少6位' });
  if (username.length < 2 || username.length > 20) return res.render('register', { error: '用户名需在2-20字之间' });

  const allowedDomains = ['@life.hkbu.edu.hk', '@hkbu.edu.hk'];
  if (!allowedDomains.some(d => email.endsWith(d))) {
    return res.render('register', { error: 'Only HKBU email addresses are allowed (@life.hkbu.edu.hk or @hkbu.edu.hk)' });
  }
  const exists = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (exists) return res.render('register', { error: '用户名或邮箱已被注册 / Username or email already registered' });

  const colors = ['#2A5C1B','#C4782A','#1A5276','#7D3C98','#B03A2E','#117A65'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const hash = bcrypt.hashSync(password, 10);

  const result = db.prepare('INSERT INTO users (username, email, password_hash, avatar_color) VALUES (?, ?, ?, ?)').run(username, email, hash, color);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  req.session.user = { id: user.id, username: user.username, is_admin: user.is_admin, avatar_color: user.avatar_color };
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
