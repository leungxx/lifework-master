// ============================================================
// 综合报告页
// ============================================================

const ReportPage = {
  render() {
    const profile = Storage.loadProfile();

    if (!profile || !profile.scores) {
      return `
        <div class="container">
          <div class="empty-state">
            <div class="empty-state-icon"><i class="fas fa-file-alt"></i></div>
            <div class="empty-state-title">暂无评估报告</div>
            <div class="empty-state-desc">请先完成综合评估问卷，系统将为您生成详细的分析报告和个性化改善方案</div>
            <a href="#/questionnaire" class="btn btn-primary btn-lg">
              <i class="fas fa-clipboard-list"></i> 开始评估
            </a>
          </div>
        </div>
      `;
    }

    return this._renderReport(profile);
  },

  _renderReport(profile) {
    const scores = profile.scores;
    const coordinator = profile.coordinator;
    const dims = Object.values(scores.dimensions);
    const overall = scores.overall;

    return `
      <div class="container">
        <!-- 报告头部 -->
        <div class="report-header">
          <div class="score-display">
            <div class="score-number">${Format.score(overall.percentage)}</div>
            <div class="score-label">综合健康指数</div>
            <div class="score-grade ${overall.grade.color}">${overall.grade.label}</div>
          </div>
          <div class="text-sm text-muted mt-md">
            评估完成时间：${Format.dateTime(profile.updatedAt)} · 共回答 ${overall.answeredCount}/${overall.totalQuestions} 题
          </div>
        </div>

        <!-- 六维雷达图 -->
        <div class="report-section">
          <h3 class="report-section-title"><i class="fas fa-chart-pie"></i> 六维健康画像</h3>
          <div class="card">
            <div class="chart-container" style="max-width: 500px; margin: 0 auto;">
              <canvas id="report-radar-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- 各维度得分 -->
        <div class="report-section">
          <h3 class="report-section-title"><i class="fas fa-th-list"></i> 各维度详细评分</h3>
          <div class="report-dim-scores stagger-list">
            ${dims.map(d => this._renderDimScore(d)).join('')}
          </div>
        </div>

        <!-- 强弱项分析 -->
        ${coordinator ? `
        <div class="report-section">
          <h3 class="report-section-title"><i class="fas fa-balance-scale"></i> 强弱项对比</h3>
          <div class="grid grid-2">
            <div class="card">
              <h4 style="color: var(--color-success); margin-bottom: var(--space-md);">
                <i class="fas fa-star"></i> 您的优势
              </h4>
              ${(coordinator.strengths || []).map(s => `
                <div class="strength-item">
                  <div class="flex-1">
                    <div class="font-medium">${s.name}</div>
                    <div class="text-sm text-muted">得分 ${s.percentage} 分</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="card">
              <h4 style="color: var(--color-danger); margin-bottom: var(--space-md);">
                <i class="fas fa-exclamation-triangle"></i> 待改善领域
              </h4>
              ${(coordinator.weaknesses || []).map(w => `
                <div class="weakness-item">
                  <div class="flex-1">
                    <div class="font-medium">${w.name}</div>
                    <div class="text-sm text-muted">得分 ${w.percentage} 分</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <!-- 综合洞察 -->
        ${coordinator ? `
        <div class="report-section">
          <h3 class="report-section-title"><i class="fas fa-lightbulb"></i> 总协调师综合洞察</h3>
          <div class="card">
            <div class="flex items-center gap-md mb-lg">
              <div class="expert-avatar expert-avatar-lg" style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));">
                <i class="fas fa-gem"></i>
              </div>
              <div>
                <h4 style="font-size: var(--font-size-lg);">${EXPERTS.coordinator.name}</h4>
                <span class="text-sm text-muted">${EXPERTS.coordinator.title}</span>
              </div>
            </div>
            <div class="coordinator-insight">
              ${(coordinator.insights || []).map(insight => `<p style="margin-bottom: var(--space-md);">${insight}</p>`).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <!-- 跨维度关联 -->
        ${coordinator && coordinator.crossLinks && coordinator.crossLinks.length > 0 ? `
        <div class="report-section">
          <h3 class="report-section-title"><i class="fas fa-link"></i> 跨维度关联分析</h3>
          <div class="grid grid-2">
            ${coordinator.crossLinks.map(link => `
              <div class="card">
                <span class="badge ${link.type === 'chain' ? 'badge-warning' : 'badge-info'}">${link.type === 'chain' ? '关联链' : '改善机会'}</span>
                <h4 style="margin: var(--space-sm) 0;">${link.name}</h4>
                <p class="text-sm text-muted">${link.description}</p>
                <p class="text-sm mt-sm" style="color: var(--color-primary);"><i class="fas fa-lightbulb"></i> ${link.suggestion}</p>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- 90天改善方案 -->
        ${coordinator && coordinator.plan ? `
        <div class="report-section">
          <h3 class="report-section-title"><i class="fas fa-calendar-alt"></i> 90天改善方案</h3>
          <div class="card">
            <div class="plan-timeline">
              ${coordinator.plan.map(phase => `
                <div class="plan-item">
                  <div class="plan-period">${phase.period}</div>
                  <div class="plan-title">${phase.title}</div>
                  <ul class="expert-suggestions">
                    ${(phase.items || []).map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        ` : ''}

        <!-- 专家评语精选 -->
        ${profile.analyses ? `
        <div class="report-section">
          <h3 class="report-section-title"><i class="fas fa-quote-right"></i> 专家评语精选</h3>
          <div class="expert-quotes stagger-list">
            ${this._renderExpertQuotes(profile.analyses)}
          </div>
        </div>
        ` : ''}

        <!-- 底部操作 -->
        <div class="report-section text-center">
          <a href="#/experts" class="btn btn-primary btn-lg">
            <i class="fas fa-user-md"></i> 查看专家详细分析
          </a>
          <a href="#/questionnaire" class="btn btn-secondary btn-lg" style="margin-left: var(--space-sm);">
            <i class="fas fa-redo"></i> 重新评估
          </a>
          <button class="btn btn-outline btn-lg" style="margin-left: var(--space-sm);" onclick="window.print()">
            <i class="fas fa-print"></i> 打印报告
          </button>
        </div>
      </div>
    `;
  },

  _renderDimScore(dim) {
    const color = dim.color;
    const grade = dim.grade;

    return `
      <div class="dim-score-card">
        <div style="color: ${color}; font-size: 28px;">
          <i class="fas ${dim.icon}"></i>
        </div>
        <h4 style="margin-top: var(--space-sm);">${dim.name}</h4>
        <div class="dim-score-value" style="color: ${color};">${dim.percentage}</div>
        <span class="badge ${grade.color}">${grade.label}</span>
        <div class="dim-score-bar">
          <div class="dim-score-fill" style="width: ${dim.percentage}%; background: ${color};"></div>
        </div>
        <div class="text-sm text-muted mt-sm">${dim.questionCount}题评估</div>
      </div>
    `;
  },

  _renderExpertQuotes(analyses) {
    const quotes = [];

    for (const [dimId, dimAnalyses] of Object.entries(analyses)) {
      for (const [expertId, analysis] of Object.entries(dimAnalyses)) {
        if (analysis.comment && analysis.comment.length > 10) {
          quotes.push({
            expert: analysis.expert,
            comment: analysis.comment,
            score: analysis.score,
            dimColor: DIMENSIONS[dimId]?.color || '#6366F1'
          });
        }
      }
    }

    // 每个维度选第一位专家的评语
    const selected = [];
    const dimSeen = new Set();
    for (const q of quotes) {
      const dimId = Object.keys(EXPERTS).find(k => EXPERTS[k].id === q.expert.id);
      const dim = Object.entries(EXPERTS).find(([_, e]) => e.id === q.expert.id);
      if (dim && !dimSeen.has(dim[1].dimension)) {
        dimSeen.add(dim[1].dimension);
        selected.push(q);
      }
    }

    return selected.map(q => `
      <div class="expert-quote-card">
        <div class="quote-icon"><i class="fas fa-quote-right"></i></div>
        <div class="quote-text">"${q.comment}"</div>
        <div class="quote-author">
          <div class="expert-avatar expert-avatar-sm" style="background: ${q.dimColor};">
            <i class="fas ${q.expert.icon || 'fa-user-md'}"></i>
          </div>
          <div>
            <div class="font-semibold text-sm">${q.expert.name}</div>
            <div class="text-xs text-muted">${q.expert.title}</div>
          </div>
        </div>
      </div>
    `).join('');
  },

  afterRender() {
    const profile = Storage.loadProfile();
    if (!profile || !profile.scores) return;

    const dims = Object.values(profile.scores.dimensions);

    setTimeout(() => {
      Charts.createRadarChart('report-radar-chart', {
        label: '您的健康画像',
        values: dims.map(d => d.percentage)
      });
    }, 200);
  }
};
