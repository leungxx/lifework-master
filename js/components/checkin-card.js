// ============================================================
// 打卡卡片组件
// ============================================================

const CheckinCard = {
  render(metric, currentValue) {
    const isCompleted = currentValue !== undefined && currentValue !== null;
    const color = metric.color;

    let valueHtml = '';
    switch (metric.type) {
      case 'stars':
        valueHtml = this._renderStars(metric, currentValue);
        break;
      case 'mood':
        valueHtml = this._renderMood(metric, currentValue);
        break;
      case 'multi':
        valueHtml = this._renderMulti(metric, currentValue);
        break;
      case 'scale':
        valueHtml = this._renderScaleDisplay(metric, currentValue);
        break;
      case 'select':
        valueHtml = this._renderSelectDisplay(metric, currentValue);
        break;
    }

    return `
      <div class="checkin-card ${isCompleted ? 'completed' : ''}" data-metric="${metric.id}" style="--card-color: ${color};">
        <div class="checkin-card-header">
          <div class="checkin-card-icon" style="background: ${color}15; color: ${color};">
            <i class="fas ${metric.icon}"></i>
          </div>
          <div class="checkin-card-info">
            <div class="checkin-card-name">${metric.name}</div>
            <div class="checkin-card-desc">${metric.description}</div>
          </div>
          <div class="checkin-card-status">
            ${isCompleted ? '<i class="fas fa-check-circle" style="color: var(--color-success); font-size: 22px;"></i>' : '<span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">未记录</span>'}
          </div>
        </div>
        <div class="checkin-card-body" id="checkin-body-${metric.id}">
          ${valueHtml}
        </div>
        ${!isCompleted && metric.type === 'scale' ? `
          <div class="checkin-card-actions" id="checkin-scale-${metric.id}">
            ${this._renderScaleInput(metric, currentValue)}
          </div>
        ` : ''}
        ${!isCompleted && metric.type === 'select' ? `
          <div class="checkin-card-actions" id="checkin-select-${metric.id}">
            ${this._renderSelectInput(metric, currentValue)}
          </div>
        ` : ''}
        ${!isCompleted && metric.type === 'stars' ? `
          <div class="checkin-card-actions" id="checkin-stars-${metric.id}">
            ${this._renderStarsInput(metric, currentValue)}
          </div>
        ` : ''}
        ${!isCompleted && metric.type === 'mood' ? `
          <div class="checkin-card-actions" id="checkin-mood-${metric.id}">
            ${this._renderMoodInput(metric, currentValue)}
          </div>
        ` : ''}
        ${!isCompleted && metric.type === 'multi' ? `
          <div class="checkin-card-actions" id="checkin-multi-${metric.id}">
            ${this._renderMultiInput(metric, currentValue)}
          </div>
        ` : ''}
      </div>
    `;
  },

  _renderStars(metric, value) {
    if (!value && value !== 0) return '';
    const stars = [];
    for (let i = 1; i <= metric.max; i++) {
      stars.push(`<i class="fas fa-star" style="color: ${i <= value ? '#F59E0B' : '#E2E8F0'}; font-size: 20px;"></i>`);
    }
    return `<div class="checkin-value-display">${stars.join('')}</div>`;
  },

  _renderStarsInput(metric) {
    const stars = [];
    for (let i = 1; i <= metric.max; i++) {
      stars.push(`<span class="star-btn" data-value="${i}"><i class="far fa-star"></i></span>`);
    }
    return `<div class="star-input">${stars.join('')}</div>`;
  },

  _renderMood(metric, value) {
    if (!value) return '';
    const opt = metric.options.find(o => o.value === value);
    return `<div class="checkin-value-display" style="font-size: var(--font-size-xl);">${opt ? opt.label : value}</div>`;
  },

  _renderMoodInput(metric) {
    return metric.options.map(opt => `
      <button class="mood-btn" data-value="${opt.value}">
        <span style="font-size: 28px;">${opt.label.split(' ')[0]}</span>
        <span style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${opt.label.split(' ').slice(1).join(' ')}</span>
      </button>
    `).join('');
  },

  _renderMulti(metric, value) {
    if (!value || !Array.isArray(value) || value.length === 0) return '';
    const selected = metric.options.filter(o => value.includes(o.value));
    return `<div class="checkin-value-display" style="font-size: var(--font-size-sm);">${selected.map(o => o.label.split(' ').slice(1).join(' ')).join(' · ')}</div>`;
  },

  _renderMultiInput(metric) {
    return metric.options.map(opt => `
      <button class="multi-btn" data-value="${opt.value}">
        ${opt.label}
      </button>
    `).join('');
  },

  _renderScaleDisplay(metric, value) {
    if (!value && value !== 0) return '';
    return `<div class="checkin-value-display" style="font-size: var(--font-size-2xl); font-weight: 700; color: ${metric.color};">${value}<span style="font-size: var(--font-size-sm); color: var(--color-text-secondary); font-weight: 400;"> / ${metric.max}</span></div>`;
  },

  _renderScaleInput(metric) {
    const buttons = [];
    for (let i = metric.min; i <= metric.max; i++) {
      buttons.push(`<button class="scale-btn" data-value="${i}">${i}</button>`);
    }
    return `<div class="scale-input">${buttons.join('')}</div>`;
  },

  _renderSelectDisplay(metric, value) {
    if (value === undefined || value === null) return '';
    const opt = metric.options.find(o => String(o.value) === String(value));
    return `<div class="checkin-value-display" style="font-size: var(--font-size-lg); font-weight: 600; color: ${metric.color};">${opt ? opt.label : value}${metric.unit ? ' ' + metric.unit : ''}</div>`;
  },

  _renderSelectInput(metric) {
    return metric.options.map(opt => `
      <button class="select-btn" data-value="${opt.value}">${opt.label}</button>
    `).join('');
  }
};
