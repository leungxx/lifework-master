// ============================================================
// 全局配置常量
// ============================================================

const CONFIG = {
  APP_NAME: 'LifeWork Master',
  APP_VERSION: '2.0.0',
  STORAGE_PREFIX: 'lwm_',

  // 存储键名
  STORAGE_KEYS: {
    SETTINGS: 'settings',
    LAST_ACTIVE_PAGE: 'last_active_page',
    CHECKIN_DATA: 'checkin_data',
    INBOX: 'inbox',
    DAILY_TASKS: 'daily_tasks',
    POMODORO_LOG: 'pomodoro_log',
    RITUAL_LOG: 'ritual_log'
  },

  // 维度定义
  DIMENSIONS: [
    { id: 'mental', name: '心理健康', icon: 'fa-brain', color: '#8B5CF6', colorLight: '#A78BFA' },
    { id: 'life', name: '生活健康', icon: 'fa-heart', color: '#EC4899', colorLight: '#F472B6' },
    { id: 'physical', name: '身体健康', icon: 'fa-dumbbell', color: '#F59E0B', colorLight: '#FBBF24' },
    { id: 'beauty', name: '美丽管理', icon: 'fa-spa', color: '#10B981', colorLight: '#34D399' },
    { id: 'productivity', name: '工作效率', icon: 'fa-bolt', color: '#3B82F6', colorLight: '#60A5FA' },
    { id: 'goal', name: '目标管理', icon: 'fa-bullseye', color: '#EF4444', colorLight: '#F87171' }
  ],

  // 页面路由
  ROUTES: {
    home: { path: '#/', title: '仪表盘', icon: 'fa-chart-pie' },
    checkin: { path: '#/checkin', title: '每日打卡', icon: 'fa-calendar-check' },
    action: { path: '#/action', title: '行动中心', icon: 'fa-bolt' },
    reminders: { path: '#/reminders', title: '提醒中心', icon: 'fa-bell' },
    coach: { path: '#/coach', title: '效能教练', icon: 'fa-user-tie' }
  }
};
