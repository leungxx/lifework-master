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
    remindBefore: 1,
    notes: '每42天一次'
  },
  {
    id: 'photon_facial',
    title: '光子嫩肤',
    category: 'beauty',
    icon: 'fa-spa',
    color: '#EC4899',
    intervalDays: 30,
    nextDate: '2026-07-25',
    remindBefore: 1,
    notes: '每月25日去美容院'
  },
  {
    id: 'ultrasound_check',
    title: '乳腺+甲状腺B超检查',
    category: 'health',
    icon: 'fa-heart',
    color: '#10B981',
    intervalDays: 90,
    nextDate: '2026-09-27',
    remindBefore: 1,
    notes: '每3个月一次，今天(6/29)刚查完'
  },
  {
    id: 'weight_loss_plan',
    title: '减肥计划：晨练+夜跑',
    category: 'health',
    icon: 'fa-fire',
    color: '#F59E0B',
    intervalDays: null,
    nextDate: '2026-07-31',
    remindBefore: 0,
    notes: '6/29-7/31：早晨跟萍宝训练，晚上跑步(第1周3km→之后5km)，每周一体重'
  }
];

// 减肥计划配置
const WEIGHT_LOSS_PLAN = {
  startDate: '2026-06-29',
  endDate: '2026-07-31',
  phases: [
    { name: '适应期', start: '2026-06-29', end: '2026-07-05', morning: '跟萍宝训练', evening: '跑步3公里' },
    { name: '提升期', start: '2026-07-06', end: '2026-07-12', morning: '跟萍宝训练', evening: '跑步5公里' },
    { name: '冲刺期', start: '2026-07-13', end: '2026-07-31', morning: '跟萍宝训练', evening: '跑步5公里 + 称体重' }
  ],
  rules: [
    '跑前热身5分钟 + 跑后拉伸5分钟',
    '每周至少休息1天',
    '每周一早晨空腹称体重',
    '跑了3公里也比没跑强 — 不要因为没跑够就放弃'
  ],
  restDays: ['周日'] // 建议休息日
};

// 提醒类别
const REMINDER_CATEGORIES = [
  { id: 'beauty', name: '美丽管理', icon: 'fa-spa', color: '#EC4899' },
  { id: 'health', name: '健康管理', icon: 'fa-heart', color: '#10B981' },
  { id: 'work', name: '工作事务', icon: 'fa-briefcase', color: '#3B82F6' },
  { id: 'life', name: '生活事务', icon: 'fa-home', color: '#F59E0B' },
  { id: 'social', name: '社交关系', icon: 'fa-users', color: '#8B5CF6' },
  { id: 'other', name: '其他', icon: 'fa-tag', color: '#64748B' }
];
