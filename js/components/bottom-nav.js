// ============================================================
// 底部导航栏 (移动端)
// ============================================================

const BottomNav = {
  render() {
    const navItems = Object.entries(CONFIG.ROUTES).map(([key, route]) => `
      <a href="${route.path}" class="bottom-nav-item" data-nav="${key}">
        <i class="fas ${route.icon}"></i>
        <span>${route.title}</span>
      </a>
    `).join('');

    return `
      <nav class="bottom-nav">
        <div class="bottom-nav-inner">
          ${navItems}
        </div>
      </nav>
    `;
  }
};
