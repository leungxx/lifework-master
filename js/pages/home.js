// ============================================================
// 首页仪表盘
// ============================================================

const HomePage = {
  render() {
    const profile = Storage.loadProfile();

    if (!profile || !profile.scores) {
      return this._renderEmpty();
    }

    return this._renderDashboard(profile);
  },

  _renderEmpty() {
    return `
      <div class="container">
        <div class="home-hero text-center">
          <h1>欢迎来到 ${CONFIG.APP_NAME}</h1>
          <p>您的个人生活与工作综合管理系统</p>
          <p style="opacity: 0.8; font-size: var(--font-size-base);">
            18位专家 + 1位总协调师，从心理健康、生活健康、身体健康、<br>
            美丽管理、工作效率、目标管理六大维度，为您提供专业分析与建议
          </p>
          <a href="#/questionnaire" class="btn btn-lg" style="background: white; color: var(--color-primary); margin-top: var(--space-md);">
            <i class="fas fa-clipboard-list"></i> 开始综合评估
          </a>
        </div>

        <div class="quick-actions mt-xl">
          <div class="quick-action-card" onclick="window.location.hash='#/questionnaire'">
            <i class="fas fa-clipboard-check"></i>
            <h4>综合评估问卷</h4>
            <p>44题，约15分钟，全面了解您的生活与工作状态</p>
          </div>
          <div class="quick-action-card" onclick="window.location.hash='#/experts'">
            <i class="fas fa-user-md"></i>
            <h4>认识专家团队</h4>
            <p>了解18位专家和总协调师的专业背景</p>
          </div>
          <div class="quick-action-card" onclick="window.location.hash='#/report'">
            <i class="fas fa-chart-bar"></i>
            <h4>查看报告</h4>
            <p>完成评估后可查看详细分析和改善方案</p>
          </div>
        </div>
      </div>
    `;
  },

  _renderDashboard(profile) {
    const scores = profile.scores;
    const dims = Object.values(scores.dimensions);
    const overall = scores.overall;
    const coordinator = profile.coordinator;

    // 维度卡片
    const dimCardsHtml = dims.map(d => DimensionCard.render({
      id: d.id,
      name: d.name,
      icon: d.icon,
      color: d.color
    }, d.percentage)).join('');

    // 强弱项
    const sw = coordinator?.strengths || [];
    const wk = coordinator?.weaknesses || [];

    // 最近评估时间
    const lastAssess = profile.updatedAt ? Format.relativeTime(profile.updatedAt) : '--';

    return `
      <div class="container">
        <!-- 欢迎横幅 -->
        <div class="home-hero">
          <h1><i class="fas fa-gem"></i> ${CONFIG.APP_NAME}</h1>
          <p>您的综合健康画像</p>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-value" style="color: ${this._getScoreColor(overall.percentage)}">${Format.score(overall.percentage)}</div>
              <div class="hero-stat-label">综合健康指数</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">${Format.gradeBadge(overall.percentage)}</div>
              <div class="hero-stat-label">综合等级</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">${dims.length}</div>
              <div class="hero-stat-label">评估维度</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value" style="font-size: var(--font-size-base);">${lastAssess}</div>
              <div class="hero-stat-label">上次评估</div>
            </div>
          </div>
          <div style="margin-top: var(--space-lg);">
            <a href="#/questionnaire" class="btn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3);">
              <i class="fas fa-redo"></i> 重新评估
            </a>
            <a href="#/report" class="btn" style="background: white; color: var(--color-primary); margin-left: var(--space-sm);">
              <i class="fas fa-file-alt"></i> 查看完整报告
            </a>
          </div>
        </div>

        <!-- 六维雷达图 -->
        <div class="page-section">
          <div class="section-header">
            <div>
              <h3 class="section-title"><i class="fas fa-chart-pie" style="color: var(--color-primary);"></i> 六维健康画像</h3>
              <p class="section-subtitle">雷达图展示各维度综合得分</p>
            </div>
          </div>
          <div class="card">
            <div class="chart-container" style="max-width: 500px; margin: 0 auto;">
              <canvas id="home-radar-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- 维度卡片网格 -->
        <div class="page-section">
          <div class="section-header">
            <h3 class="section-title"><i class="fas fa-th-large" style="color: var(--color-primary);"></i> 各维度详情</h3>
            <a href="#/experts" class="btn btn-sm btn-outline">查看专家分析 <i class="fas fa-arrow-right"></i></a>
          </div>
          <div class="dim-cards-grid stagger-list">
            ${dimCardsHtml}
          </div>
        </div>

        <!-- 强弱项分析 -->
        ${sw.length && wk.length ? `
        <div class="page-section">
          <div class="section-header">
            <h3 class="section-title"><i class="fas fa-balance-scale" style="color: var(--color-primary);"></i> 强弱项分析</h3>
          </div>
          <div class="grid grid-2">
            <div class="card">
              <h4 style="color: var(--color-success); margin-bottom: var(--space-md);">
                <i class="fas fa-star"></i> 优势维度
              </h4>
              ${sw.map(s => `
                <div class="strength-item">
                  <span class="badge badge-success">${s.percentage}分</span>
                  <span class="font-medium">${s.name}</span>
                </div>
              `).join('')}
            </div>
            <div class="card">
              <h4 style="color: var(--color-danger); margin-bottom: var(--space-md);">
                <i class="fas fa-exclamation-triangle"></i> 待改善维度
              </h4>
              ${wk.map(w => `
                <div class="weakness-item">
                  <span class="badge badge-danger">${w.percentage}分</span>
                  <span class="font-medium">${w.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <!-- 历史趋势 -->
        <div class="page-section">
          <div class="section-header">
            <h3 class="section-title"><i class="fas fa-chart-line" style="color: var(--color-primary);"></i> 评估历史</h3>
          </div>
          <div class="card" id="history-section">
            ${this._renderHistory()}
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="page-section">
          <div class="section-header">
            <h3 class="section-title"><i class="fas fa-bolt" style="color: var(--color-primary);"></i> 快速操作</h3>
          </div>
          <div class="quick-actions">
            <div class="quick-action-card" onclick="window.location.hash='#/action'">
              <i class="fas fa-bolt"></i>
              <h4>行动中心</h4>
              <p>${this._getTaskStatus()}</p>
            </div>
            <div class="quick-action-card" onclick="window.location.hash='#/checkin'">
              <i class="fas fa-calendar-check"></i>
              <h4>每日打卡</h4>
              <p>${this._getCheckinStatus()}</p>
            </div>
            <div class="quick-action-card" onclick="window.location.hash='#/questionnaire'">
              <i class="fas fa-redo"></i>
              <h4>重新评估</h4>
              <p>更新您的综合健康画像</p>
            </div>
            <div class="quick-action-card" onclick="window.location.hash='#/experts'">
              <i class="fas fa-user-md"></i>
              <h4>专家面板</h4>
              <p>查看18位专家的详细分析</p>
            </div>
            <div class="quick-action-card" onclick="window.location.hash='#/report'">
              <i class="fas fa-file-pdf"></i>
              <h4>完整报告</h4>
              <p>查看综合分析和改善方案</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderHistory() {
    const history = Storage.loadAssessmentHistory();

    if (!history || history.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fas fa-history"></i></div>
          <div class="empty-state-title">暂无历史记录</div>
          <div class="empty-state-desc">完成首次评估后，这里将展示您的健康趋势变化</div>
        </div>
      `;
    }

    // 显示最近几次评估
    const recent = history.slice(-5);
    let html = '<div class="chart-container"><canvas id="history-chart"></canvas></div>';
    html += '<div style="margin-top: var(--space-lg);">';
    recent.reverse().forEach((h, i) => {
      const grade = Format.getGrade(h.overallPercentage);
      html += `
        <div class="flex items-center justify-between p-md" style="border-bottom: 1px solid var(--color-border-light);">
          <span class="text-sm">${Format.date(h.createdAt)}</span>
          <span class="font-bold" style="color: var(--color-primary);">${Format.score(h.overallPercentage)}分</span>
          <span class="badge ${grade.color}">${grade.label}</span>
        </div>
      `;
    });
    html += '</div>';

    return html;
  },

  _getScoreColor(score) {
    if (score >= 85) return 'var(--color-success)';
    if (score >= 70) return 'var(--color-info)';
    if (score >= 55) return 'var(--color-warning)';
    return 'var(--color-danger)';
  },

  _getCheckinStatus() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const data = Storage.loadCheckin(dateStr);
    const total = CHECKIN_METRICS.length;
    const completed = CHECKIN_METRICS.filter(m => data[m.id] !== undefined && data[m.id] !== null).length;

    if (completed === 0) return '今天还没打卡，快来记录吧！';
    if (completed < total) return `已完成 ${completed}/${total} 项打卡`;
    return `✅ 今日已全部完成打卡！`;
  },

  _getTaskStatus() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const tasks = Storage.loadDailyTasks(dateStr);

    if (tasks.length === 0) return '设定今日3件事，开始行动！';
    const done = tasks.filter(t => t.done).length;
    if (done === tasks.length) return `✅ ${done}/${tasks.length} 全部完成！`;
    return `⏳ 已完成 ${done}/${tasks.length} 项`;
  },

  afterRender() {
    const profile = Storage.loadProfile();
    if (!profile || !profile.scores) return;

    const dims = Object.values(profile.scores.dimensions);

    // 雷达图
    setTimeout(() => {
      Charts.createRadarChart('home-radar-chart', {
        label: '您的健康画像',
        values: dims.map(d => d.percentage)
      });
    }, 200);

    // 历史趋势图
    const history = Storage.loadAssessmentHistory();
    if (history && history.length > 0) {
      setTimeout(() => {
        this._renderHistoryChart(history);
      }, 300);
    }
  },

  _renderHistoryChart(history) {
    const canvas = document.getElementById('history-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const recent = history.slice(-5);

    const datasets = [
      { label: '心理健康', data: [], borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.1)', tension: 0.4 },
      { label: '生活健康', data: [], borderColor: '#EC4899', backgroundColor: 'rgba(236, 72, 153, 0.1)', tension: 0.4 },
      { label: '身体健康', data: [], borderColor: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)', tension: 0.4 },
      { label: '美丽管理', data: [], borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)', tension: 0.4 },
      { label: '工作效率', data: [], borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)', tension: 0.4 },
      { label: '目标管理', data: [], borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', tension: 0.4 }
    ];

    recent.forEach(h => {
      if (h.scores) {
        Object.entries(h.scores).forEach(([dimId, dimScore], idx) => {
          if (datasets[idx]) {
            datasets[idx].data.push(dimScore.percentage);
          }
        });
      }
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: recent.map(h => Format.date(h.createdAt)),
        datasets: datasets.filter(d => d.data.length > 0)
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '分' } }
        },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true } }
        }
      }
    });
  }
};
