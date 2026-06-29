// ============================================================
// 每日打卡页面
// ============================================================

const CheckinPage = {
  selectedDate: null,

  init() {
    if (!this.selectedDate) {
      this.selectedDate = this._today();
    }
  },

  _today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  _formatDisplay(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const wd = weekDays[d.getDay()];
    return `${m}月${day}日 ${wd}`;
  },

  _changeDate(delta) {
    const d = new Date(this.selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    this.selectedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this._rerender();
  },

  _rerender() {
    const pageEl = document.getElementById('page-checkin');
    if (!pageEl) return;
    pageEl.innerHTML = this.render();
    this.afterRender();
  },

  render() {
    this.init();
    const todayData = Storage.loadCheckin(this.selectedDate) || {};
    const isToday = this.selectedDate === this._today();
    const completedCount = CHECKIN_METRICS.filter(m => {
      const v = todayData[m.id];
      return v !== undefined && v !== null && v !== '';
    }).length;
    const totalCount = CHECKIN_METRICS.length;
    const progressPercent = Math.round((completedCount / totalCount) * 100);

    // 获取本周数据用于趋势图
    const weekData = Storage.getWeekCheckins(this.selectedDate);

    return `
      <div class="container">
        <div class="checkin-page">
          <!-- 头部 -->
          <div class="checkin-header">
            <h2><i class="fas fa-calendar-check" style="color: var(--color-primary);"></i> 每日打卡</h2>
            <p class="text-muted">记录每日健康数据，追踪你的进步</p>
          </div>

          <!-- 日期选择器 -->
          <div class="date-picker">
            <button class="btn btn-sm btn-secondary" onclick="CheckinPage._changeDate(-1)">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="date-display">
              <span class="date-text">${this._formatDisplay(this.selectedDate)}</span>
              ${isToday ? '<span class="badge badge-info">今天</span>' : ''}
            </div>
            <button class="btn btn-sm btn-secondary" onclick="CheckinPage._changeDate(1)" ${isToday ? 'disabled' : ''}>
              <i class="fas fa-chevron-right"></i>
            </button>
            <button class="btn btn-sm btn-outline" onclick="CheckinPage.selectedDate=CheckinPage._today();CheckinPage._rerender();" style="margin-left: 8px;">
              <i class="fas fa-calendar-day"></i> 回到今天
            </button>
          </div>

          <!-- 完成度进度 -->
          <div class="checkin-progress">
            <div class="progress-info">
              <span>今日完成度</span>
              <span class="font-semibold">${completedCount}/${totalCount} 项</span>
            </div>
            <div class="progress-bar progress-bar-lg">
              <div class="progress-bar-fill" style="width: ${progressPercent}%; background: ${progressPercent >= 80 ? 'var(--color-success)' : progressPercent >= 50 ? 'var(--color-primary)' : 'var(--color-warning)'};"></div>
            </div>
          </div>

          <!-- 打卡卡片列表 -->
          <div class="checkin-grid" id="checkin-grid">
            ${CHECKIN_METRICS.map(m => CheckinCard.render(m, todayData[m.id])).join('')}
          </div>

          <!-- 本周趋势 -->
          <div class="page-section mt-xl">
            <div class="section-header">
              <h3 class="section-title"><i class="fas fa-chart-line" style="color: var(--color-primary);"></i> 本周趋势</h3>
            </div>
            <div class="card">
              <div class="chart-container">
                <canvas id="checkin-trend-chart"></canvas>
              </div>
            </div>
          </div>

          <!-- 本周统计 -->
          <div class="page-section">
            <div class="section-header">
              <h3 class="section-title"><i class="fas fa-clipboard-list" style="color: var(--color-primary);"></i> 本周统计</h3>
            </div>
            <div class="grid grid-2">
              ${this._renderWeekStats(weekData)}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _renderWeekStats(weekData) {
    const stats = [
      { label: '平均睡眠', icon: 'fa-moon', color: '#8B5CF6', key: 'sleep_hours', unit: '小时', type: 'avg' },
      { label: '运动天数', icon: 'fa-dumbbell', color: '#F59E0B', key: 'exercise_minutes', unit: '天', type: 'count' },
      { label: '平均情绪', icon: 'fa-face-smile', color: '#EC4899', key: 'mood_score', unit: '分', type: 'avg' },
      { label: '平均精力', icon: 'fa-bolt', color: '#10B981', key: 'energy', unit: '分', type: 'avg' }
    ];

    return stats.map(s => {
      let value = '--';
      if (s.type === 'avg') {
        const vals = weekData.filter(d => d[s.key] != null).map(d => Number(d[s.key]));
        if (vals.length > 0) {
          value = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
        }
      } else if (s.type === 'count') {
        value = weekData.filter(d => d[s.key] && Number(d[s.key]) > 0).length;
      }
      return `
        <div class="card text-center">
          <div style="color: ${s.color}; font-size: 24px; margin-bottom: 8px;">
            <i class="fas ${s.icon}"></i>
          </div>
          <div style="font-size: var(--font-size-2xl); font-weight: 700; color: ${s.color};">${value}</div>
          <div class="text-sm text-muted">${s.label} (${s.unit})</div>
        </div>
      `;
    }).join('');
  },

  afterRender() {
    const todayData = Storage.loadCheckin(this.selectedDate) || {};

    // 绑定所有打卡卡片的点击交互
    CHECKIN_METRICS.forEach(metric => {
      const currentValue = todayData[metric.id];

      // 星级评分
      if (metric.type === 'stars' && (currentValue === undefined || currentValue === null)) {
        const container = document.getElementById(`checkin-stars-${metric.id}`);
        if (container) {
          container.addEventListener('click', (e) => {
            const btn = e.target.closest('.star-btn');
            if (!btn) return;
            const value = parseInt(btn.dataset.value);
            Storage.saveCheckin(this.selectedDate, metric.id, value);
            this._rerender();
          });
          // 悬停预览
          container.addEventListener('mouseover', (e) => {
            const btn = e.target.closest('.star-btn');
            if (!btn) return;
            const val = parseInt(btn.dataset.value);
            container.querySelectorAll('.star-btn i').forEach((icon, idx) => {
              icon.className = idx < val ? 'fas fa-star' : 'far fa-star';
              icon.style.color = idx < val ? '#F59E0B' : '#CBD5E1';
            });
          });
          container.addEventListener('mouseleave', () => {
            container.querySelectorAll('.star-btn i').forEach(icon => {
              icon.className = 'far fa-star';
              icon.style.color = '#CBD5E1';
            });
          });
        }
      }

      // 情绪选择
      if (metric.type === 'mood' && (currentValue === undefined || currentValue === null)) {
        const container = document.getElementById(`checkin-mood-${metric.id}`);
        if (container) {
          container.addEventListener('click', (e) => {
            const btn = e.target.closest('.mood-btn');
            if (!btn) return;
            Storage.saveCheckin(this.selectedDate, metric.id, btn.dataset.value);
            this._rerender();
          });
        }
      }

      // 多选
      if (metric.type === 'multi') {
        const container = document.getElementById(`checkin-multi-${metric.id}`);
        if (container) {
          const selected = Array.isArray(currentValue) ? currentValue : [];
          // 初始化已选状态
          container.querySelectorAll('.multi-btn').forEach(btn => {
            btn.classList.toggle('active', selected.includes(btn.dataset.value));
          });

          container.addEventListener('click', (e) => {
            const btn = e.target.closest('.multi-btn');
            if (!btn) return;
            const val = btn.dataset.value;
            let current = Array.isArray(todayData[metric.id]) ? [...todayData[metric.id]] : [];

            if (val === 'none') {
              current = ['none'];
            } else {
              current = current.filter(v => v !== 'none');
              const idx = current.indexOf(val);
              if (idx >= 0) {
                current.splice(idx, 1);
              } else {
                current.push(val);
              }
            }
            Storage.saveCheckin(this.selectedDate, metric.id, current.length > 0 ? current : null);
            this._rerender();
          });
        }
      }

      // 量表（情绪分/精力）
      if (metric.type === 'scale' && (currentValue === undefined || currentValue === null)) {
        const container = document.getElementById(`checkin-scale-${metric.id}`);
        if (container) {
          container.addEventListener('click', (e) => {
            const btn = e.target.closest('.scale-btn');
            if (!btn) return;
            Storage.saveCheckin(this.selectedDate, metric.id, parseInt(btn.dataset.value));
            this._rerender();
          });
        }
      }

      // 选择器（睡眠时长/运动时长/饮水）
      if (metric.type === 'select' && (currentValue === undefined || currentValue === null)) {
        const container = document.getElementById(`checkin-select-${metric.id}`);
        if (container) {
          container.addEventListener('click', (e) => {
            const btn = e.target.closest('.select-btn');
            if (!btn) return;
            Storage.saveCheckin(this.selectedDate, metric.id, Number(btn.dataset.value));
            this._rerender();
          });
        }
      }
    });

    // 已完成项支持点击修改（点击已填值可清除重新选）
    CHECKIN_METRICS.forEach(metric => {
      const currentValue = todayData[metric.id];
      if (currentValue !== undefined && currentValue !== null) {
        const body = document.getElementById(`checkin-body-${metric.id}`);
        if (body) {
          body.style.cursor = 'pointer';
          body.title = '点击可重新记录';
          body.addEventListener('click', () => {
            Storage.saveCheckin(this.selectedDate, metric.id, null);
            this._rerender();
          });
        }
      }
    });

    // 趋势图
    setTimeout(() => this._renderTrendChart(), 300);
  },

  _renderTrendChart() {
    const canvas = document.getElementById('checkin-trend-chart');
    if (!canvas) return;

    const weekData = Storage.getWeekCheckins(this.selectedDate);
    if (weekData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const labels = weekData.map(d => {
      const date = new Date(d.date + 'T00:00:00');
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const trendMetrics = [
      { key: 'sleep_hours', label: '睡眠(h)', color: '#8B5CF6', yAxisID: 'y' },
      { key: 'exercise_minutes', label: '运动(分钟)', color: '#F59E0B', yAxisID: 'y1' },
      { key: 'mood_score', label: '情绪(分)', color: '#EC4899', yAxisID: 'y' },
      { key: 'energy', label: '精力(分)', color: '#10B981', yAxisID: 'y' }
    ];

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: trendMetrics.map(m => ({
          label: m.label,
          data: weekData.map(d => d[m.key] != null ? Number(d[m.key]) : null),
          borderColor: m.color,
          backgroundColor: m.color + '20',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          spanGaps: false,
          yAxisID: m.yAxisID
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            max: 10,
            ticks: { stepSize: 2 },
            grid: { color: 'rgba(0,0,0,0.04)' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false },
            ticks: { callback: v => v + 'min' }
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } }
        }
      }
    });
  }
};
