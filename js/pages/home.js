// ============================================================
// 首页仪表盘（精简版）
// ============================================================

const HomePage = {
  _today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  render() {
    const today = this._today();
    const tasks = Storage.loadDailyTasks(today);
    const doneCount = tasks.filter(t => t.done).length;
    const streak = Storage.getStreak();
    const checkinData = Storage.loadCheckin(today);
    const checkinDone = CHECKIN_METRICS.filter(m => checkinData[m.id] != null).length;

    return `
      <div class="container">
        <div class="home-hero">
          <h1><i class="fas fa-gem"></i> ${CONFIG.APP_NAME}</h1>
          <p>你的个人生活与工作管理中枢</p>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-value">${doneCount}/${tasks.length || 0}</div>
              <div class="hero-stat-label">今日任务</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">🔥 ${streak}</div>
              <div class="hero-stat-label">连续天数</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">${checkinDone}/${CHECKIN_METRICS.length}</div>
              <div class="hero-stat-label">今日打卡</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">${this._getCoachStatus(today)}</div>
              <div class="hero-stat-label">效能复盘</div>
            </div>
          </div>
        </div>

        <!-- 今日一览 -->
        <div class="page-section">
          <div class="section-header">
            <h3 class="section-title"><i class="fas fa-sun" style="color: var(--color-warning);"></i> 今日一览</h3>
            <span class="text-sm text-muted">${today}</span>
          </div>
          <div class="grid grid-2">
            <div class="card" onclick="window.location.hash='#/action'" style="cursor: pointer;">
              <h4><i class="fas fa-bolt" style="color: var(--color-productivity);"></i> 行动中心</h4>
              <p class="text-sm text-muted">${this._getTaskSummary(tasks)}</p>
            </div>
            <div class="card" onclick="window.location.hash='#/checkin'" style="cursor: pointer;">
              <h4><i class="fas fa-calendar-check" style="color: var(--color-life);"></i> 每日打卡</h4>
              <p class="text-sm text-muted">${this._getCheckinSummary(checkinDone)}</p>
            </div>
            <div class="card" onclick="window.location.hash='#/coach'" style="cursor: pointer;">
              <h4><i class="fas fa-user-tie" style="color: var(--color-primary);"></i> 效能教练</h4>
              <p class="text-sm text-muted">${this._getCoachSummary(today)}</p>
            </div>
            <div class="card" onclick="window.location.hash='#/reminders'" style="cursor: pointer;">
              <h4><i class="fas fa-bell" style="color: var(--color-warning);"></i> 提醒中心</h4>
              <p class="text-sm text-muted">${this._getReminderSummary()}</p>
            </div>
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
            <div class="quick-action-card" onclick="window.location.hash='#/coach'">
              <i class="fas fa-user-tie"></i>
              <h4>效能教练</h4>
              <p>每日工作复盘与带教</p>
            </div>
            <div class="quick-action-card" onclick="window.location.hash='#/reminders'">
              <i class="fas fa-bell"></i>
              <h4>提醒中心</h4>
              <p>周期性事项自动提醒</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _getTaskSummary(tasks) {
    if (tasks.length === 0) return '今天还没设定任务';
    const done = tasks.filter(t => t.done).length;
    return `${done}/${tasks.length} 已完成`;
  },

  _getCheckinSummary(done) {
    if (done === 0) return '今天还没打卡';
    return `已打卡 ${done} 项`;
  },

  _getCoachSummary(today) {
    const data = Storage.loadCoachData();
    if (data[today]) return '✅ 今日已复盘';
    return '等待今日复盘';
  },

  _getCoachStatus(today) {
    const data = Storage.loadCoachData();
    return data[today] ? '✅' : '待';
  },

  _getReminderSummary() {
    const reminders = Storage.loadReminders();
    const today = this._today();
    const upcoming = reminders.filter(r => {
      const diff = Math.ceil((new Date(r.nextDate) - new Date(today)) / 86400000);
      return diff >= 0 && diff <= 7;
    });
    return `${reminders.length} 条提醒，${upcoming.length} 条近期`;
  },

  _getTaskStatus() {
    const today = this._today();
    const tasks = Storage.loadDailyTasks(today);
    if (tasks.length === 0) return '设定今日3件事，开始行动！';
    const done = tasks.filter(t => t.done).length;
    if (done === tasks.length) return `✅ ${done}/${tasks.length} 全部完成！`;
    return `⏳ 已完成 ${done}/${tasks.length} 项`;
  },

  _getCheckinStatus() {
    const today = this._today();
    const data = Storage.loadCheckin(today);
    const completed = CHECKIN_METRICS.filter(m => data[m.id] != null).length;
    if (completed === 0) return '今天还没打卡，快来记录吧！';
    if (completed < CHECKIN_METRICS.length) return `已完成 ${completed}/${CHECKIN_METRICS.length} 项打卡`;
    return `✅ 今日已全部完成打卡！`;
  },

  afterRender() {
    // 无需特殊处理
  }
};
