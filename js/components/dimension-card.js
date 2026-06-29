// ============================================================
// 维度卡片组件
// ============================================================

const DimensionCard = {
  render(dim, score) {
    const grade = Format.getGrade(score);
    const color = dim.color;

    return `
      <div class="card dimension-card" style="--dim-color: ${color}" data-dim="${dim.id}">
        <div class="card-header">
          <div class="dim-icon" style="background: ${color}">
            <i class="fas ${dim.icon}"></i>
          </div>
          <div class="dim-info">
            <h4>${dim.name}</h4>
            <span>${grade.label}</span>
          </div>
        </div>
        <div class="flex items-center justify-between mb-sm">
          <span class="text-sm text-muted">综合评分</span>
          <span class="font-bold" style="color: ${color}; font-size: var(--font-size-xl)">${Format.score(score)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="--progress-color: ${color}; --progress-color-light: ${color}; width: ${score}%"></div>
        </div>
      </div>
    `;
  }
};
