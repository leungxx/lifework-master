// ============================================================
// Modal 组件
// ============================================================

const Modal = {
  show({ title, content, footer, onClose, size = 'medium' }) {
    const overlay = DOM.create('div', { className: 'modal-overlay' });
    const modal = DOM.create('div', { className: 'modal' });

    // Header
    const header = DOM.create('div', { className: 'modal-header' }, [
      DOM.create('h3', { className: 'modal-title', textContent: title }),
      DOM.create('button', {
        className: 'modal-close',
        innerHTML: '&times;',
        onClick: () => this.close(overlay, onClose)
      })
    ]);

    // Body
    const body = DOM.create('div', { className: 'modal-body' });
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (content instanceof Node) {
      body.appendChild(content);
    }

    modal.appendChild(header);
    modal.appendChild(body);

    // Footer
    if (footer) {
      const footerEl = DOM.create('div', { className: 'modal-footer' });
      if (typeof footer === 'string') {
        footerEl.innerHTML = footer;
      } else if (footer instanceof Node) {
        footerEl.appendChild(footer);
      }
      modal.appendChild(footerEl);
    }

    overlay.appendChild(modal);

    // 点击遮罩关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close(overlay, onClose);
      }
    });

    document.body.appendChild(overlay);
    return { overlay, modal };
  },

  close(overlay, callback) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s ease';
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (callback) callback();
    }, 200);
  },

  confirm({ title, message, confirmText = '确认', cancelText = '取消', onConfirm, onCancel }) {
    const content = DOM.create('p', { textContent: message });
    const footer = [
      DOM.create('button', {
        className: 'btn btn-secondary',
        textContent: cancelText,
        onClick: function() {
          const overlay = this.closest('.modal-overlay');
          Modal.close(overlay, onCancel);
        }
      }),
      DOM.create('button', {
        className: 'btn btn-primary',
        textContent: confirmText,
        onClick: function() {
          const overlay = this.closest('.modal-overlay');
          Modal.close(overlay, onConfirm);
        }
      })
    ];

    return this.show({ title, content, footer });
  }
};
