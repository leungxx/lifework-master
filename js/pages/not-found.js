// ============================================================
// 404 页面
// ============================================================

const NotFoundPage = {
  render() {
    return `
      <div class="container">
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fas fa-map-signs"></i></div>
          <div class="empty-state-title">页面未找到</div>
          <div class="empty-state-desc">您访问的页面不存在，请检查地址是否正确</div>
          <a href="#/" class="btn btn-primary btn-lg">
            <i class="fas fa-home"></i> 返回首页
          </a>
        </div>
      </div>
    `;
  }
};
