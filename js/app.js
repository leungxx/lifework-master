// ============================================================
// 应用主入口
// ============================================================

const App = {
  router: null,

  init() {
    // 创建路由
    this.router = new Router(ROUTES);

    // 渲染应用外壳
    this._renderShell();

    // 初始化路由
    this.router.init();

    // 监听路由变化，渲染页面
    window.addEventListener('route-changed', (e) => {
      this._handleRoute(e.detail.route);
    });

    // 初始化 AOS
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
      });
    }

    // 任务结转
    this._checkRollover();

    // 督促检查
    this._startNudgeCheck();

    // 今日提醒
    this._checkReminders();

    // 晚间教练提醒（晚上8点后提醒做复盘）
    this._startCoachReminder();
  },

  _checkRollover() {
    const settings = Storage.loadSettings();
    const lastOpen = settings.lastOpenDate;
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (lastOpen && lastOpen !== dateStr) {
      Storage.rolloverTasks();
    }
    settings.lastOpenDate = dateStr;
    Storage.saveSettings(settings);
  },

  _startCoachReminder() {
    setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 20 || hour > 22) return;

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const coachData = Storage.loadCoachData();
      if (coachData[dateStr]) return; // 今天已经做过了

      const settings = Storage.loadSettings();
      if (settings.lastCoachReminder === dateStr) return;

      Toast.info('💼 今天的工作复盘做了吗？效能教练在等你', 6000);
      settings.lastCoachReminder = dateStr;
      Storage.saveSettings(settings);
    }, 60 * 60 * 1000);
  },

  _startNudgeCheck() {
    setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      if (hour < 20 || hour > 23) return;

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const tasks = Storage.loadDailyTasks(dateStr);

      if (tasks.length === 0) return;
      if (tasks.every(t => t.done)) return;

      const settings = Storage.loadSettings();
      const lastNudge = settings.lastNudgeDate;
      if (lastNudge === dateStr) return;

      const allTasks = Storage.loadAllDailyTasks();
      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i - 1);
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const t = allTasks[ds] || [];
        if (t.length > 0 && !t.every(x => x.done)) streak++;
        else break;
      }

      if (streak >= 7) {
        Toast.warning('⚠️ 连续7天未完成。打开效能教练，我们一起分析原因。', 10000);
      } else if (streak >= 3) {
        Toast.warning('连续3天未完成目标。去效能教练聊聊吧。', 8000);
      } else {
        Toast.info('⏰ 今天的三件事还没完成哦，现在还有时间！', 5000);
      }

      settings.lastNudgeDate = dateStr;
      Storage.saveSettings(settings);
    }, 30 * 60 * 1000);
  },

  _checkReminders() {
    const todayReminders = Storage.getTodayReminders();
    if (todayReminders.length > 0) {
      setTimeout(() => {
        todayReminders.forEach(r => {
          Toast.warning(`🔔 提醒：${r.title} —— ${r.nextDate}`, 8000);
        });
      }, 2000);
    }
  },

  _renderShell() {
    const appRoot = document.getElementById('app-root');
    appRoot.innerHTML = `
      ${Navbar.render()}
      <div class="page-container">
        <div class="page active" data-page="home" id="page-home"></div>
        <div class="page" data-page="checkin" id="page-checkin"></div>
        <div class="page" data-page="action" id="page-action"></div>
        <div class="page" data-page="reminders" id="page-reminders"></div>
        <div class="page" data-page="coach" id="page-coach"></div>
      </div>
      ${BottomNav.render()}
    `;

    Navbar.initMobileMenu();
    this._renderPage('home');
  },

  _handleRoute(route) {
    this._renderPage(route.page);
  },

  _renderPage(pageName) {
    const pageEl = document.getElementById(`page-${pageName}`);
    if (!pageEl) return;

    let html = '';
    let afterRenderFn = null;

    switch (pageName) {
      case 'home':
        html = HomePage.render();
        afterRenderFn = () => HomePage.afterRender();
        break;
      case 'checkin':
        html = CheckinPage.render();
        afterRenderFn = () => CheckinPage.afterRender();
        break;
      case 'action':
        html = ActionPage.render();
        afterRenderFn = () => ActionPage.afterRender();
        break;
      case 'reminders':
        html = RemindersPage.render();
        afterRenderFn = () => RemindersPage.afterRender();
        break;
      case 'coach':
        html = CoachPage.render();
        afterRenderFn = () => CoachPage.afterRender();
        break;
      default:
        html = NotFoundPage.render();
    }

    pageEl.innerHTML = html;

    if (afterRenderFn) {
      setTimeout(afterRenderFn, 50);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
