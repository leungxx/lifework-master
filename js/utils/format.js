// ============================================================
// 格式化工具
// ============================================================

const Format = {
  date(dateStr) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  dateTime(dateStr) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    const date = this.date(dateStr);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${date} ${hours}:${minutes}`;
  },

  percentage(value, decimals = 0) {
    if (value === null || value === undefined) return '--';
    return Number(value).toFixed(decimals) + '%';
  },

  score(value) {
    if (value === null || value === undefined) return '--';
    return Math.round(value);
  },

  // 获取等级
  getGrade(score) {
    for (const grade of CONFIG.GRADES) {
      if (score >= grade.min) return grade;
    }
    return CONFIG.GRADES[CONFIG.GRADES.length - 1];
  },

  // 获取等级标签 HTML
  gradeBadge(score) {
    const grade = this.getGrade(score);
    return `<span class="badge ${grade.color}">${grade.label}</span>`;
  },

  // 相对时间
  relativeTime(dateStr) {
    if (!dateStr) return '--';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 30) return `${diffDays}天前`;
    return this.date(dateStr);
  },

  // 数字千分位
  number(value) {
    if (value === null || value === undefined) return '--';
    return Number(value).toLocaleString('zh-CN');
  }
};
