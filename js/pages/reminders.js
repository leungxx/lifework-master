// ============================================================
// 提醒中心页面
// ============================================================

const RemindersPage = {
  _today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  _addDays(dateStr, days) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  _diffDays(date1, date2) {
    const d1 = new Date(date1 + 'T00:00:00');
    const d2 = new Date(date2 + 'T00:00:00');
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  },

  _formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${d.getMonth() + 1}月${d.getDate()}日 ${weekDays[d.getDay()]}`;
  },

  rerender() {
    const el = document.getElementById('page-reminders');
    if (!el) return;
    el.innerHTML = this.render();
    this.afterRender();
  },

  render() {
    const today = this._today();
    const reminders = Storage.loadReminders();

    // 自动计算：检查是否需要更新 nextDate
    let hasUpdate = false;
    reminders.forEach(r => {
      if (r.intervalDays && r.nextDate) {
        // 如果 nextDate 已经过了，自动推进到未来
        while (this._diffDays(today, r.nextDate) < 0) {
          r.nextDate = this._addDays(r.nextDate, r.intervalDays);
          hasUpdate = true;
        }
      }
    });
    if (hasUpdate) Storage.saveReminders(reminders);

    // 按紧迫度排序：即将到来的排前面
    const sorted = [...reminders].sort((a, b) => {
      const diffA = this._diffDays(today, a.nextDate);
      const diffB = this._diffDays(today, b.nextDate);
      return diffA - diffB;
    });

    // 分组：今天/明天/本周/本月/以后
    const groups = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      thisMonth: [],
      later: []
    };

    sorted.forEach(r => {
      const diff = this._diffDays(today, r.nextDate);
      if (diff === 0) groups.today.push(r);
      else if (diff === 1) groups.tomorrow.push(r);
      else if (diff <= 7) groups.thisWeek.push(r);
      else if (diff <= 30) groups.thisMonth.push(r);
      else groups.later.push(r);
    });

    return `
      <div class="container">
        <div class="reminders-page">
          <div class="reminders-header">
            <h2><i class="fas fa-bell" style="color: var(--color-warning);"></i> 提醒中心</h2>
            <p class="text-muted">把零散信息交给我，自动归类、自动提醒</p>
          </div>

          <!-- 快速添加 -->
          <div class="card mb-xl">
            <h4 style="margin-bottom: var(--space-md);"><i class="fas fa-plus-circle" style="color: var(--color-primary);"></i> 快速添加提醒</h4>
            <div class="reminder-form">
              <input type="text" class="form-input" id="reminder-title" placeholder="事项名称，如：比基尼脱毛" maxlength="50">
              <select class="form-select" id="reminder-category">
                ${REMINDER_CATEGORIES.map(c => `<option value="${c.id}">${c.icon ? '●' : ''} ${c.name}</option>`).join('')}
              </select>
              <input type="date" class="form-input" id="reminder-date">
              <input type="number" class="form-input" id="reminder-interval" placeholder="周期（天），不填=一次性" min="0" style="max-width: 120px;">
              <button class="btn btn-primary" onclick="RemindersPage.addReminder()">
                <i class="fas fa-plus"></i> 添加
              </button>
            </div>
          </div>

          <!-- 提醒列表 -->
          ${sorted.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon"><i class="fas fa-bell-slash"></i></div>
              <div class="empty-state-title">暂无提醒</div>
              <div class="empty-state-desc">添加第一个提醒，我会帮你记住并准时通知</div>
            </div>
          ` : `
            ${this._renderGroup('🔴 今天', 'today', groups.today, '#EF4444')}
            ${this._renderGroup('🟡 明天', 'tomorrow', groups.tomorrow, '#F59E0B')}
            ${this._renderGroup('🔵 本周', 'thisWeek', groups.thisWeek, '#3B82F6')}
            ${this._renderGroup('🟢 本月', 'thisMonth', groups.thisMonth, '#10B981')}
            ${this._renderGroup('⚪ 以后', 'later', groups.later, '#94A3B8')}
          `}
        </div>
      </div>
    `;
  },

  _renderGroup(label, key, items, color) {
    if (items.length === 0) return '';
    return `
      <div class="reminder-group">
        <h4 class="reminder-group-title" style="color: ${color};">
          ${label} <span class="text-sm text-muted">(${items.length})</span>
        </h4>
        <div class="reminder-list">
          ${items.map(r => this._renderItem(r)).join('')}
        </div>
      </div>
    `;
  },

  _renderItem(r) {
    const today = this._today();
    const diff = this._diffDays(today, r.nextDate);
    const cat = REMINDER_CATEGORIES.find(c => c.id === r.category) || REMINDER_CATEGORIES[5];
    const remindDate = r.remindBefore ? this._addDays(r.nextDate, -r.remindBefore) : r.nextDate;

    let urgencyClass = '';
    if (diff === 0) urgencyClass = 'urgent';
    else if (diff === 1) urgencyClass = 'soon';
    else if (diff <= 3) urgencyClass = 'upcoming';

    // 计算下下次
    const nextNext = r.intervalDays ? this._addDays(r.nextDate, r.intervalDays) : null;

    return `
      <div class="reminder-card ${urgencyClass}" data-id="${r.id}">
        <div class="reminder-card-left" style="background: ${cat.color}15; color: ${cat.color};">
          <i class="fas ${cat.icon}"></i>
        </div>
        <div class="reminder-card-body">
          <div class="reminder-card-title">${r.title}</div>
          <div class="reminder-card-meta">
            <span class="badge" style="background: ${cat.color}15; color: ${cat.color};">${cat.name}</span>
            <span>📅 下次：${this._formatDate(r.nextDate)}</span>
            ${r.intervalDays ? `<span>🔄 每${r.intervalDays}天</span>` : ''}
            ${r.remindBefore ? `<span>⏰ 提前${r.remindBefore}天提醒</span>` : ''}
            ${nextNext ? `<span>📆 下下次：${this._formatDate(nextNext)}</span>` : ''}
          </div>
          ${diff === 0 ? '<div class="reminder-alert">⚠️ 就是今天！</div>' : ''}
          ${diff === 1 ? '<div class="reminder-alert" style="background: rgba(245,158,11,0.1); color: #F59E0B;">⏰ 明天！提前提醒：今天</div>' : ''}
          ${diff > 1 && diff <= 3 ? `<div class="text-sm text-muted">还有 ${diff} 天</div>` : ''}
        </div>
        <div class="reminder-card-actions">
          <button class="reminder-btn" onclick="RemindersPage.markDone('${r.id}')" title="完成/跳过本次">
            <i class="fas fa-check"></i>
          </button>
          <button class="reminder-btn delete" onclick="RemindersPage.deleteReminder('${r.id}')" title="删除">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  },

  addReminder() {
    const title = document.getElementById('reminder-title').value.trim();
    const category = document.getElementById('reminder-category').value;
    const date = document.getElementById('reminder-date').value;
    const interval = parseInt(document.getElementById('reminder-interval').value) || 0;

    if (!title) { Toast.warning('请输入事项名称'); return; }
    if (!date) { Toast.warning('请选择日期'); return; }

    Storage.addReminder({
      title,
      category,
      nextDate: date,
      intervalDays: interval || null,
      remindBefore: 1
    });

    Toast.success('已添加提醒！');
    this.rerender();
  },

  markDone(id) {
    const reminders = Storage.loadReminders();
    const r = reminders.find(x => x.id === id);
    if (!r) return;

    if (r.intervalDays) {
      // 周期性：推进到下一次
      r.nextDate = this._addDays(r.nextDate, r.intervalDays);
      Storage.saveReminders(reminders);
      Toast.success(`已更新！下次：${this._formatDate(r.nextDate)}`);
    } else {
      // 一次性：删除
      Storage.deleteReminder(id);
      Toast.success('已完成并移除');
    }
    this.rerender();
  },

  deleteReminder(id) {
    Storage.deleteReminder(id);
    Toast.success('已删除');
    this.rerender();
  },

  afterRender() {
    // 默认日期设为今天
    const dateInput = document.getElementById('reminder-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = this._today();
    }
  }
};
