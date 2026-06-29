// ============================================================
// 进度环组件 (纯 SVG)
// ============================================================

const ProgressRing = {
  create({ percentage = 0, color = '#6366F1', size = 120, strokeWidth = 8, label = '', showValue = true }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const wrapper = DOM.create('div', {
      className: 'progress-ring',
      style: { width: size + 'px', height: size + 'px' }
    });

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);

    // 背景圆环
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', size / 2);
    bgCircle.setAttribute('cy', size / 2);
    bgCircle.setAttribute('r', radius);
    bgCircle.setAttribute('fill', 'none');
    bgCircle.setAttribute('stroke', '#E2E8F0');
    bgCircle.setAttribute('stroke-width', strokeWidth);

    // 进度圆环
    const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressCircle.setAttribute('cx', size / 2);
    progressCircle.setAttribute('cy', size / 2);
    progressCircle.setAttribute('r', radius);
    progressCircle.setAttribute('fill', 'none');
    progressCircle.setAttribute('stroke', color);
    progressCircle.setAttribute('stroke-width', strokeWidth);
    progressCircle.setAttribute('stroke-linecap', 'round');
    progressCircle.setAttribute('stroke-dasharray', circumference);
    progressCircle.setAttribute('stroke-dashoffset', circumference);
    progressCircle.setAttribute('transform', `rotate(-90 ${size/2} ${size/2})`);

    // 动画
    setTimeout(() => {
      progressCircle.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)';
      progressCircle.setAttribute('stroke-dashoffset', offset);
    }, 100);

    svg.appendChild(bgCircle);
    svg.appendChild(progressCircle);
    wrapper.appendChild(svg);

    // 文字
    const textDiv = DOM.create('div', { className: 'progress-ring-text' });
    if (showValue) {
      textDiv.appendChild(DOM.create('span', {
        className: 'progress-ring-value',
        textContent: Math.round(percentage).toString()
      }));
    }
    if (label) {
      textDiv.appendChild(DOM.create('span', {
        className: 'progress-ring-label',
        textContent: label
      }));
    }
    wrapper.appendChild(textDiv);

    return wrapper;
  }
};
