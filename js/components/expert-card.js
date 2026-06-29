// ============================================================
// 专家卡片组件
// ============================================================

const ExpertCard = {
  render(expert, dimColor) {
    return `
      <div class="expert-card hover-lift">
        <div class="expert-card-header">
          <div class="expert-avatar" style="background: ${dimColor || 'var(--color-primary)'}">
            <i class="fas ${expert.icon || 'fa-user-md'}"></i>
          </div>
          <div>
            <div class="expert-name">${expert.name}</div>
            <div class="expert-title">${expert.title}</div>
          </div>
        </div>
        <div class="expert-card-body">
          ${expert.comment ? `<div class="expert-comment">"${expert.comment}"</div>` : ''}
          ${expert.suggestions && expert.suggestions.length ? `
            <ul class="expert-suggestions">
              ${expert.suggestions.map(s => `<li>${s}</li>`).join('')}
            </ul>
          ` : ''}
          ${expert.duties ? `
            <div class="text-sm text-muted mt-md">
              <strong>核心职责：</strong>${expert.duties}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
};
