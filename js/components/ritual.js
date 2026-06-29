// ============================================================
// 晨间/晚间仪式组件
// ============================================================

const Ritual = {
  currentType: null,
  currentStep: 0,
  answers: {},

  render(type) {
    this.currentType = type;
    this.currentStep = 0;
    this.answers = {};
    const steps = RITUAL_STEPS[type];
    const step = steps[0];

    return `
      <div class="ritual-overlay" id="ritual-overlay">
        <div class="ritual-modal">
          <div class="ritual-header">
            <div class="ritual-icon">
              <i class="fas ${type === 'morning' ? 'fa-sun' : 'fa-moon'}"></i>
            </div>
            <h3>${type === 'morning' ? '☀️ 晨间仪式' : '🌙 晚间复盘'}</h3>
            <p class="text-sm text-muted">${type === 'morning' ? '用5分钟，为今天定调' : '用5分钟，给今天收尾'}</p>
          </div>
          <div class="ritual-progress">
            ${steps.map((s, i) => `
              <div class="ritual-step-dot ${i === 0 ? 'active' : ''}" data-step="${i}"></div>
              ${i < steps.length - 1 ? '<div class="ritual-step-line"></div>' : ''}
            `).join('')}
          </div>
          <div class="ritual-body" id="ritual-body">
            ${this._renderStep(step)}
          </div>
          <div class="ritual-footer">
            <button class="btn btn-secondary btn-sm" onclick="ActionPage.closeRitual()">跳过</button>
            <button class="btn btn-primary btn-sm" id="ritual-next">下一步</button>
          </div>
        </div>
      </div>
    `;
  },

  _renderStep(step) {
    return `
      <div class="ritual-step">
        <h4>${step.title}</h4>
        <p class="ritual-question">${step.question}</p>
        ${this._renderInput(step)}
      </div>
    `;
  },

  _renderInput(step) {
    switch (step.type) {
      case 'text':
        return `<textarea class="form-textarea" id="ritual-input" rows="3" placeholder="写下你的想法...">${this.answers[step.id] || ''}</textarea>`;
      case 'scale':
        const val = this.answers[step.id] || 5;
        let btns = '';
        for (let i = step.min; i <= step.max; i++) {
          btns += `<button class="scale-btn ${val === i ? 'selected' : ''}" data-value="${i}">${i}</button>`;
        }
        return `<div class="scale-input">${btns}</div>`;
      default:
        return '';
    }
  },

  nextStep() {
    const steps = RITUAL_STEPS[this.currentType];
    const step = steps[this.currentStep];

    // 保存当前步骤答案
    if (step.type === 'text') {
      const input = document.getElementById('ritual-input');
      if (input) this.answers[step.id] = input.value;
    } else if (step.type === 'scale') {
      const selected = document.querySelector('.scale-btn.selected');
      if (selected) this.answers[step.id] = parseInt(selected.dataset.value);
    }

    this.currentStep++;

    if (this.currentStep >= steps.length) {
      // 仪式完成
      this._finish();
      return;
    }

    // 渲染下一步
    const nextStep = steps[this.currentStep];
    const body = document.getElementById('ritual-body');
    if (body) body.innerHTML = this._renderStep(nextStep);

    // 更新进度点
    document.querySelectorAll('.ritual-step-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentStep);
      dot.classList.toggle('done', i < this.currentStep);
    });

    // 更新按钮文字
    const btn = document.getElementById('ritual-next');
    if (btn && this.currentStep >= steps.length - 1) {
      btn.textContent = '完成';
    }

    // 重新绑定事件
    this._bindEvents(nextStep);
  },

  _bindEvents(step) {
    if (step.type === 'scale') {
      document.querySelectorAll('.scale-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          this.answers[step.id] = parseInt(btn.dataset.value);
        });
      });
    }
  },

  _finish() {
    // 保存仪式记录
    Storage.saveRitualLog(this.currentType, this.answers);
    ActionPage.closeRitual();

    if (this.currentType === 'morning') {
      Toast.success('☀️ 晨间仪式完成！今天加油！');
    } else {
      Toast.success('🌙 晚间复盘完成！好好休息~');
    }
  }
};
