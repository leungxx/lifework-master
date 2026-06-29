// ============================================================
// DOM 操作工具
// ============================================================

const DOM = {
  // 选择器
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  $$(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  // 创建元素
  create(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        el.className = value;
      } else if (key === 'innerHTML') {
        el.innerHTML = value;
      } else if (key === 'textContent') {
        el.textContent = value;
      } else if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key === 'dataset') {
        Object.assign(el.dataset, value);
      } else {
        el.setAttribute(key, value);
      }
    });

    if (typeof children === 'string') {
      el.textContent = children;
    } else {
      children.forEach(child => {
        if (typeof child === 'string') {
          el.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          el.appendChild(child);
        }
      });
    }

    return el;
  },

  // 渲染 HTML
  render(container, html) {
    if (typeof container === 'string') {
      container = this.$(container);
    }
    if (container) {
      container.innerHTML = html;
    }
    return container;
  },

  // 追加 HTML
  append(container, html) {
    if (typeof container === 'string') {
      container = this.$(container);
    }
    if (container) {
      container.insertAdjacentHTML('beforeend', html);
    }
    return container;
  },

  // 清空
  empty(container) {
    if (typeof container === 'string') {
      container = this.$(container);
    }
    if (container) {
      container.innerHTML = '';
    }
    return container;
  },

  // 显示/隐藏
  show(el) {
    if (typeof el === 'string') el = this.$(el);
    if (el) el.classList.remove('hidden');
  },

  hide(el) {
    if (typeof el === 'string') el = this.$(el);
    if (el) el.classList.add('hidden');
  },

  toggle(el, force) {
    if (typeof el === 'string') el = this.$(el);
    if (el) el.classList.toggle('hidden', force);
  },

  // 类名操作
  addClass(el, ...classes) {
    if (typeof el === 'string') el = this.$(el);
    if (el) el.classList.add(...classes);
  },

  removeClass(el, ...classes) {
    if (typeof el === 'string') el = this.$(el);
    if (el) el.classList.remove(...classes);
  },

  // 事件委托
  delegate(parent, selector, event, handler) {
    if (typeof parent === 'string') parent = this.$(parent);
    if (!parent) return;
    parent.addEventListener(event, (e) => {
      const target = e.target.closest(selector);
      if (target && parent.contains(target)) {
        handler.call(target, e, target);
      }
    });
  }
};
