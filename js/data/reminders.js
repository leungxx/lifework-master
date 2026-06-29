// ============================================================
// 提醒中心 - 数据结构和预设提醒
// ============================================================

// 预设提醒模板（用户说过的会自动加到这里）
const PRESET_REMINDERS = [
  {
    id: 'bikini_wax',
    title: '比基尼脱毛',
    category: 'beauty',
    icon: 'fa-spa',
    color: '#EC4899',
    intervalDays: 42,
    nextDate: '2026-07-20',
    remindBefore: 1, // 提前1天提醒
    notes: '每42天一次'
  }
];

// 提醒类别
const REMINDER_CATEGORIES = [
  { id: 'beauty', name: '美丽管理', icon: 'fa-spa', color: '#EC4899' },
  { id: 'health', name: '健康管理', icon: 'fa-heart', color: '#10B981' },
  { id: 'work', name: '工作事务', icon: 'fa-briefcase', color: '#3B82F6' },
  { id: 'life', name: '生活事务', icon: 'fa-home', color: '#F59E0B' },
  { id: 'social', name: '社交关系', icon: 'fa-users', color: '#8B5CF6' },
  { id: 'other', name: '其他', icon: 'fa-tag', color: '#64748B' }
];
