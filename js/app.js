// ============================================================
// 应用主入口
// ============================================================

const App = {
  router: null,

  init() {
    // 创建路由
    this.router = new Router(ROUTES);

    // 添加守卫
    this.router.addGuard((route, prevRoute) => {
      // 如果从问卷页离开且有未保存进度，提示
      if (prevRoute?.page === 'questionnaire' && route.page !== 'questionnaire') {
        const progress = Storage.loadQuestionnaireProgress();
        if (progress && Object.keys(progress.answers || {}).length > 0) {
          // 静默保存，不中断导航
        }
      }
      return true;
    });

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

    // 任务结转：如果上次打开不是今天，自动结转
    this._checkRollover();

    // 启动督促检查（每30分钟检查一次）
    this._startNudgeCheck();

    // 检查今日提醒
    this._checkReminders();
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

  _startNudgeCheck() {
    // 每30分钟检查一次是否需要督促
    setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      // 只在晚上8点到11点之间检查
      if (hour < 20 || hour > 23) return;

      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const tasks = Storage.loadDailyTasks(dateStr);

      if (tasks.length === 0) return; // 没有任务不提醒
      if (tasks.every(t => t.done)) return; // 全部完成不提醒

      const settings = Storage.loadSettings();
      const lastNudge = settings.lastNudgeDate;

      // 今天已经提醒过了就不重复
      if (lastNudge === dateStr) return;

      const allTasks = Storage.loadAllDailyTasks();
      // 检查连续未完成天数
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
        Toast.warning('⚠️ 我们需要谈谈。连续7天未完成，请花5分钟回顾一下。', 10000);
      } else if (streak >= 3) {
        Toast.warning('连续3天未完成目标。是什么在阻碍你？打开行动中心看看。', 8000);
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
      // 延迟显示，等页面加载完
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
        <div class="page" data-page="questionnaire" id="page-questionnaire"></div>
        <div class="page" data-page="report" id="page-report"></div>
        <div class="page" data-page="experts" id="page-experts"></div>
        <div class="page" data-page="checkin" id="page-checkin"></div>
        <div class="page" data-page="action" id="page-action"></div>
        <div class="page" data-page="reminders" id="page-reminders"></div>
      </div>
      ${BottomNav.render()}
    `;

    // 初始化移动端菜单
    Navbar.initMobileMenu();

    // 初始化默认页面
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
      case 'questionnaire':
        html = QuestionnairePage.render();
        afterRenderFn = () => QuestionnairePage.afterRender();
        break;
      case 'report':
        html = ReportPage.render();
        afterRenderFn = () => ReportPage.afterRender();
        break;
      case 'experts':
        html = ExpertsPage.render();
        afterRenderFn = () => ExpertsPage.afterRender();
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
      default:
        html = NotFoundPage.render();
    }

    pageEl.innerHTML = html;

    // 执行 afterRender
    if (afterRenderFn) {
      setTimeout(afterRenderFn, 50);
    }

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
