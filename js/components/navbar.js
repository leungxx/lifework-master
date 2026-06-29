// ============================================================
// 导航栏组件
// ============================================================

const Navbar = {
  render() {
    const navItems = Object.entries(CONFIG.ROUTES).map(([key, route]) => `
      <a href="${route.path}" class="nav-link" data-nav="${key}">
        <i class="fas ${route.icon}"></i>
        <span>${route.title}</span>
      </a>
    `).join('');

    return `
      <nav class="navbar">
        <div class="container">
          <a href="#/" class="navbar-brand">
            <i class="fas fa-gem"></i>
            <span>${CONFIG.APP_NAME}</span>
          </a>
          <div class="navbar-links" id="navbar-links">
            ${navItems}
          </div>
          <button class="navbar-toggle" id="navbar-toggle" aria-label="菜单">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </nav>
    `;
  },

  initMobileMenu() {
    const toggle = document.getElementById('navbar-toggle');
    const links = document.getElementById('navbar-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      const isOpen = links.style.display === 'flex';
      links.style.display = isOpen ? 'none' : 'flex';
      links.style.position = isOpen ? '' : 'absolute';
      links.style.top = isOpen ? '' : 'var(--navbar-height)';
      links.style.left = isOpen ? '' : '0';
      links.style.right = isOpen ? '' : '0';
      links.style.background = isOpen ? '' : 'rgba(255,255,255,0.98)';
      links.style.backdropFilter = isOpen ? '' : 'blur(12px)';
      links.style.flexDirection = isOpen ? '' : 'column';
      links.style.padding = isOpen ? '' : 'var(--space-md)';
      links.style.borderBottom = isOpen ? '' : '1px solid var(--color-border-light)';
      links.style.boxShadow = isOpen ? '' : 'var(--shadow-lg)';
      links.style.zIndex = isOpen ? '' : '99';
    });

    // 点击导航链接后关闭菜单
    links.addEventListener('click', (e) => {
      if (e.target.closest('.nav-link')) {
        if (window.innerWidth <= 768) {
          links.style.display = 'none';
        }
      }
    });
  }
};
