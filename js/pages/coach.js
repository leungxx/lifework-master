// ============================================================
// 效能教练页面 - 每日工作复盘带教
// ============================================================

const CoachPage = {
  currentStep: 0,
  answers: {},

  _today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  rerender() {
    const el = document.getElementById('page-coach');
    if (!el) return;
    el.innerHTML = this.render();
    this.afterRender();
  },

  render() {
    const today = this._today();
    const coachData = Storage.loadCoachData();
    const todayEntry = coachData[today];
    const history = Object.entries(coachData)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 7);

    // 如果今天已经完成了，显示总结
    if (todayEntry && todayEntry.completed) {
      return this._renderCompleted(todayEntry, history);
    }

    // 否则显示带教流程
    return this._renderCoachFlow(today);
  },

  _renderCoachFlow(today) {
    const steps = [
      { id: 'done_today', title: '今天完成了什么？', hint: '列出今天实际完成的工作，哪怕很小', type: 'text' },
      { id: 'unfinished', title: '什么没完成？', hint: '从行动中心拉取未完成任务，或手动补充', type: 'unfinished_list' },
      { id: 'reason', title: '为什么没完成？', hint: '选择最主要的原因', type: 'reason_select' },
      { id: 'confusion', title: '有什么困惑或卡点？', hint: '写下来，梳理本身就是解决问题的一半', type: 'confusion_select' },
      { id: 'confusion_detail', title: '具体说说', hint: '是什么让你困惑？描述具体场景', type: 'text' },
      { id: 'tomorrow_focus', title: '明天最重要的第一件事', hint: '只写一件，明天醒来就知道要做什么', type: 'text' }
    ];

    // 如果选了"没有困惑"，跳过详细描述
    const effectiveSteps = this.answers.confusion === 'none'
      ? steps.filter(s => s.id !== 'confusion_detail')
      : steps;

    if (this.currentStep >= effectiveSteps.length) {
      return this._renderSummary();
    }

    const step = effectiveSteps[this.currentStep];
    const progress = Math.round((this.currentStep / effectiveSteps.length) * 100);

    return `
      <div class="container">
        <div class="coach-page">
          <div class="coach-header">
            <div class="coach-avatar">💼</div>
            <h2>效能教练</h2>
            <p class="text-sm text-muted">${COACH_GREETINGS[Math.floor(Math.random() * COACH_GREETINGS.length)]}</p>
          </div>

          <div class="progress-bar mb-lg">
            <div class="progress-bar-fill" style="width: ${progress}%"></div>
          </div>

          <div class="coach-step-card">
            <div class="coach-step-num">${this.currentStep + 1}/${effectiveSteps.length}</div>
            <h3 class="coach-step-title">${step.title}</h3>
            <p class="coach-step-hint">${step.hint}</p>

            <div class="coach-step-body" id="coach-step-body">
              ${this._renderStepInput(step, today)}
            </div>
          </div>

          <div class="coach-nav">
            ${this.currentStep > 0 ? `<button class="btn btn-secondary" onclick="CoachPage.prevStep()">上一步</button>` : '<span></span>'}
            <button class="btn btn-primary" id="coach-next-btn">下一步</button>
          </div>
        </div>
      </div>
    `;
  },

  _renderStepInput(step, today) {
    switch (step.type) {
      case 'text':
        return `<textarea class="form-textarea" id="coach-input" rows="3" placeholder="写下你的想法...">${this.answers[step.id] || ''}</textarea>`;
      case 'unfinished_list':
        const tasks = Storage.loadDailyTasks(today);
        const undone = tasks.filter(t => !t.done);
        return `
          ${undone.length > 0 ? `
            <div class="unfinished-list">
              ${undone.map(t => `
                <label class="unfinished-item">
                  <input type="checkbox" value="${t.text}" class="unfinished-check" ${(this.answers.unfinished || []).includes(t.text) ? 'checked' : ''}>
                  <span>${t.text}</span>
                </label>
              `).join('')}
            </div>
          ` : '<p class="text-sm text-muted">行动中心没有未完成任务</p>'}
          <textarea class="form-textarea mt-sm" id="coach-input" rows="2" placeholder="还有其他没完成的吗？">${typeof this.answers.unfinished === 'string' ? this.answers.unfinished : ''}</textarea>
        `;
      case 'reason_select':
        return UNFINISHED_REASONS.map(r => `
          <div class="coach-option ${this.answers.reason === r.id ? 'selected' : ''}" data-value="${r.id}">
            <span class="coach-option-icon">${r.icon}</span>
            <span>${r.label}</span>
          </div>
        `).join('');
      case 'confusion_select':
        return CONFUSION_TYPES.map(c => `
          <div class="coach-option ${this.answers.confusion === c.id ? 'selected' : ''}" data-value="${c.id}">
            <span class="coach-option-icon">${c.icon}</span>
            <span>${c.label}</span>
          </div>
        `).join('');
      default:
        return '';
    }
  },

  _renderSummary() {
    const reason = UNFINISHED_REASONS.find(r => r.id === this.answers.reason);
    const confusion = CONFUSION_TYPES.find(c => c.id === this.answers.confusion);
    const advice = COACH_ADVICE[this.answers.reason] || COACH_ADVICE.procrastination;

    // 检查连续同一原因
    const history = Storage.loadCoachData();
    const recent = Object.entries(history)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 5);
    let sameReasonCount = 0;
    for (const [, entry] of recent) {
      if (entry.reason === this.answers.reason) sameReasonCount++;
      else break;
    }

    return `
      <div class="container">
        <div class="coach-page">
          <div class="coach-header">
            <div class="coach-avatar">💼</div>
            <h2>效能教练 · 今日复盘</h2>
          </div>

          <div class="coach-result-card">
            <div class="coach-advice-section">
              <h4><i class="fas fa-lightbulb" style="color: #F59E0B;"></i> 教练点评</h4>
              <div class="coach-advice-text">${advice.short}</div>
            </div>

            <div class="coach-advice-section">
              <h4><i class="fas fa-arrow-right" style="color: var(--color-primary);"></i> 明天试试这个</h4>
              <div class="coach-advice-text">${advice.action}</div>
            </div>

            ${sameReasonCount >= 3 && advice.escalate ? `
            <div class="coach-advice-section" style="border-color: #EF4444;">
              <h4><i class="fas fa-exclamation-triangle" style="color: #EF4444;"></i> 已连续${sameReasonCount}天相同原因</h4>
              <div class="coach-advice-text">${advice.escalate}</div>
            </div>
            ` : ''}

            <div class="coach-summary-grid">
              <div class="coach-summary-item">
                <div class="text-xs text-muted">未完成原因</div>
                <div class="font-medium">${reason ? reason.label : '--'}</div>
              </div>
              <div class="coach-summary-item">
                <div class="text-xs text-muted">困惑类型</div>
                <div class="font-medium">${confusion ? confusion.label : '--'}</div>
              </div>
              <div class="coach-summary-item">
                <div class="text-xs text-muted">明天重点</div>
                <div class="font-medium">${this.answers.tomorrow_focus || '--'}</div>
              </div>
            </div>

            <div class="coach-closing">
              <p>${COACH_CLOSINGS[Math.floor(Math.random() * COACH_CLOSINGS.length)]}</p>
            </div>

            <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="CoachPage.finishCoach()">
              <i class="fas fa-check-circle"></i> 完成复盘
            </button>
          </div>
        </div>
      </div>
    `;
  },

  _renderCompleted(todayEntry, history) {
    const reason = UNFINISHED_REASONS.find(r => r.id === todayEntry.reason);

    return `
      <div class="container">
        <div class="coach-page">
          <div class="coach-header">
            <div class="coach-avatar">💼</div>
            <h2>效能教练</h2>
            <p class="text-sm text-muted">今日复盘已完成 ✅</p>
          </div>

          <div class="coach-result-card">
            <div class="coach-summary-grid">
              <div class="coach-summary-item">
                <div class="text-xs text-muted">未完成原因</div>
                <div class="font-medium">${reason ? reason.label : '--'}</div>
              </div>
              <div class="coach-summary-item">
                <div class="text-xs text-muted">明天重点</div>
                <div class="font-medium">${todayEntry.tomorrow_focus || '--'}</div>
              </div>
            </div>

            ${history.length > 1 ? `
            <div class="mt-lg">
              <h4 style="margin-bottom: var(--space-md);">📊 最近复盘</h4>
              ${history.map(([date, entry]) => `
                <div class="coach-history-item">
                  <span class="text-sm">${date}</span>
                  <span class="badge badge-info">${UNFINISHED_REASONS.find(r => r.id === entry.reason)?.label || '--'}</span>
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  nextStep() {
    // 保存当前步骤的答案
    const steps = [
      { id: 'done_today', type: 'text' },
      { id: 'unfinished', type: 'unfinished_list' },
      { id: 'reason', type: 'reason_select' },
      { id: 'confusion', type: 'confusion_select' },
      { id: 'confusion_detail', type: 'text' },
      { id: 'tomorrow_focus', type: 'text' }
    ];
    const effectiveSteps = this.answers.confusion === 'none'
      ? steps.filter(s => s.id !== 'confusion_detail')
      : steps;

    if (this.currentStep < effectiveSteps.length) {
      const step = effectiveSteps[this.currentStep];
      if (step.type === 'text') {
        const input = document.getElementById('coach-input');
        if (input) this.answers[step.id] = input.value;
      } else if (step.type === 'unfinished_list') {
        const checks = document.querySelectorAll('.unfinished-check:checked');
        const manualInput = document.getElementById('coach-input');
        const list = Array.from(checks).map(c => c.value);
        if (manualInput && manualInput.value.trim()) {
          list.push(manualInput.value.trim());
        }
        this.answers.unfinished = list;
      }
    }

    this.currentStep++;

    if (this.currentStep >= effectiveSteps.length) {
      // 显示总结，暂不保存
      this.rerender();
      return;
    }

    this.rerender();
  },

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.rerender();
    }
  },

  finishCoach() {
    const today = this._today();
    Storage.saveCoachData(today, {
      ...this.answers,
      completed: true,
      time: new Date().toISOString()
    });

    // 如果设定了明天重点，自动加到明天行动中心
    if (this.answers.tomorrow_focus) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
      Storage.addDailyTask(tDate, this.answers.tomorrow_focus);
    }

    this.currentStep = 0;
    this.answers = {};
    Toast.success('复盘完成！明天继续加油 💪');
    this.rerender();
  },

  afterRender() {
    // 绑定选项点击
    document.querySelectorAll('.coach-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const parent = opt.parentElement;
        parent.querySelectorAll('.coach-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        // 找到当前步骤
        const stepCard = document.querySelector('.coach-step-card');
        if (stepCard) {
          const stepNum = stepCard.querySelector('.coach-step-num').textContent.split('/')[0];
          const steps = [
            { id: 'done_today' }, { id: 'unfinished' }, { id: 'reason' },
            { id: 'confusion' }, { id: 'confusion_detail' }, { id: 'tomorrow_focus' }
          ];
          const stepIdx = parseInt(stepNum) - 1;
          const effectiveSteps = this.answers.confusion === 'none'
            ? steps.filter(s => s.id !== 'confusion_detail')
            : steps;
          if (stepIdx < effectiveSteps.length) {
            this.answers[effectiveSteps[stepIdx].id] = opt.dataset.value;
          }
        }
      });
    });

    // 绑定下一步按钮
    const nextBtn = document.getElementById('coach-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }
  }
};
