// ============================================================
// 任务卡片组件
// ============================================================

const TaskCard = {
  render(task, index) {
    const isDone = task.done;
    const delayedDays = task.delayedDays || 0;

    return `
      <div class="task-card ${isDone ? 'task-done' : ''}" data-index="${index}">
        <div class="task-check" onclick="ActionPage.toggleTask(${index})">
          ${isDone ? '<i class="fas fa-check-circle"></i>' : '<i class="far fa-circle"></i>'}
        </div>
        <div class="task-content">
          <div class="task-text ${isDone ? 'text-done' : ''}">${task.text || '（点击编辑）'}</div>
          <div class="task-meta">
            ${delayedDays > 0 ? `<span class="badge badge-warning">已拖延${delayedDays}天</span>` : ''}
            ${task.pomodoros > 0 ? `<span class="badge badge-info">🍅 ×${task.pomodoros}</span>` : ''}
          </div>
        </div>
        <div class="task-actions">
          ${!isDone ? `<button class="task-action-btn" onclick="ActionPage.startPomodoro(${index})" title="开始番茄钟"><i class="fas fa-clock"></i></button>` : ''}
          <button class="task-action-btn task-delete" onclick="ActionPage.removeTask(${index})" title="删除"><i class="fas fa-times"></i></button>
        </div>
      </div>
    `;
  },

  renderInbox(item, index) {
    return `
      <div class="inbox-item" data-index="${index}">
        <span class="inbox-text">${item.text}</span>
        <div class="inbox-actions">
          <button class="inbox-btn promote" onclick="ActionPage.promoteFromInbox(${index})" title="提升为今日任务">
            <i class="fas fa-arrow-up"></i>
          </button>
          <button class="inbox-btn delete" onclick="ActionPage.removeFromInbox(${index})" title="删除">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  }
};
