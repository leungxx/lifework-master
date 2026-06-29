// ============================================================
// 任务与行动系统 - 数据结构
// ============================================================

// 预设微行动（拖延粉碎机用）
const MICRO_ACTIONS = [
  '打开文档/应用，只打开就好',
  '写下第一句话，哪怕只是标题',
  '站起来，绕房间走一圈',
  '深呼吸3次，然后倒数 3-2-1-开始',
  '整理桌面，只整理5分钟',
  '给自己倒一杯水',
  '写下"我现在要做什么"的答案',
  '设置一个5分钟倒计时，只做5分钟',
  '把手机翻过去，屏幕朝下',
  '列出这件事只需要做的3个小步骤',
  '闭上眼睛，想象完成后的轻松感',
  '大声说出来："我现在就开始"',
  '打开音乐/白噪音，进入专注模式',
  '写下拖延的原因，只写一句话',
  '把大任务拆成3个5分钟的小任务'
];

// 仪式步骤定义
const RITUAL_STEPS = {
  morning: [
    { id: 'yesterday_review', title: '回顾昨日', question: '昨天完成了什么？感觉如何？', type: 'text' },
    { id: 'inbox_clear', title: '清空收件箱', question: '快速浏览收件箱，把今天要做的挑出来', type: 'action', action: 'review_inbox' },
    { id: 'set_mit', title: '设定今日三件事', question: '今天最重要的三件事是什么？', type: 'mit_setup' },
    { id: 'energy_check', title: '精力预估', question: '今天感觉精力如何？', type: 'scale', min: 1, max: 10 }
  ],
  evening: [
    { id: 'today_review', title: '今日回顾', question: '今天完成了什么？有什么感受？', type: 'text' },
    { id: 'unfinished_reason', title: '未完成分析', question: '如果有没完成的，原因是什么？（不是自责，是分析）', type: 'text' },
    { id: 'tomorrow_prep', title: '明日预判', question: '明天最重要的第一件事是什么？', type: 'text' },
    { id: 'gratitude', title: '感恩一刻', question: '今天有什么值得感谢的？哪怕很小', type: 'text' }
  ]
};

// 督促级别
const NUDGE_LEVELS = {
  daily: {
    message: '今天的三件事还没全部完成哦，现在还有时间！',
    icon: 'fa-clock',
    color: '#F59E0B'
  },
  streak3: {
    message: '已经连续3天没有完成了。我们一起看看是什么在阻碍你？',
    icon: 'fa-exclamation-triangle',
    color: '#EF4444'
  },
  streak7: {
    message: '我们需要认真谈谈。连续7天没有完成目标，这说明当前策略需要调整。请花5分钟回顾一下这周。',
    icon: 'fa-exclamation-circle',
    color: '#DC2626'
  }
};

// 里程碑奖励
const MILESTONES = [
  { days: 3, label: '🔥 3天连续完成！好的开始！', emoji: '🎉' },
  { days: 7, label: '⭐ 一周全勤！你开始建立节奏了', emoji: '🌟' },
  { days: 21, label: '💎 21天！习惯初步形成', emoji: '💎' },
  { days: 30, label: '👑 一个月！这已经不是偶然了', emoji: '👑' },
  { days: 66, label: '🏆 66天！习惯已稳固，你做到了', emoji: '🏆' }
];
