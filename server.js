const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
require('./db');
const { createT, supportedLangs, defaultLang } = require('./i18n');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'forum-secret-change-me-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

// Language switch
app.get('/set-lang/:lang', (req, res) => {
  if (supportedLangs.includes(req.params.lang)) req.session.lang = req.params.lang;
  res.redirect(req.get('Referer') || '/');
});

// Globals for all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  const lang = req.session.lang || defaultLang;
  res.locals.lang = lang;
  res.locals.t = createT(lang);
  res.locals.supportedLangs = supportedLangs;
  next();
});

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/forum'));
app.use('/', require('./routes/calendar'));
app.use('/', require('./routes/messages'));
app.use('/admin', require('./routes/admin'));

app.use((req, res) => {
  res.status(404).render('error', { message: res.locals.t('error.404') });
});

app.listen(PORT, () => {
  console.log(`\n✅ 论坛已启动！`);
  console.log(`🌐 访问地址：http://localhost:${PORT}`);
  console.log(`👤 管理员账号：admin / 密码：admin123\n`);
});
