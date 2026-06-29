// ============================================================
// Hash Router
// ============================================================

class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    this.guards = [];
    this._onChange = this._onChange.bind(this);
  }

  init() {
    window.addEventListener('hashchange', this._onChange);
    window.addEventListener('load', this._onChange);
  }

  addGuard(fn) {
    this.guards.push(fn);
  }

  navigate(path) {
    window.location.hash = path;
  }

  _onChange() {
    const hash = window.location.hash || '#/';
    const route = this._matchRoute(hash);

    if (!route) {
      this.navigate('#/');
      return;
    }

    // 运行守卫
    for (const guard of this.guards) {
      if (!guard(route, this.currentRoute)) {
        return;
      }
    }

    this.currentRoute = route;
    this._renderPage(route);
  }

  _matchRoute(hash) {
    const cleanHash = hash.split('?')[0];
    return this.routes[cleanHash] || null;
  }

  _renderPage(route) {
    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;

    // 隐藏所有页面
    const pages = appRoot.querySelectorAll('[data-page]');
    pages.forEach(p => p.classList.remove('active'));

    // 显示目标页面
    const targetPage = appRoot.querySelector(`[data-page="${route.page}"]`);
    if (targetPage) {
      targetPage.classList.add('active');
      targetPage.classList.add('page-enter');
      setTimeout(() => targetPage.classList.remove('page-enter'), 400);
    }

    // 触发页面变更事件
    window.dispatchEvent(new CustomEvent('route-changed', {
      detail: { route }
    }));

    // 更新导航高亮
    this._updateNavHighlight(route);
  }

  _updateNavHighlight(route) {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.classList.toggle('active', el.dataset.nav === route.page);
    });
  }

  destroy() {
    window.removeEventListener('hashchange', this._onChange);
    window.removeEventListener('load', this._onChange);
  }
}

// ============================================================
// 路由配置
// ============================================================
const ROUTES = {
  '#/': { page: 'home', title: '仪表盘' },
  '#/questionnaire': { page: 'questionnaire', title: '评估问卷' },
  '#/report': { page: 'report', title: '综合报告' },
  '#/experts': { page: 'experts', title: '专家面板' },
  '#/checkin': { page: 'checkin', title: '每日打卡' },
  '#/action': { page: 'action', title: '行动中心' },
  '#/reminders': { page: 'reminders', title: '提醒中心' }
};
