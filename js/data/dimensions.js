// ============================================================
// 六维度数据定义
// ============================================================

const DIMENSIONS = {
  mental: {
    id: 'mental',
    name: '心理健康',
    icon: 'fa-brain',
    color: '#8B5CF6',
    colorLight: '#A78BFA',
    description: '情绪管理、压力应对、心理韧性、正念练习',
    experts: ['counselor', 'mindfulness', 'resilience'],
    subMetrics: [
      { key: 'anxiety', name: '焦虑水平', maxScore: 5 },
      { key: 'resilience', name: '心理韧性', maxScore: 5 },
      { key: 'mindfulness', name: '正念状态', maxScore: 5 },
      { key: 'awareness', name: '情绪觉察', maxScore: 5 }
    ]
  },
  life: {
    id: 'life',
    name: '生活健康',
    icon: 'fa-heart',
    color: '#EC4899',
    colorLight: '#F472B6',
    description: '睡眠、饮食、生活习惯、时间分配',
    experts: ['planner', 'nutritionist', 'sleep'],
    subMetrics: [
      { key: 'sleep', name: '睡眠质量', maxScore: 5 },
      { key: 'diet', name: '饮食规律', maxScore: 5 },
      { key: 'hydration', name: '饮水习惯', maxScore: 5 },
      { key: 'schedule', name: '时间掌控', maxScore: 5 }
    ]
  },
  physical: {
    id: 'physical',
    name: '身体健康',
    icon: 'fa-dumbbell',
    color: '#F59E0B',
    colorLight: '#FBBF24',
    description: '运动健身、体能指标、身体保养',
    experts: ['rehab', 'fitness', 'tcm'],
    subMetrics: [
      { key: 'exercise', name: '运动频率', maxScore: 5 },
      { key: 'endurance', name: '心肺耐力', maxScore: 5 },
      { key: 'posture', name: '体态状况', maxScore: 5 },
      { key: 'sedentary', name: '久坐程度', maxScore: 5 }
    ]
  },
  beauty: {
    id: 'beauty',
    name: '美丽管理',
    icon: 'fa-spa',
    color: '#10B981',
    colorLight: '#34D399',
    description: '皮肤护理、形象管理、体态气质',
    experts: ['image', 'skincare'],
    subMetrics: [
      { key: 'style', name: '风格定位', maxScore: 4 },
      { key: 'skin', name: '皮肤状态', maxScore: 5 },
      { key: 'skincare_habit', name: '护肤习惯', maxScore: 5 },
      { key: 'posture_satisfaction', name: '体态满意度', maxScore: 5 }
    ]
  },
  productivity: {
    id: 'productivity',
    name: '工作效率',
    icon: 'fa-bolt',
    color: '#3B82F6',
    colorLight: '#60A5FA',
    description: '时间管理、任务优先级、专注力、工具方法',
    experts: ['efficiency', 'energy'],
    subMetrics: [
      { key: 'deep_work', name: '深度工作', maxScore: 5 },
      { key: 'distraction', name: '干扰程度', maxScore: 5 },
      { key: 'completion', name: '任务完成率', maxScore: 5 },
      { key: 'time_pressure', name: '时间压力', maxScore: 5 }
    ]
  },
  goal: {
    id: 'goal',
    name: '目标管理',
    icon: 'fa-bullseye',
    color: '#EF4444',
    colorLight: '#F87171',
    description: '目标设定、进度追踪、复盘反思',
    experts: ['architect', 'tracker', 'reflector'],
    subMetrics: [
      { key: 'clarity', name: '目标清晰度', maxScore: 4 },
      { key: 'coverage', name: '目标覆盖', maxScore: 5 },
      { key: 'review', name: '复盘频率', maxScore: 5 },
      { key: 'achievement', name: '达成满意度', maxScore: 10 }
    ]
  }
};
