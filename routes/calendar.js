const express = require('express');
const router = express.Router();
const db = require('../db');

function localizeBoard(board, lang) {
  if (lang === 'en' && board.name_en) { board.name = board.name_en; board.description = board.desc_en || board.description; }
  else if (lang === 'zh-TW' && board.name_zh_tw) { board.name = board.name_zh_tw; board.description = board.desc_zh_tw || board.description; }
  return board;
}
function getSidebarBoards(lang) {
  return db.prepare(`SELECT b.*, (SELECT COUNT(*) FROM threads t WHERE t.board_id=b.id) as thread_count FROM boards b ORDER BY b.sort_order`).all().map(b => localizeBoard({...b}, lang));
}

router.get('/calendar', (req, res) => {
  const lang = res.locals.lang;
  const events = db.prepare(`SELECT ce.*, u.username FROM calendar_events ce JOIN users u ON ce.created_by=u.id ORDER BY ce.event_date ASC`).all();
  res.render('calendar', {
    events: JSON.stringify(events),
    sidebarBoards: getSidebarBoards(lang),
    activePage: 'calendar',
    pageTitle: res.locals.t('cal.title'),
    title: 'Calendar'
  });
});

router.get('/api/calendar/events', (req, res) => {
  const events = db.prepare(`SELECT ce.*, u.username FROM calendar_events ce JOIN users u ON ce.created_by=u.id ORDER BY ce.event_date ASC`).all();
  res.json(events);
});

router.get('/calendar/export/:id', (req, res) => {
  const ev = db.prepare('SELECT * FROM calendar_events WHERE id=?').get(req.params.id);
  if (!ev) return res.status(404).send('Event not found');
  const dtStart = ev.event_date.replace(/-/g, '') + (ev.event_time ? 'T' + ev.event_time.replace(/:/g, '') + '00' : '');
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//HKBU Forum//EN','BEGIN:VEVENT',
    'DTSTART:'+dtStart,'SUMMARY:'+ev.title,
    ev.location?'LOCATION:'+ev.location:'', ev.description?'DESCRIPTION:'+ev.description.replace(/\n/g,'\\n'):'',
    'UID:event-'+ev.id+'@hkbu-forum','END:VEVENT','END:VCALENDAR'].filter(Boolean).join('\r\n');
  res.setHeader('Content-Type','text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition','attachment; filename="event-'+ev.id+'.ics"');
  res.send(ics);
});

router.get('/calendar/export-all', (req, res) => {
  const events = db.prepare('SELECT * FROM calendar_events ORDER BY event_date ASC').all();
  let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//HKBU Forum//EN\r\n';
  events.forEach(ev => {
    const dtStart = ev.event_date.replace(/-/g,'') + (ev.event_time?'T'+ev.event_time.replace(/:/g,'')+'00':'');
    ics += 'BEGIN:VEVENT\r\nDTSTART:'+dtStart+'\r\nSUMMARY:'+ev.title+'\r\n';
    if (ev.location) ics += 'LOCATION:'+ev.location+'\r\n';
    if (ev.description) ics += 'DESCRIPTION:'+ev.description.replace(/\n/g,'\\n')+'\r\n';
    ics += 'UID:event-'+ev.id+'@hkbu-forum\r\nEND:VEVENT\r\n';
  });
  ics += 'END:VCALENDAR';
  res.setHeader('Content-Type','text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition','attachment; filename="hkbu-events.ics"');
  res.send(ics);
});

module.exports = router;
