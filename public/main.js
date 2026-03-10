// Like / Favorite buttons via AJAX
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;
  let url;

  if (action === 'like-thread') url = `/like/thread/${id}`;
  else if (action === 'like-reply') url = `/like/reply/${id}`;
  else if (action === 'favorite') url = `/favorite/${id}`;
  else return;

  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    if (res.status === 302 || res.redirected) { window.location = '/login'; return; }
    const data = await res.json();

    if (action === 'like-thread' || action === 'like-reply') {
      const countEl = btn.querySelector('.like-count');
      if (countEl) countEl.textContent = data.count;
      btn.classList.toggle('active', data.liked);
    }
    if (action === 'favorite') {
      btn.classList.toggle('fav-active', data.favorited);
      const span = btn.querySelector('span');
      // Get current language from html lang attribute
      const lang = document.documentElement.lang || 'zh-CN';
      const savedText = lang === 'zh-TW' ? '已收藏' : lang === 'en' ? 'Saved' : '已收藏';
      const saveText = lang === 'zh-TW' ? '收藏' : lang === 'en' ? 'Save' : '收藏';
      if (span) span.textContent = data.favorited ? savedText : saveText;
    }
  } catch (err) {
    console.error(err);
  }
});

// Time formatting with i18n
function timeAgo(dateStr) {
  const lang = document.documentElement.lang || 'zh-CN';
  const now = new Date();
  const date = new Date(dateStr + (dateStr.includes('Z') ? '' : ' UTC+8'));
  const diff = Math.floor((now - date) / 1000);

  const i18n = {
    'zh-CN': { just_now: '刚刚', min: ' 分钟前', hour: ' 小时前', day: ' 天前' },
    'zh-TW': { just_now: '剛剛', min: ' 分鐘前', hour: ' 小時前', day: ' 天前' },
    'en':    { just_now: 'just now', min: 'm ago', hour: 'h ago', day: 'd ago' },
  };
  const t = i18n[lang] || i18n['zh-CN'];

  if (diff < 60) return t.just_now;
  if (diff < 3600) return Math.floor(diff / 60) + t.min;
  if (diff < 86400) return Math.floor(diff / 3600) + t.hour;
  if (diff < 2592000) return Math.floor(diff / 86400) + t.day;
  const locale = lang === 'en' ? 'en-US' : lang === 'zh-TW' ? 'zh-TW' : 'zh-CN';
  return date.toLocaleDateString(locale);
}

document.querySelectorAll('[data-time]').forEach(el => {
  el.textContent = timeAgo(el.dataset.time);
  el.title = el.dataset.time;
});
