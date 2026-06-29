// ============================================================
// 专家面板页
// ============================================================

const ExpertsPage = {
  activeTab: null,

  render() {
    const profile = Storage.loadProfile();

    if (!profile || !profile.scores) {
      return `
        <div class="container">
          <div class="empty-state">
            <div class="empty-state-icon"><i class="fas fa-user-md"></i></div>
            <div class="empty-state-title">专家分析不可用</div>
            <div class="empty-state-desc">请先完成综合评估问卷，专家团队将根据您的评估结果提供个性化分析</div>
            <a href="#/questionnaire" class="btn btn-primary btn-lg">
              <i class="fas fa-clipboard-list"></i> 开始评估
            </a>
          </div>
        </div>
      `;
    }

    if (!this.activeTab) {
      this.activeTab = 'mental';
    }

    return this._renderExperts(profile);
  },

  _renderExperts(profile) {
    const scores = profile.scores;
    const analyses = profile.analyses;
    const coordinator = profile.coordinator;

    return `
      <div class="container">
        <!-- 头部 -->
        <div class="experts-header">
          <h2><i class="fas fa-user-md" style="color: var(--color-primary);"></i> 专家团队分析面板</h2>
          <p class="text-muted">${Object.keys(EXPERTS).length - 1}位专家 + 1位总协调师，为您提供专业分析</p>
        </div>

        <!-- 总协调师卡片 -->
        <div class="coordinator-card">
          <div class="flex items-center gap-lg">
            <div class="expert-avatar expert-avatar-lg" style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));">
              <i class="fas fa-gem"></i>
            </div>
            <div class="flex-1">
              <div class="coordinator-title">总协调师</div>
              <div class="coordinator-name">${EXPERTS.coordinator.name}</div>
              <p class="text-sm text-muted">${EXPERTS.coordinator.role}</p>
            </div>
            <div class="text-right">
              <div style="font-size: var(--font-size-2xl); font-weight: 800; color: var(--color-primary);">
                ${Format.score(scores.overall.percentage)}
              </div>
              <span class="badge ${scores.overall.grade.color}">${scores.overall.grade.label}</span>
            </div>
          </div>
          ${coordinator ? `
            <div class="coordinator-insight mt-lg">
              ${(coordinator.insights || []).map(i => `<p style="margin-bottom: var(--space-sm);">${i}</p>`).join('')}
            </div>
          ` : ''}
        </div>

        <!-- 维度标签 -->
        <div class="tabs" id="dimension-tabs" style="margin-bottom: var(--space-xl);">
          ${CONFIG.DIMENSIONS.map(dim => {
            const dimScore = scores.dimensions[dim.id];
            const isActive = this.activeTab === dim.id;
            return `
              <button class="tab ${isActive ? 'active' : ''}" data-dim="${dim.id}"
                style="${isActive ? `color: ${dim.color}; border-bottom-color: ${dim.color};` : ''}">
                <i class="fas ${dim.icon} tab-icon" style="color: ${dim.color};"></i>
                ${dim.name}
                ${dimScore ? `<span style="margin-left: 6px; font-size: 11px; opacity: 0.8;">${dimScore.percentage}分</span>` : ''}
              </button>
            `;
          }).join('')}
        </div>

        <!-- 专家卡片区域 -->
        <div id="experts-content">
          ${this._renderDimensionExperts(this.activeTab, profile)}
        </div>
      </div>
    `;
  },

  _renderDimensionExperts(dimId, profile) {
    const dim = DIMENSIONS[dimId];
    if (!dim) return '';

    const dimScore = profile.scores.dimensions[dimId];
    const dimAnalyses = profile.analyses?.[dimId];
    const expertIds = dim.experts;

    return `
      <!-- 维度概述 -->
      <div class="dimension-analysis" style="border-left: 4px solid ${dim.color};">
        <h3>
          <span style="color: ${dim.color};"><i class="fas ${dim.icon}"></i></span>
          ${dim.name} - 维度分析
        </h3>
        <p class="text-sm text-muted mb-lg">${dim.description}</p>
        ${dimScore ? `
          <div class="grid grid-2 mb-lg">
            <div style="text-align: center;">
              <div style="font-size: var(--font-size-4xl); font-weight: 800; color: ${dim.color};">${dimScore.percentage}</div>
              <div class="text-sm text-muted">综合评分</div>
              <span class="badge ${dimScore.grade.color}">${dimScore.grade.label}</span>
            </div>
            <div>
              <div class="chart-container">
                <canvas id="dim-doughnut-${dimId}"></canvas>
              </div>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- 专家卡片 -->
      <div class="experts-grid stagger-list">
        ${expertIds.map(expertId => {
          const expert = EXPERTS[expertId];
          const analysis = dimAnalyses?.[expertId];
          if (!expert) return '';

          return `
            <div class="expert-card hover-lift">
              <div class="expert-card-header">
                <div class="expert-avatar" style="background: ${dim.color};">
                  <i class="fas ${expert.icon}"></i>
                </div>
                <div>
                  <div class="expert-name">${expert.name}</div>
                  <div class="expert-title">${expert.title}</div>
                </div>
              </div>
              <div class="expert-card-body">
                ${analysis?.comment ? `
                  <div class="expert-comment" style="border-left-color: ${dim.color};">"${analysis.comment}"</div>
                ` : `
                  <div class="expert-comment" style="border-left-color: ${dim.color};">等待评估数据...</div>
                `}
                <div class="text-sm text-muted mb-md">
                  <strong>核心职责：</strong>${expert.duties}
                </div>
                ${analysis?.suggestions?.length ? `
                  <h5 style="margin-bottom: var(--space-sm); color: ${dim.color};">
                    <i class="fas fa-lightbulb"></i> 专业建议
                  </h5>
                  <ul class="expert-suggestions">
                    ${analysis.suggestions.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                ` : ''}
                <div class="text-xs text-muted mt-md" style="border-top: 1px solid var(--color-border-light); padding-top: var(--space-sm);">
                  <strong>分析方法：</strong>${expert.methods}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  afterRender() {
    // 绑定维度Tab切换
    const tabs = document.getElementById('dimension-tabs');
    if (tabs) {
      tabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.tab');
        if (!tab) return;

        this.activeTab = tab.dataset.dim;
        App.router.navigate('#/experts');
      });
    }

    // 渲染维度环形图
    const profile = Storage.loadProfile();
    if (!profile?.scores) return;

    const dimId = this.activeTab;
    const dimScore = profile.scores.dimensions[dimId];
    if (!dimScore?.subScores) return;

    setTimeout(() => {
      const canvas = document.getElementById(`dim-doughnut-${dimId}`);
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const subScores = dimScore.subScores;
      const labels = Object.values(subScores).map(s => {
        // 找到对应的metric名
        const dim = DIMENSIONS[dimId];
        const metric = dim?.subMetrics?.find(m => m.key === Object.keys(subScores).find(k => subScores[k] === s));
        return metric?.name || '';
      }).filter(Boolean);
      const values = Object.values(subScores).map(s => s.percentage);

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: [
              dimScore.color + 'DD',
              dimScore.color + 'AA',
              dimScore.color + '77',
              dimScore.color + '44'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 12,
                usePointStyle: true,
                font: { size: 11 }
              }
            }
          }
        }
      });
    }, 300);
  }
};
