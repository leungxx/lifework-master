// ============================================================
// localStorage 封装
// ============================================================

class Storage {
  static _prefix(key) {
    return CONFIG.STORAGE_PREFIX + key;
  }

  static save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this._prefix(key), serialized);
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  }

  static load(key) {
    try {
      const data = localStorage.getItem(this._prefix(key));
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage load error:', e);
      return null;
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(this._prefix(key));
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  }

  static clear() {
    try {
      Object.values(CONFIG.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(this._prefix(key));
      });
      return true;
    } catch (e) {
      console.error('Storage clear error:', e);
      return false;
    }
  }

  // --- 用户设置 ---
  static saveSettings(settings) {
    return this.save(CONFIG.STORAGE_KEYS.SETTINGS, settings);
  }

  static loadSettings() {
    return this.load(CONFIG.STORAGE_KEYS.SETTINGS) || {};
  }

  // --- 每日打卡 ---
  static loadAllCheckins() {
    return this.load(CONFIG.STORAGE_KEYS.CHECKIN_DATA) || {};
  }

  static loadCheckin(dateStr) {
    const data = this.loadAllCheckins();
    return data[dateStr] || {};
  }

  static saveCheckin(dateStr, metricId, value) {
    const data = this.loadAllCheckins();
    if (!data[dateStr]) data[dateStr] = {};
    if (value === null || value === undefined) {
      delete data[dateStr][metricId];
    } else {
      data[dateStr][metricId] = value;
    }
    // 清理空日期的条目
    if (Object.keys(data[dateStr]).length === 0) {
      delete data[dateStr];
    }
    // 保留最近90天数据
    const dates = Object.keys(data).sort();
    if (dates.length > 90) {
      dates.slice(0, dates.length - 90).forEach(d => delete data[d]);
    }
    return this.save(CONFIG.STORAGE_KEYS.CHECKIN_DATA, data);
  }

  static getWeekCheckins(endDateStr) {
    const data = this.loadAllCheckins();
    const end = new Date(endDateStr + 'T00:00:00');
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      result.push({
        date: dateStr,
        ...(data[dateStr] || {})
      });
    }
    return result;
  }

  // --- 收件箱 ---
  static loadInbox() {
    return this.load(CONFIG.STORAGE_KEYS.INBOX) || [];
  }

  static addToInbox(text) {
    const inbox = this.loadInbox();
    inbox.push({ id: Date.now(), text, createdAt: new Date().toISOString() });
    return this.save(CONFIG.STORAGE_KEYS.INBOX, inbox);
  }

  static removeFromInbox(index) {
    const inbox = this.loadInbox();
    if (index >= 0 && index < inbox.length) {
      inbox.splice(index, 1);
      return this.save(CONFIG.STORAGE_KEYS.INBOX, inbox);
    }
    return false;
  }

  // --- 每日任务 ---
  static loadAllDailyTasks() {
    return this.load(CONFIG.STORAGE_KEYS.DAILY_TASKS) || {};
  }

  static loadDailyTasks(dateStr) {
    const data = this.loadAllDailyTasks();
    return data[dateStr] || [];
  }

  static addDailyTask(dateStr, text) {
    const data = this.loadAllDailyTasks();
    if (!data[dateStr]) data[dateStr] = [];
    const tasks = data[dateStr];
    if (tasks.length >= 3) return false;
    tasks.push({
      id: Date.now(),
      text,
      done: false,
      pomodoros: 0,
      delayedDays: 0,
      createdAt: new Date().toISOString()
    });
    return this.save(CONFIG.STORAGE_KEYS.DAILY_TASKS, data);
  }

  static toggleDailyTask(dateStr, index) {
    const data = this.loadAllDailyTasks();
    const tasks = data[dateStr];
    if (tasks && index >= 0 && index < tasks.length) {
      tasks[index].done = !tasks[index].done;
      return this.save(CONFIG.STORAGE_KEYS.DAILY_TASKS, data);
    }
    return false;
  }

  static removeDailyTask(dateStr, index) {
    const data = this.loadAllDailyTasks();
    const tasks = data[dateStr];
    if (tasks && index >= 0 && index < tasks.length) {
      tasks.splice(index, 1);
      return this.save(CONFIG.STORAGE_KEYS.DAILY_TASKS, data);
    }
    return false;
  }

  static updateDailyTask(dateStr, index, text) {
    const data = this.loadAllDailyTasks();
    const tasks = data[dateStr];
    if (tasks && index >= 0 && index < tasks.length) {
      tasks[index].text = text;
      return this.save(CONFIG.STORAGE_KEYS.DAILY_TASKS, data);
    }
    return false;
  }

  // 每天自动结转未完成任务
  static rolloverTasks() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yDateStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const tDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const data = this.loadAllDailyTasks();
    const yTasks = data[yDateStr] || [];
    const tTasks = data[tDateStr] || [];
    const undone = yTasks.filter(t => !t.done);

    if (undone.length > 0) {
      undone.forEach(t => {
        if (tTasks.length < 3) {
          tTasks.push({
            id: Date.now() + Math.random(),
            text: t.text,
            done: false,
            pomodoros: 0,
            delayedDays: (t.delayedDays || 0) + 1,
            createdAt: new Date().toISOString()
          });
        }
      });
      data[tDateStr] = tTasks;
      this.save(CONFIG.STORAGE_KEYS.DAILY_TASKS, data);
    }
  }

  // --- 连续完成 streak ---
  static getStreak() {
    const data = this.loadAllDailyTasks();
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const tasks = data[dateStr] || [];
      if (tasks.length === 0) break;
      const allDone = tasks.every(t => t.done);
      if (!allDone) break;
      streak++;
    }
    return streak;
  }

  // --- 番茄钟 ---
  static addPomodoro(taskIndex) {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const data = this.loadAllDailyTasks();
    const tasks = data[dateStr];
    if (tasks && taskIndex >= 0 && taskIndex < tasks.length) {
      tasks[taskIndex].pomodoros = (tasks[taskIndex].pomodoros || 0) + 1;
      this.save(CONFIG.STORAGE_KEYS.DAILY_TASKS, data);
    }
  }

  static logPomodoro() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const log = this.load(CONFIG.STORAGE_KEYS.POMODORO_LOG) || {};
    if (!log[dateStr]) log[dateStr] = [];
    log[dateStr].push({ time: new Date().toISOString() });
    return this.save(CONFIG.STORAGE_KEYS.POMODORO_LOG, log);
  }

  static getTodayPomodoros() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const log = this.load(CONFIG.STORAGE_KEYS.POMODORO_LOG) || {};
    return (log[dateStr] || []).length;
  }

  // --- 仪式记录 ---
  static saveRitualLog(type, answers) {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const log = this.load(CONFIG.STORAGE_KEYS.RITUAL_LOG) || {};
    log[type] = { date: dateStr, answers, time: new Date().toISOString() };
    return this.save(CONFIG.STORAGE_KEYS.RITUAL_LOG, log);
  }

  static loadRitualLog() {
    return this.load(CONFIG.STORAGE_KEYS.RITUAL_LOG) || {};
  }

  // --- 提醒系统 ---
  static loadReminders() {
    const saved = this.load('reminders');
    if (saved && saved.length > 0) return saved;
    // 首次加载使用预设提醒
    const presets = PRESET_REMINDERS.map(r => ({ ...r }));
    this.save('reminders', presets);
    return presets;
  }

  static saveReminders(reminders) {
    return this.save('reminders', reminders);
  }

  static addReminder(reminder) {
    const reminders = this.loadReminders();
    reminders.push({
      id: 'r_' + Date.now(),
      ...reminder
    });
    return this.saveReminders(reminders);
  }

  static deleteReminder(id) {
    const reminders = this.loadReminders();
    const filtered = reminders.filter(r => r.id !== id);
    return this.saveReminders(filtered);
  }

  // 获取今天需要提醒的事项
  static getTodayReminders() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const reminders = this.loadReminders();
    return reminders.filter(r => {
      if (!r.nextDate) return false;
      // 提醒日 = nextDate - remindBefore
      const d = new Date(r.nextDate + 'T00:00:00');
      d.setDate(d.getDate() - (r.remindBefore || 0));
      const remindDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return remindDate === dateStr;
    });
  }

  // --- 效能教练 ---
  static loadCoachData() {
    return this.load('coach_data') || {};
  }

  static saveCoachData(dateStr, entry) {
    const data = this.loadCoachData();
    data[dateStr] = entry;
    // 保留最近90天
    const dates = Object.keys(data).sort();
    if (dates.length > 90) {
      dates.slice(0, dates.length - 90).forEach(d => delete data[d]);
    }
    return this.save('coach_data', data);
  }
}
