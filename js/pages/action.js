// ============================================================
// 行动中心页面 - MIT + 收件箱 + 番茄钟 + 拖延粉碎机 + 仪式
// ============================================================

const ActionPage = {
  _today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  rerender() {
    const el = document.getElementById('page-action');
    if (!el) return;
    el.innerHTML = this.render();
    this.afterRender();
  },

  updateTimerDisplay() {
    const timeEl = document.querySelector('.pomodoro-minutes');
    if (timeEl) {
      const m = String(Pomodoro.state.minutes).padStart(2, '0');
      const s = String(Pomodoro.state.seconds).padStart(2, '0');
      timeEl.textContent = `${m}:${s}`;

      const progress = Pomodoro.state.totalSeconds > 0
        ? ((Pomodoro.state.totalSeconds - (Pomodoro.state.minutes * 60 + Pomodoro.state.seconds)) / Pomodoro.state.totalSeconds * 100)
        : 0;
      const circle = document.querySelector('.pomodoro-ring circle:last-child');
      if (circle) {
        circle.style.strokeDashoffset = 2 * Math.PI * 52 * (1 - progress / 100);
      }
    }
  },

  render() {
    const today = this._today();
    const tasks = Storage.loadDailyTasks(today);
    const inbox = Storage.loadInbox();
    const streak = Storage.getStreak();
    const todayPomodoros = Storage.getTodayPomodoros();

    // 检查是否已完成晨间仪式
    const ritualLog = Storage.loadRitualLog();
    const morningDone = ritualLog.morning && ritualLog.morning.date === today;
    const eveningDone = ritualLog.evening && ritualLog.evening.date === today;

    return `
      <div class="container">
        <div class="action-page">
          <!-- Streak 火焰 -->
          <div class="streak-bar">
            <div class="streak-flame ${streak >= 3 ? 'burning' : ''}">
              <span class="streak-count">${streak}</span>
              <span class="streak-label">天连续完成</span>
            </div>
            ${streak >= 3 ? `<span class="streak-msg">🔥 势头正旺，继续保持！</span>` : ''}
            ${streak >= 7 ? `<span class="streak-msg">⭐ 一周全勤！你做到了！</span>` : ''}
          </div>

          <!-- 仪式按钮 -->
          <div class="ritual-buttons">
            <button class="btn btn-sm ${morningDone ? 'btn-success' : 'btn-outline'}" onclick="ActionPage.startRitual('morning')">
              <i class="fas fa-sun"></i> ${morningDone ? '✅ 晨间已完成' : '☀️ 晨间仪式'}
            </button>
            <button class="btn btn-sm ${eveningDone ? 'btn-success' : 'btn-outline'}" onclick="ActionPage.startRitual('evening')">
              <i class="fas fa-moon"></i> ${eveningDone ? '✅ 晚间已完成' : '🌙 晚间复盘'}
            </button>
          </div>

          <div class="action-grid">
            <!-- 左侧：今日三件事 -->
            <div class="action-main">
              <div class="card">
                <div class="section-header">
                  <h3 class="section-title">
                    <i class="fas fa-star" style="color: var(--color-warning);"></i> 今日三件事
                  </h3>
                  <span class="text-sm text-muted">🍅 ${todayPomodoros} 个番茄</span>
                </div>
                <div class="task-list" id="task-list">
                  ${tasks.length === 0 ? `
                    <div class="empty-task-hint">
                      <p>还没有任务？</p>
                      <p class="text-sm text-muted">从收件箱提升任务，或点击下方添加</p>
                    </div>
                  ` : tasks.map((t, i) => TaskCard.render(t, i)).join('')}
                </div>
                ${tasks.length < 3 ? `
                  <div class="add-task-row">
                    <input type="text" class="form-input" id="new-task-input" placeholder="添加新任务（回车确认）" maxlength="100">
                  </div>
                ` : ''}
              </div>

              <!-- 拖延粉碎机 -->
              <div class="anti-procrastinate" id="anti-procrastinate">
                <button class="procrastinate-btn" onclick="ActionPage.smashProcrastination()">
                  <span class="procrastinate-icon">💥</span>
                  <span class="procrastinate-text">我动不了！帮帮我</span>
                </button>
              </div>
            </div>

            <!-- 右侧：番茄钟 + 收件箱 -->
            <div class="action-sidebar">
              ${Pomodoro.render()}

              <div class="card mt-lg">
                <div class="section-header">
                  <h4><i class="fas fa-inbox" style="color: var(--color-info);"></i> 收件箱</h4>
                  ${inbox.length > 10 ? '<span class="badge badge-warning">积压 ' + inbox.length + ' 条</span>' : `<span class="text-sm text-muted">${inbox.length} 条</span>`}
                </div>
                <div class="inbox-list" id="inbox-list">
                  ${inbox.length === 0 ? `
                    <p class="text-sm text-muted text-center" style="padding: var(--space-lg);">把想法扔进来，不用分类</p>
                  ` : inbox.map((item, i) => TaskCard.renderInbox(item, i)).join('')}
                </div>
                <div class="add-inbox-row">
                  <input type="text" class="form-input" id="new-inbox-input" placeholder="快速记录想法/任务..." maxlength="100">
                </div>
              </div>
            </div>
          </div>

          <!-- 今日统计 -->
          <div class="today-stats mt-xl">
            <div class="card">
              <div class="section-header">
                <h4><i class="fas fa-chart-bar" style="color: var(--color-primary);"></i> 今日数据</h4>
              </div>
              <div class="stats-row">
                <div class="stat-item">
                  <div class="stat-value">${tasks.filter(t => t.done).length}/${tasks.length}</div>
                  <div class="stat-label">任务完成</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${todayPomodoros}</div>
                  <div class="stat-label">番茄数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${streak}</div>
                  <div class="stat-label">连续天数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">${inbox.length}</div>
                  <div class="stat-label">收件箱</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  afterRender() {
    // 绑定新增任务回车事件
    const taskInput = document.getElementById('new-task-input');
    if (taskInput) {
      taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim()) {
          Storage.addDailyTask(this._today(), taskInput.value.trim());
          taskInput.value = '';
          this.rerender();
        }
      });
    }

    // 绑定收件箱回车事件
    const inboxInput = document.getElementById('new-inbox-input');
    if (inboxInput) {
      inboxInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && inboxInput.value.trim()) {
          Storage.addToInbox(inboxInput.value.trim());
          inboxInput.value = '';
          this.rerender();
        }
      });
    }

    // 任务文字点击编辑
    document.querySelectorAll('.task-text').forEach(el => {
      el.addEventListener('dblclick', () => {
        const index = parseInt(el.closest('.task-card').dataset.index);
        const tasks = Storage.loadDailyTasks(this._today());
        const currentText = tasks[index]?.text || '';
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'form-input';
        input.style.cssText = 'width: 100%;';
        el.replaceWith(input);
        input.focus();
        input.select();

        const save = () => {
          if (input.value.trim()) {
            Storage.updateDailyTask(this._today(), index, input.value.trim());
          }
          this.rerender();
        };
        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') this.rerender();
        });
      });
    });
  },

  // === 任务操作 ===
  toggleTask(index) {
    Storage.toggleDailyTask(this._today(), index);
    this.rerender();
  },

  removeTask(index) {
    Storage.removeDailyTask(this._today(), index);
    this.rerender();
  },

  startPomodoro(index) {
    Pomodoro.state.taskIndex = index;
    Pomodoro.reset();
    Pomodoro.state.minutes = 25;
    Pomodoro.state.seconds = 0;
    Pomodoro.state.totalSeconds = 25 * 60;
    Pomodoro.start();
    this.rerender();
  },

  togglePomodoro() {
    if (Pomodoro.state.isRunning) {
      Pomodoro.pause();
    } else {
      Pomodoro.start();
    }
  },

  resetPomodoro() {
    Pomodoro.reset();
    this.rerender();
  },

  setPomodoro(minutes) {
    Pomodoro.reset();
    Pomodoro.state.minutes = minutes;
    Pomodoro.state.seconds = 0;
    Pomodoro.state.totalSeconds = minutes * 60;
    this.rerender();
  },

  // === 收件箱操作 ===
  promoteFromInbox(index) {
    const inbox = Storage.loadInbox();
    if (index >= 0 && index < inbox.length) {
      const tasks = Storage.loadDailyTasks(this._today());
      if (tasks.length >= 3) {
        Toast.warning('今日任务已满3个，请先完成或删除一个');
        return;
      }
      Storage.addDailyTask(this._today(), inbox[index].text);
      Storage.removeFromInbox(index);
      this.rerender();
    }
  },

  removeFromInbox(index) {
    Storage.removeFromInbox(index);
    this.rerender();
  },

  // === 拖延粉碎机 ===
  smashProcrastination() {
    const action = MICRO_ACTIONS[Math.floor(Math.random() * MICRO_ACTIONS.length)];
    const container = document.getElementById('anti-procrastinate');

    container.innerHTML = `
      <div class="micro-action-card">
        <div class="micro-action-text">"${action}"</div>
        <div class="micro-timer" id="micro-timer">2:00</div>
        <p class="text-sm text-muted">就2分钟，试试看</p>
        <button class="btn btn-sm btn-secondary mt-sm" onclick="ActionPage.resetProcrastinate()">换一个</button>
      </div>
    `;

    // 2分钟倒计时
    let seconds = 120;
    const timerEl = document.getElementById('micro-timer');
    const interval = setInterval(() => {
      seconds--;
      if (timerEl) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
      }
      if (seconds <= 0) {
        clearInterval(interval);
        container.innerHTML = `
          <div class="micro-action-card">
            <div class="micro-action-text" style="font-size: var(--font-size-xl);">💪 2分钟到了！</div>
            <p class="text-sm">要开始做刚才那件事了吗？</p>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <button class="btn btn-primary btn-sm" onclick="ActionPage.resetProcrastinate()">再来一个2分钟</button>
            </div>
          </div>
        `;
      }
    }, 1000);
  },

  resetProcrastinate() {
    const container = document.getElementById('anti-procrastinate');
    container.innerHTML = `
      <button class="procrastinate-btn" onclick="ActionPage.smashProcrastination()">
        <span class="procrastinate-icon">💥</span>
        <span class="procrastinate-text">我动不了！帮帮我</span>
      </button>
    `;
  },

  // === 仪式 ===
  startRitual(type) {
    const overlay = document.createElement('div');
    overlay.id = 'ritual-container';
    overlay.innerHTML = Ritual.render(type);
    document.body.appendChild(overlay);

    // 绑定下一步按钮
    document.getElementById('ritual-next').addEventListener('click', () => Ritual.nextStep());

    // 绑定 scale 事件
    const firstStep = RITUAL_STEPS[type][0];
    if (firstStep.type === 'scale') {
      document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        });
      });
    }
  },

  closeRitual() {
    const overlay = document.getElementById('ritual-container');
    if (overlay) overlay.remove();
    Pomodoro.reset();
    this.rerender();
  }
};
