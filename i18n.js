// i18n.js – Full internationalization for HKBU Forum
// zh-CN = Simplified Chinese, zh-TW = Traditional Chinese, en = English

const T = {
  // ── SIDEBAR & NAV ──
  'sidebar.title':        ['HKBU Forum','HKBU Forum','HKBU Forum'],
  'sidebar.subtitle':     ['香港浸会大学','香港浸會大學','Hong Kong Baptist University'],
  'sidebar.student_tag':  ['HKBU 学生','HKBU 學生','HKBU Student'],
  'nav.navigation':       ['导航','導航','Navigation'],
  'nav.home':             ['首页','首頁','Home'],
  'nav.favorites':        ['我的收藏','我的收藏','My Favorites'],
  'nav.boards':           ['板块','板塊','Boards'],
  'nav.admin':            ['管理','管理','Admin'],
  'nav.dashboard':        ['控制台','控制台','Dashboard'],
  'nav.login':            ['登录','登入','Login'],
  'nav.register':         ['注册','註冊','Register'],
  'nav.logout':           ['退出','退出','Logout'],
  'nav.hiking_map':       ['登山地图','登山地圖','Hiking Map'],
  'nav.calendar':         ['活动日历','活動日曆','Event Calendar'],
  'nav.messages':         ['私信','私訊','Messages'],

  // ── RIGHT PANEL ──
  'panel.online':         ['在线成员','在線成員','Online Members'],
  'panel.active':         ['社区活跃中','社區活躍中','Active community'],
  'panel.quick_links':    ['快捷链接','快捷連結','Quick Links'],
  'panel.join':           ['加入 HKBU 论坛','加入 HKBU 論壇','Join HKBU Forum'],
  'panel.about':          ['关于','關於','About'],
  'panel.about_text':     [
    'HKBU 学生论坛仅供香港浸会大学在校学生使用。<br><br>仅接受 @hkbu.edu.hk 和 @life.hkbu.edu.hk 邮箱注册。',
    'HKBU 學生論壇僅供香港浸會大學在校學生使用。<br><br>僅接受 @hkbu.edu.hk 和 @life.hkbu.edu.hk 郵箱註冊。',
    'HKBU Student Forum is exclusively for Hong Kong Baptist University students.<br><br>Only @hkbu.edu.hk and @life.hkbu.edu.hk emails are accepted.'
  ],

  // ── HOME / INDEX ──
  'home.welcome':         ['欢迎来到 HKBU 学生论坛','歡迎來到 HKBU 學生論壇','Welcome to HKBU Student Forum'],
  'home.subtitle':        [
    '香港浸会大学学生专属社区',
    '香港浸會大學學生專屬社區',
    'A community exclusively for Hong Kong Baptist University students'
  ],
  'home.join_now':        ['立即注册','立即註冊','Join Now'],
  'home.login_btn':       ['登录','登入','Login'],
  'home.students':        ['学生','學生','Students'],
  'home.posts':           ['帖子','帖子','Posts'],
  'home.replies':         ['回复','回覆','Replies'],
  'home.welcome_back':    ['欢迎回来，','歡迎回來，','Welcome back, '],
  'home.member_tag':      ['HKBU 学生 · 成员','HKBU 學生 · 成員','HKBU Student · Member'],
  'home.members':         ['成员','成員','Members'],
  'home.all_boards':      ['所有板块','所有板塊','All Boards'],
  'home.latest':          ['最新：','最新：','Latest: '],

  // ── BOARD ──
  'board.new_post':       ['✏️ 发帖','✏️ 發帖','✏️ New Post'],
  'board.login_post':     ['登录后发帖','登入後發帖','Login to Post'],
  'board.latest':         ['🕐 最新','🕐 最新','🕐 Latest'],
  'board.hot':            ['🔥 热门','🔥 熱門','🔥 Hot'],
  'board.unanswered':     ['💬 未回复','💬 未回覆','💬 Unanswered'],
  'board.no_posts':       ['暂无帖子','暫無帖子','No posts yet'],
  'board.be_first':       ['快来发布第一篇帖子吧！','快來發布第一篇帖子吧！','Be the first to post in this board!'],
  'board.pinned':         ['📌 置顶','📌 置頂','📌 Pinned'],
  'board.locked':         ['🔒 锁定','🔒 鎖定','🔒 Locked'],
  'board.last_reply':     ['最后回复：','最後回覆：','Last reply: '],
  'board.replies':        ['回复','回覆','replies'],
  'board.views':          ['浏览','瀏覽','views'],
  'board.likes':          ['赞','讚','likes'],
  'board.posts':          ['帖子','帖子','posts'],
  'board.prev':           ['← 上一页','← 上一頁','← Prev'],
  'board.next':           ['下一页 →','下一頁 →','Next →'],

  // ── THREAD ──
  'thread.home':          ['首页','首頁','Home'],
  'thread.views':         [' 浏览',' 瀏覽',' views'],
  'thread.replies':       [' 条回复',' 條回覆',' replies'],
  'thread.save':          ['收藏','收藏','Save'],
  'thread.saved':         ['已收藏','已收藏','Saved'],
  'thread.login_react':   ['登录后互动','登入後互動','Login to react'],
  'thread.replies_title': [' 条回复',' 條回覆',' Replies'],
  'thread.join_disc':     ['加入讨论','加入討論','Join the Discussion'],
  'thread.or':            [' 或 ',' 或 ',' or '],
  'thread.to_reply':      [' 后回复。',' 後回覆。',' to reply.'],
  'thread.locked_msg':    ['🔒 此帖已被锁定。','🔒 此帖已被鎖定。','🔒 This thread is locked.'],
  'thread.post_reply':    ['发表回复','發表回覆','Post a Reply'],
  'thread.write_reply':   ['写下你的回复…','寫下你的回覆…','Write your reply…'],
  'thread.submit_reply':  ['提交回复','提交回覆','Post Reply'],
  'thread.unpin':         ['取消置顶','取消置頂','Unpin'],
  'thread.pin':           ['📌 置顶','📌 置頂','📌 Pin'],
  'thread.unlock':        ['解锁','解鎖','Unlock'],
  'thread.lock':          ['🔒 锁定','🔒 鎖定','🔒 Lock'],
  'thread.delete':        ['删除','刪除','Delete'],
  'thread.delete_confirm':['确认删除此帖？','確認刪除此帖？','Delete this post?'],
  'thread.posts_label':   ['帖子数：','帖子數：','Posts: '],

  // ── NEW THREAD ──
  'nt.new_post':          ['发帖','發帖','New Post'],
  'nt.title_in':          ['✏️ 发帖到 ','✏️ 發帖到 ','✏️ New Post in '],
  'nt.post_title':        ['帖子标题（最多100字）','帖子標題（最多100字）','Post Title (max 100 chars)'],
  'nt.title_ph':          ['输入一个吸引人的标题…','輸入一個吸引人的標題…','Enter an engaging title…'],
  'nt.content':           ['内容','內容','Content'],
  'nt.content_ph':        ['分享你的想法、经历或问题…','分享你的想法、經歷或問題…','Share your thoughts, experiences, or questions…'],
  'nt.publish':           ['发布帖子','發布帖子','Publish Post'],
  'nt.cancel':            ['取消','取消','Cancel'],
  'nt.add_calendar':      ['📅 添加到活动日历','📅 添加到活動日曆','📅 Add to Event Calendar'],
  'nt.event_date':        ['活动日期','活動日期','Event Date'],
  'nt.event_time':        ['活动时间','活動時間','Event Time'],
  'nt.event_location':    ['活动地点','活動地點','Event Location'],
  'nt.event_location_ph': ['例：大学会堂','例：大學會堂','e.g. University Hall'],

  // ── FAVORITES ──
  'fav.title':            ['⭐ 我的收藏','⭐ 我的收藏','⭐ My Favorites'],
  'fav.back':             ['← 返回','← 返回','← Back'],
  'fav.empty':            ['暂无收藏','暫無收藏','No favorites yet'],
  'fav.empty_desc':       ['为喜欢的帖子点击收藏，稍后在这里找到它们。','為喜歡的帖子點擊收藏，稍後在這裡找到它們。','Star posts you like to find them here later.'],

  // ── LOGIN ──
  'login.welcome':        ['欢迎回来','歡迎回來','Welcome Back'],
  'login.subtitle':       ['登录 HKBU 学生论坛','登入 HKBU 學生論壇','Login to HKBU Student Forum'],
  'login.username':       ['用户名','使用者名稱','Username'],
  'login.username_ph':    ['输入用户名','輸入使用者名稱','Your username'],
  'login.password':       ['密码','密碼','Password'],
  'login.password_ph':    ['输入密码','輸入密碼','Your password'],
  'login.submit':         ['登录','登入','Login'],
  'login.no_account':     ['没有账号？','沒有帳號？','No account? '],
  'login.register_link':  ['用 HKBU 邮箱注册','用 HKBU 郵箱註冊','Register with HKBU email'],

  // ── REGISTER ──
  'reg.title':            ['加入 HKBU 论坛','加入 HKBU 論壇','Join HKBU Forum'],
  'reg.subtitle':         ['使用你的 HKBU 邮箱注册','使用你的 HKBU 郵箱註冊','Register with your HKBU email address'],
  'reg.email_notice':     ['🔒 仅接受 @hkbu.edu.hk 和 @life.hkbu.edu.hk 邮箱。','🔒 僅接受 @hkbu.edu.hk 和 @life.hkbu.edu.hk 郵箱。','🔒 Only @hkbu.edu.hk and @life.hkbu.edu.hk email addresses are accepted.'],
  'reg.username':         ['用户名（2-20字）','使用者名稱（2-20字）','Username (2–20 chars)'],
  'reg.username_ph':      ['选择一个用户名','選擇一個使用者名稱','Choose a username'],
  'reg.email':            ['HKBU 邮箱','HKBU 郵箱','HKBU Email'],
  'reg.email_ph':         ['yourname@life.hkbu.edu.hk','yourname@life.hkbu.edu.hk','yourname@life.hkbu.edu.hk'],
  'reg.password':         ['密码（至少6位）','密碼（至少6位）','Password (min 6 chars)'],
  'reg.password_ph':      ['设置密码','設定密碼','Set a password'],
  'reg.confirm':          ['确认密码','確認密碼','Confirm Password'],
  'reg.confirm_ph':       ['重复密码','重複密碼','Repeat password'],
  'reg.submit':           ['创建账号','創建帳號','Create Account'],
  'reg.has_account':      ['已有账号？','已有帳號？','Already have an account? '],

  // ── ERROR ──
  'error.go_home':        ['返回首页','返回首頁','Go Home'],
  'error.404':            ['页面不存在 (404)','頁面不存在 (404)','Page not found (404)'],

  // ── ADMIN ──
  'admin.overview':       ['📊 概览','📊 概覽','📊 Overview'],
  'admin.boards':         ['📋 板块','📋 板塊','📋 Boards'],
  'admin.users':          ['👥 用户','👥 用戶','👥 Users'],
  'admin.view_forum':     ['🏠 查看论坛','🏠 查看論壇','🏠 View Forum'],
  'admin.logout':         ['🚪 退出','🚪 退出','🚪 Logout'],
  'admin.dashboard':      ['📊 控制台','📊 控制台','📊 Dashboard'],
  'admin.students_reg':   ['已注册学生','已註冊學生','Students Registered'],
  'admin.total_posts':    ['帖子总数','帖子總數','Total Posts'],
  'admin.total_replies':  ['回复总数','回覆總數','Total Replies'],
  'admin.active_boards':  ['活跃板块','活躍板塊','Active Boards'],
  'admin.recent_members': ['最近注册','最近註冊','Recent Members'],
  'admin.recent_posts':   ['最近帖子','最近帖子','Recent Posts'],
  'admin.user':           ['用户','用戶','User'],
  'admin.joined':         ['注册时间','註冊時間','Joined'],
  'admin.role':           ['角色','角色','Role'],
  'admin.title_col':      ['标题','標題','Title'],
  'admin.board_col':      ['板块','板塊','Board'],
  'admin.action':         ['操作','操作','Action'],
  'admin.del':            ['删除','刪除','Del'],
  'admin.student':        ['学生','學生','Student'],
  'admin.manage_boards':  ['📋 管理板块','📋 管理板塊','📋 Manage Boards'],
  'admin.board_created':  ['✅ 板块已创建','✅ 板塊已創建','✅ Board created'],
  'admin.new_board':      ['➕ 新建板块','➕ 新建板塊','➕ New Board'],
  'admin.icon_ph':        ['图标（如 🏠）','圖標（如 🏠）','Icon (e.g. 🏠)'],
  'admin.name_ph':        ['板块名称（必填）','板塊名稱（必填）','Board name (required)'],
  'admin.desc_ph':        ['板块描述','板塊描述','Description'],
  'admin.create':         ['创建','創建','Create'],
  'admin.icon':           ['图标','圖標','Icon'],
  'admin.name':           ['名称','名稱','Name'],
  'admin.description':    ['描述','描述','Description'],
  'admin.posts_col':      ['帖子','帖子','Posts'],
  'admin.del_board_cfm':  ['确认删除此板块及所有帖子？','確認刪除此板塊及所有帖子？','Delete board and all posts?'],
  'admin.manage_users':   ['👥 管理用户','👥 管理用戶','👥 Manage Users'],
  'admin.total':          [' 个',' 個',' total'],
  'admin.email':          ['邮箱','郵箱','Email'],
  'admin.actions':        ['操作','操作','Actions'],
  'admin.remove_admin':   ['取消管理员','取消管理員','Remove Admin'],
  'admin.make_admin':     ['设为管理员','設為管理員','Make Admin'],
  'admin.del_user_cfm':   ['确认删除此用户？','確認刪除此用戶？','Delete user?'],
  'admin.you':            ['（你）','（你）','(You)'],
  'admin.calendar':       ['📅 日历管理','📅 日曆管理','📅 Calendar'],
  'admin.manage_calendar':['📅 管理活动日历','📅 管理活動日曆','📅 Manage Calendar'],
  'admin.new_event':      ['➕ 新建活动','➕ 新建活動','➕ New Event'],
  'admin.event_title':    ['活动名称','活動名稱','Event Title'],
  'admin.event_date':     ['日期','日期','Date'],
  'admin.event_time':     ['时间','時間','Time'],
  'admin.event_location': ['地点','地點','Location'],
  'admin.event_desc':     ['活动描述','活動描述','Description'],
  'admin.del_event_cfm':  ['确认删除此活动？','確認刪除此活動？','Delete this event?'],

  // ── CALENDAR ──
  'cal.title':            ['📅 活动日历','📅 活動日曆','📅 Event Calendar'],
  'cal.month':            ['月视图','月視圖','Month'],
  'cal.week':             ['周视图','週視圖','Week'],
  'cal.list':             ['列表','列表','List'],
  'cal.today':            ['今天','今天','Today'],
  'cal.no_events':        ['暂无活动','暫無活動','No events'],
  'cal.location':         ['📍 地点：','📍 地點：','📍 Location: '],
  'cal.time':             ['🕐 时间：','🕐 時間：','🕐 Time: '],
  'cal.view_post':        ['查看原帖','查看原帖','View Post'],
  'cal.export_ics':       ['导出到日历 (.ics)','匯出到日曆 (.ics)','Export to Calendar (.ics)'],
  'cal.upcoming':         ['即将到来的活动','即將到來的活動','Upcoming Events'],
  'cal.sun':['日','日','Sun'],'cal.mon':['一','一','Mon'],'cal.tue':['二','二','Tue'],
  'cal.wed':['三','三','Wed'],'cal.thu':['四','四','Thu'],'cal.fri':['五','五','Fri'],'cal.sat':['六','六','Sat'],
  'cal.months':           [
    ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    ['January','February','March','April','May','June','July','August','September','October','November','December']
  ],

  // ── MESSAGES ──
  'msg.title':            ['💬 私信','💬 私訊','💬 Messages'],
  'msg.new':              ['新消息','新訊息','New Message'],
  'msg.to':               ['发送给','發送給','To'],
  'msg.to_ph':            ['输入用户名…','輸入使用者名稱…','Enter username…'],
  'msg.type_msg':         ['输入消息…','輸入訊息…','Type a message…'],
  'msg.send':             ['发送','發送','Send'],
  'msg.no_conv':          ['暂无对话','暫無對話','No conversations yet'],
  'msg.no_conv_desc':     ['发起一个新对话开始聊天吧！','發起一個新對話開始聊天吧！','Start a new conversation to chat!'],
  'msg.select_conv':      ['选择一个对话开始聊天','選擇一個對話開始聊天','Select a conversation to start chatting'],
  'msg.upload_image':     ['📷 图片','📷 圖片','📷 Image'],
  'msg.upload_video':     ['🎬 视频','🎬 視頻','🎬 Video'],
  'msg.record_voice':     ['🎤 语音','🎤 語音','🎤 Voice'],
  'msg.recording':        ['🔴 录音中…点击停止','🔴 錄音中…點擊停止','🔴 Recording…click to stop'],
  'msg.voice_msg':        ['🎤 语音消息','🎤 語音訊息','🎤 Voice message'],
  'msg.conversations':    ['对话列表','對話列表','Conversations'],

  // ── TIME ──
  'time.just_now':        ['刚刚','剛剛','just now'],
  'time.min':             [' 分钟前',' 分鐘前','m ago'],
  'time.hour':            [' 小时前',' 小時前','h ago'],
  'time.day':             [' 天前',' 天前','d ago'],
};

const LANGS = ['zh-CN','zh-TW','en'];
const IDX = {'zh-CN':0,'zh-TW':1,'en':2};
const DEFAULT = 'zh-CN';

function t(key, lang) {
  const i = IDX[lang] !== undefined ? IDX[lang] : 0;
  const v = T[key];
  if (!v) return key;
  return v[i] !== undefined ? v[i] : v[0];
}

function createT(lang) { return (key) => t(key, lang); }

module.exports = { T, LANGS, DEFAULT, t, createT, supportedLangs: LANGS, defaultLang: DEFAULT };
