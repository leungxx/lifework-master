// ============================================================
// 评估问卷页
// ============================================================

const QuestionnairePage = {
  currentDimensionIndex: 0,
  currentQuestionIndex: 0,
  answers: {},
  dimOrder: ['mental', 'life', 'physical', 'beauty', 'productivity', 'goal'],
  questionsByDim: {},

  init() {
    // 按维度分组
    this.questionsByDim = {};
    this.dimOrder.forEach(dimId => {
      this.questionsByDim[dimId] = QUESTIONNAIRE.filter(q => q.dimension === dimId);
    });

    // 检查是否有保存的进度
    const saved = Storage.loadQuestionnaireProgress();
    if (saved) {
      this.answers = saved.answers || {};
      this.currentDimensionIndex = saved.currentDimensionIndex || 0;
      this.currentQuestionIndex = saved.currentQuestionIndex || 0;
    } else {
      // 重置状态
      this.answers = {};
      this.currentDimensionIndex = 0;
      this.currentQuestionIndex = 0;
    }
  },

  render() {
    this.init();

    const dimId = this.dimOrder[this.currentDimensionIndex];
    const dim = DIMENSIONS[dimId];
    const questions = this.questionsByDim[dimId];

    // 安全检查：确保索引不越界
    if (!questions || questions.length === 0) {
      this.currentDimensionIndex = 0;
      this.currentQuestionIndex = 0;
      return this.render();
    }
    if (this.currentQuestionIndex >= questions.length) {
      this.currentQuestionIndex = questions.length - 1;
    }

    const currentQ = questions[this.currentQuestionIndex];
    const isLastQ = this.currentQuestionIndex >= questions.length - 1;
    const isLastDim = this.currentDimensionIndex >= this.dimOrder.length - 1;
    const isLastOverall = isLastQ && isLastDim;

    const totalQuestions = QUESTIONNAIRE.length;
    const answeredCount = Object.keys(this.answers).length;
    const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

    // 判断当前题目是否已选择（用于启用/禁用下一题按钮）
    const hasCurrentAnswer = this._hasAnswer(currentQ);

    return `
      <div class="container">
        <div class="questionnaire-container">
          <!-- 头部 -->
          <div class="questionnaire-header">
            <h2><i class="fas fa-clipboard-list" style="color: var(--color-primary);"></i> 综合评估问卷</h2>
            <p>${totalQuestions}道题目，覆盖6个维度，预计15-20分钟完成</p>
          </div>

          <!-- 进度条 -->
          <div class="questionnaire-progress">
            <div class="progress-info">
              <span>评估进度</span>
              <span class="font-semibold">${answeredCount}/${totalQuestions} 题 (${progressPercent}%)</span>
            </div>
            <div class="progress-bar progress-bar-lg">
              <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
            </div>
          </div>

          <!-- 步骤指示器 -->
          <div class="questionnaire-steps">
            ${this.dimOrder.map((dId, i) => {
              const dimInfo = DIMENSIONS[dId];
              const dimQuestions = this.questionsByDim[dId];
              const dimAnswered = dimQuestions.filter(q => this._hasAnswer(q)).length;
              const dimDone = dimAnswered >= dimQuestions.length;
              let stateClass = '';
              if (i < this.currentDimensionIndex || (i === this.currentDimensionIndex && dimDone)) stateClass = 'completed';
              else if (i === this.currentDimensionIndex) stateClass = 'active';

              return `
                ${i > 0 ? '<span class="q-step-separator"></span>' : ''}
                <span class="q-step ${stateClass}" data-dim-index="${i}">
                  <span class="q-step-dot"></span>
                  <span style="color: ${dimInfo.color}"><i class="fas ${dimInfo.icon}"></i></span>
                  ${dimInfo.name}
                </span>
              `;
            }).join('')}
          </div>

          <!-- 当前维度标题 -->
          <div style="text-align: center; margin-bottom: var(--space-lg);">
            <span class="badge" style="background: ${dim.color}20; color: ${dim.color}; font-size: var(--font-size-sm); padding: 6px 16px;">
              <i class="fas ${dim.icon}"></i> ${dim.name}
            </span>
          </div>

          <!-- 题目卡片 -->
          <div class="question-card" id="question-card">
            <div class="question-number">${this._getGlobalQIndex() + 1}</div>
            <div class="question-text">${currentQ.question}</div>
            ${currentQ.hint ? `<div class="question-hint"><i class="fas fa-info-circle"></i> ${currentQ.hint}</div>` : ''}

            <div class="option-list ${currentQ.type === 'multi' ? 'multi-select' : ''}" id="option-list">
              ${this._renderOptions(currentQ)}
            </div>

            ${currentQ.type === 'scale' ? this._renderScale(currentQ) : ''}
            ${currentQ.type === 'text' ? this._renderText(currentQ) : ''}
          </div>

          <!-- 导航按钮 -->
          <div class="question-nav">
            <button class="btn btn-secondary" id="btn-prev" ${this._canGoPrev() ? '' : 'disabled'}>
              <i class="fas fa-arrow-left"></i> 上一题
            </button>
            <span class="question-counter">
              第 ${this.currentQuestionIndex + 1}/${questions.length} 题 · ${dim.name}
            </span>
            ${isLastOverall ? `
              <button class="btn btn-primary btn-lg" id="btn-submit" ${answeredCount >= totalQuestions ? '' : 'disabled'}>
                <i class="fas fa-check-circle"></i> 提交评估
              </button>
            ` : `
              <button class="btn btn-primary" id="btn-next" ${hasCurrentAnswer ? '' : 'disabled'}>
                ${isLastQ ? '下一维度' : '下一题'} <i class="fas fa-arrow-right"></i>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  _hasAnswer(q) {
    const answer = this.answers[q.id];
    if (answer === undefined || answer === null) return false;
    if (q.type === 'multi') {
      return Array.isArray(answer) && answer.length > 0;
    }
    if (q.type === 'text') {
      return typeof answer === 'string' && answer.trim().length > 0;
    }
    return true;
  },

  _renderOptions(q) {
    if (q.type === 'scale' || q.type === 'text') return '';

    const isMulti = q.type === 'multi';
    const currentAnswer = this.answers[q.id];

    return q.options.map(opt => {
      let isSelected = false;
      if (isMulti) {
        isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(String(opt.value));
      } else {
        isSelected = String(currentAnswer) === String(opt.value);
      }

      return `
        <div class="option-item ${isSelected ? 'selected' : ''}" data-value="${opt.value}">
          <div class="option-radio"></div>
          <span class="option-text">${opt.text}</span>
        </div>
      `;
    }).join('');
  },

  _renderScale(q) {
    const currentValue = this.answers[q.id] || 0;
    const labels = [];
    for (let i = q.min; i <= q.max; i++) {
      labels.push(`
        <div class="scale-point ${currentValue === i ? 'selected' : ''}" data-value="${i}" style="
          display: flex; flex-direction: column; align-items: center; cursor: pointer;
          padding: 8px 12px; border-radius: var(--radius-md); transition: all var(--transition-fast);
          ${currentValue === i ? 'background: var(--color-primary-bg); color: var(--color-primary); font-weight: 700;' : ''}
          min-width: 36px;
        ">
          <span style="font-size: var(--font-size-lg);">${i}</span>
        </div>
      `);
    }

    return `
      <div style="margin-top: var(--space-lg);">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 4px; flex-wrap: wrap;" id="scale-container">
          ${labels.join('')}
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: var(--space-sm); font-size: var(--font-size-xs); color: var(--color-text-muted);">
          <span>${q.min} - 非常不满意</span>
          <span>${q.max} - 非常满意</span>
        </div>
        ${currentValue > 0 ? `<div style="text-align: center; margin-top: var(--space-md); font-size: var(--font-size-lg); font-weight: 700; color: var(--color-primary);">您选择了: ${currentValue}</div>` : ''}
      </div>
    `;
  },

  _renderText(q) {
    const currentValue = this.answers[q.id] || '';
    return `
      <div style="margin-top: var(--space-lg);">
        <textarea class="form-textarea" id="text-answer" rows="3" placeholder="请输入您的回答...">${currentValue}</textarea>
        <div class="text-sm text-muted mt-sm">${q.hint || ''}</div>
      </div>
    `;
  },

  _getGlobalQIndex() {
    let count = 0;
    for (let i = 0; i < this.currentDimensionIndex; i++) {
      count += (this.questionsByDim[this.dimOrder[i]] || []).length;
    }
    count += this.currentQuestionIndex;
    return count;
  },

  _canGoPrev() {
    return !(this.currentDimensionIndex === 0 && this.currentQuestionIndex === 0);
  },

  _saveProgress() {
    Storage.saveQuestionnaireProgress({
      answers: this.answers,
      currentDimensionIndex: this.currentDimensionIndex,
      currentQuestionIndex: this.currentQuestionIndex,
      savedAt: new Date().toISOString()
    });
  },

  _goNext() {
    const dimId = this.dimOrder[this.currentDimensionIndex];
    const questions = this.questionsByDim[dimId];

    if (this.currentQuestionIndex < questions.length - 1) {
      this.currentQuestionIndex++;
    } else if (this.currentDimensionIndex < this.dimOrder.length - 1) {
      this.currentDimensionIndex++;
      this.currentQuestionIndex = 0;
    }
    this._saveProgress();
    this._rerender();
  },

  _goPrev() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    } else if (this.currentDimensionIndex > 0) {
      this.currentDimensionIndex--;
      const prevQuestions = this.questionsByDim[this.dimOrder[this.currentDimensionIndex]];
      this.currentQuestionIndex = (prevQuestions || []).length - 1;
    }
    this._saveProgress();
    this._rerender();
  },

  _jumpToDim(index) {
    this.currentDimensionIndex = index;
    this.currentQuestionIndex = 0;
    this._saveProgress();
    this._rerender();
  },

  // 强制重新渲染当前页面（绕过 hash 不变问题）
  _rerender() {
    const pageEl = document.getElementById('page-questionnaire');
    if (!pageEl) return;

    pageEl.innerHTML = this.render();
    this.afterRender();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  afterRender() {
    const dimId = this.dimOrder[this.currentDimensionIndex];
    const questions = this.questionsByDim[dimId];
    if (!questions || questions.length === 0) return;

    const currentQ = questions[this.currentQuestionIndex];
    if (!currentQ) return;

    // ===== 绑定选项点击（单选/多选） =====
    const optionList = document.getElementById('option-list');
    if (optionList) {
      optionList.addEventListener('click', (e) => {
        const item = e.target.closest('.option-item');
        if (!item) return;

        const rawValue = item.dataset.value;
        const q = currentQ;

        if (q.type === 'multi') {
          // 多选题：切换选择
          let current = this.answers[q.id];
          if (!Array.isArray(current)) current = [];
          const strValue = String(rawValue);
          const idx = current.indexOf(strValue);
          if (idx >= 0) {
            current.splice(idx, 1);
          } else {
            if ((q.id === 'M8' || q.id === 'G2') && current.length >= 3) {
              Toast.warning('最多选择3项');
              return;
            }
            current.push(strValue);
          }
          this.answers[q.id] = current;
          // 刷新选项显示
          this._refreshOptions(q);
        } else {
          // 单选题：直接设置
          this.answers[q.id] = String(rawValue);
          // 更新UI
          optionList.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');
        }

        // 启用下一题按钮
        const btnNext = document.getElementById('btn-next');
        const btnSubmit = document.getElementById('btn-submit');
        if (btnNext) btnNext.disabled = false;
        if (btnSubmit) {
          const totalAnswered = Object.keys(this.answers).length;
          btnSubmit.disabled = totalAnswered < QUESTIONNAIRE.length;
        }

        this._saveProgress();
      });
    }

    // ===== 绑定量表点击 =====
    const scaleContainer = document.getElementById('scale-container');
    if (scaleContainer) {
      scaleContainer.addEventListener('click', (e) => {
        const point = e.target.closest('.scale-point');
        if (!point) return;

        const value = parseInt(point.dataset.value);
        this.answers[currentQ.id] = value;

        // 更新量表 UI
        scaleContainer.querySelectorAll('.scale-point').forEach(el => {
          const v = parseInt(el.dataset.value);
          el.classList.toggle('selected', v === value);
          el.style.background = v === value ? 'var(--color-primary-bg)' : '';
          el.style.color = v === value ? 'var(--color-primary)' : '';
          el.style.fontWeight = v === value ? '700' : '';
        });

        // 更新"您选择了"文字
        const card = document.getElementById('question-card');
        const existing = card.querySelector('.scale-selected-text');
        if (existing) existing.remove();
        const textEl = document.createElement('div');
        textEl.className = 'scale-selected-text';
        textEl.style.cssText = 'text-align: center; margin-top: var(--space-md); font-size: var(--font-size-lg); font-weight: 700; color: var(--color-primary);';
        textEl.textContent = `您选择了: ${value}`;
        card.appendChild(textEl);

        const btnNext = document.getElementById('btn-next');
        const btnSubmit = document.getElementById('btn-submit');
        if (btnNext) btnNext.disabled = false;
        if (btnSubmit) {
          const totalAnswered = Object.keys(this.answers).length;
          btnSubmit.disabled = totalAnswered < QUESTIONNAIRE.length;
        }

        this._saveProgress();
      });
    }

    // ===== 绑定文字输入 =====
    const textAnswer = document.getElementById('text-answer');
    if (textAnswer) {
      textAnswer.addEventListener('input', () => {
        this.answers[currentQ.id] = textAnswer.value;
        const btnNext = document.getElementById('btn-next');
        const btnSubmit = document.getElementById('btn-submit');
        if (btnNext) btnNext.disabled = !textAnswer.value.trim();
        if (btnSubmit) {
          const totalAnswered = Object.keys(this.answers).length;
          btnSubmit.disabled = totalAnswered < QUESTIONNAIRE.length;
        }
        this._saveProgress();
      });
    }

    // ===== 绑定导航按钮 =====
    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => this._goPrev());
    }

    const btnNext = document.getElementById('btn-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => this._goNext());
    }

    const btnSubmit = document.getElementById('btn-submit');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => this._handleSubmit());
    }

    // ===== 绑定步骤指示器点击 =====
    const steps = document.querySelectorAll('.q-step[data-dim-index]');
    steps.forEach(step => {
      step.addEventListener('click', () => {
        const index = parseInt(step.dataset.dimIndex);
        this._jumpToDim(index);
      });
    });
  },

  _refreshOptions(q) {
    const optionList = document.getElementById('option-list');
    if (!optionList) return;

    const currentAnswer = this.answers[q.id] || [];
    const isMulti = q.type === 'multi';

    optionList.querySelectorAll('.option-item').forEach(item => {
      const value = String(item.dataset.value);
      let isSelected = false;
      if (isMulti) {
        isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(value);
      } else {
        isSelected = String(currentAnswer) === value;
      }
      item.classList.toggle('selected', isSelected);
    });
  },

  _handleSubmit() {
    const totalQuestions = QUESTIONNAIRE.length;
    const answeredCount = Object.keys(this.answers).length;

    if (answeredCount < totalQuestions) {
      Modal.confirm({
        title: '确认提交',
        message: `您已完成 ${answeredCount}/${totalQuestions} 题，还有 ${totalQuestions - answeredCount} 题未回答。未回答的题目将不计分。确定提交吗？`,
        confirmText: '确认提交',
        onConfirm: () => this._doSubmit()
      });
    } else {
      this._doSubmit();
    }
  },

  _doSubmit() {
    // 计算评分
    const scores = ScoringEngine.calculate(this.answers);

    // 生成专家分析
    const analyses = ExpertAnalysisEngine.generateAll(scores, this.answers);

    // 生成总协调师分析
    const coordinator = CoordinatorEngine.generate(scores, analyses);

    // 保存用户画像
    const profile = {
      answers: this.answers,
      scores: scores,
      analyses: analyses,
      coordinator: coordinator,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    Storage.saveProfile(profile);

    // 添加到评估历史
    Storage.addAssessment({
      overallPercentage: scores.overall.percentage,
      grade: scores.overall.grade.key,
      scores: scores.dimensions,
      answeredCount: scores.answeredCount
    });

    // 清除问卷进度
    Storage.clearQuestionnaireProgress();

    // 重置状态
    this.answers = {};
    this.currentDimensionIndex = 0;
    this.currentQuestionIndex = 0;

    // 跳转到报告页
    Toast.success('评估完成！正在生成综合报告...');
    setTimeout(() => {
      App.router.navigate('#/report');
    }, 500);
  }
};
