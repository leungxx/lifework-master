// ============================================================
// 番茄钟计时器组件
// ============================================================

const Pomodoro = {
  state: {
    isRunning: false,
    isBreak: false,
    minutes: 25,
    seconds: 0,
    totalSeconds: 25 * 60,
    elapsed: 0,
    interval: null,
    taskIndex: null
  },

  render() {
    const m = String(this.state.minutes).padStart(2, '0');
    const s = String(this.state.seconds).padStart(2, '0');
    const progress = this.state.totalSeconds > 0
      ? ((this.state.totalSeconds - (this.state.minutes * 60 + this.state.seconds)) / this.state.totalSeconds * 100)
      : 0;

    const statusText = this.state.isRunning
      ? (this.state.isBreak ? '☕ 休息中...' : '🍅 专注中...')
      : '准备开始';

    return `
      <div class="pomodoro-widget ${this.state.isRunning ? 'pomodoro-running' : ''} ${this.state.isBreak ? 'pomodoro-break' : ''}">
        <div class="pomodoro-header">
          <h4><i class="fas fa-clock"></i> 番茄钟</h4>
          <span class="pomodoro-status">${statusText}</span>
        </div>
        <div class="pomodoro-timer">
          <div class="pomodoro-ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border-light)" stroke-width="6"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-primary)" stroke-width="6"
                stroke-dasharray="${2 * Math.PI * 52}"
                stroke-dashoffset="${2 * Math.PI * 52 * (1 - progress / 100)}"
                stroke-linecap="round" transform="rotate(-90 60 60)"
                style="transition: stroke-dashoffset 0.5s linear;"/>
            </svg>
            <div class="pomodoro-time">
              <span class="pomodoro-minutes">${m}:${s}</span>
            </div>
          </div>
        </div>
        <div class="pomodoro-controls">
          ${!this.state.isRunning ? `
            <button class="btn btn-primary btn-sm" onclick="ActionPage.togglePomodoro()">
              <i class="fas fa-play"></i> 开始专注
            </button>
          ` : `
            <button class="btn btn-warning btn-sm" onclick="ActionPage.togglePomodoro()">
              <i class="fas fa-pause"></i> 暂停
            </button>
            <button class="btn btn-secondary btn-sm" onclick="ActionPage.resetPomodoro()">
              <i class="fas fa-stop"></i> 结束
            </button>
          `}
        </div>
        <div class="pomodoro-presets">
          <button class="preset-btn ${this.state.totalSeconds === 25*60 && !this.state.isRunning ? 'active' : ''}" onclick="ActionPage.setPomodoro(25)">25分钟</button>
          <button class="preset-btn ${this.state.totalSeconds === 15*60 && !this.state.isRunning ? 'active' : ''}" onclick="ActionPage.setPomodoro(15)">15分钟</button>
          <button class="preset-btn ${this.state.totalSeconds === 5*60 && !this.state.isRunning ? 'active' : ''}" onclick="ActionPage.setPomodoro(5)">5分钟</button>
        </div>
      </div>
    `;
  },

  start() {
    if (this.state.interval) return;
    this.state.isRunning = true;
    this.state.interval = setInterval(() => this.tick(), 1000);
    ActionPage.rerender();
  },

  pause() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
      this.state.interval = null;
    }
    this.state.isRunning = false;
    ActionPage.rerender();
  },

  tick() {
    if (this.state.seconds > 0) {
      this.state.seconds--;
    } else if (this.state.minutes > 0) {
      this.state.minutes--;
      this.state.seconds = 59;
    } else {
      // 时间到
      this.done();
      return;
    }
    ActionPage.updateTimerDisplay();
  },

  done() {
    clearInterval(this.state.interval);
    this.state.interval = null;
    this.state.isRunning = false;

    if (this.state.isBreak) {
      // 休息结束
      this.state.isBreak = false;
      this.state.minutes = 25;
      this.state.seconds = 0;
      this.state.totalSeconds = 25 * 60;
      Toast.success('休息结束！准备好开始下一轮了吗？');
      this.playSound();
    } else {
      // 专注结束，记录番茄
      if (this.state.taskIndex !== null) {
        Storage.addPomodoro(this.state.taskIndex);
      }
      Storage.logPomodoro();
      this.state.isBreak = true;
      this.state.minutes = 5;
      this.state.seconds = 0;
      this.state.totalSeconds = 5 * 60;
      Toast.success('🍅 一个番茄完成！休息5分钟吧');
      this.playSound();
    }
    ActionPage.rerender();
  },

  playSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        osc2.connect(gain);
        osc2.frequency.value = 1000;
        osc2.start();
        osc2.stop(ctx.currentTime + 0.15);
      }, 200);
    } catch(e) {}
  },

  reset() {
    clearInterval(this.state.interval);
    this.state.interval = null;
    this.state.isRunning = false;
    this.state.isBreak = false;
    this.state.minutes = 25;
    this.state.seconds = 0;
    this.state.totalSeconds = 25 * 60;
  }
};
