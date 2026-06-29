// ============================================================
// Toast 组件
// ============================================================

const Toast = {
  _container: null,

  _getContainer() {
    if (!this._container) {
      this._container = DOM.create('div', { className: 'toast-container' });
      document.body.appendChild(this._container);
    }
    return this._container;
  },

  show(message, type = 'info', duration = 3000) {
    const container = this._getContainer();
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    const toast = DOM.create('div', {
      className: `toast toast-${type}`
    }, [
      DOM.create('i', { className: `fas ${icons[type]} toast-icon` }),
      DOM.create('span', { className: 'toast-message', textContent: message }),
      DOM.create('button', {
        className: 'toast-close',
        innerHTML: '&times;',
        onClick: () => this._remove(toast)
      })
    ]);

    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => this._remove(toast), duration);
    }

    return toast;
  },

  success(message, duration) {
    return this.show(message, 'success', duration);
  },

  error(message, duration) {
    return this.show(message, 'error', duration);
  },

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  },

  info(message, duration) {
    return this.show(message, 'info', duration);
  },

  _remove(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('toast-exit');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }
};
