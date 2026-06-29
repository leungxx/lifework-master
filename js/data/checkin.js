// ============================================================
// 每日打卡指标定义
// ============================================================

const CHECKIN_METRICS = [
  {
    id: 'sleep_hours',
    name: '睡眠时长',
    icon: 'fa-moon',
    color: '#8B5CF6',
    type: 'select',
    description: '昨晚睡了多久？',
    options: [
      { value: 0, label: '不足4小时', score: 1 },
      { value: 4, label: '4-5小时', score: 2 },
      { value: 5, label: '5-6小时', score: 3 },
      { value: 6, label: '6-7小时', score: 4 },
      { value: 7, label: '7-8小时', score: 5 },
      { value: 8, label: '8-9小时', score: 4 },
      { value: 9, label: '9小时以上', score: 3 }
    ],
    unit: '小时'
  },
  {
    id: 'sleep_quality',
    name: '睡眠质量',
    icon: 'fa-star',
    color: '#A78BFA',
    type: 'stars',
    description: '昨晚睡得怎么样？',
    max: 5,
    unit: '星'
  },
  {
    id: 'exercise_minutes',
    name: '运动时长',
    icon: 'fa-dumbbell',
    color: '#F59E0B',
    type: 'select',
    description: '今天运动了多久？',
    options: [
      { value: 0, label: '没有运动', score: 1 },
      { value: 15, label: '15分钟', score: 2 },
      { value: 30, label: '30分钟', score: 3 },
      { value: 45, label: '45分钟', score: 4 },
      { value: 60, label: '60分钟', score: 5 },
      { value: 90, label: '90分钟', score: 5 },
      { value: 120, label: '120分钟以上', score: 5 }
    ],
    unit: '分钟'
  },
  {
    id: 'exercise_type',
    name: '运动类型',
    icon: 'fa-person-running',
    color: '#FBBF24',
    type: 'multi',
    description: '今天做了什么运动？',
    options: [
      { value: 'aerobic', label: '🏃 有氧', icon: 'fa-person-running' },
      { value: 'strength', label: '🏋️ 力量', icon: 'fa-dumbbell' },
      { value: 'flexibility', label: '🧘 柔韧', icon: 'fa-spa' },
      { value: 'walk', label: '🚶 步行', icon: 'fa-person-walking' },
      { value: 'none', label: '无运动' }
    ]
  },
  {
    id: 'mood',
    name: '情绪状态',
    icon: 'fa-face-smile',
    color: '#EC4899',
    type: 'mood',
    description: '今天整体心情如何？',
    options: [
      { value: 'good', label: '😊 心情不错', score: 5 },
      { value: 'okay', label: '😐 一般般', score: 3 },
      { value: 'bad', label: '😞 不太好', score: 1 }
    ]
  },
  {
    id: 'mood_score',
    name: '情绪评分',
    icon: 'fa-heart',
    color: '#F472B6',
    type: 'scale',
    description: '给自己的情绪打分（1-10）',
    min: 1,
    max: 10,
    unit: '分'
  },
  {
    id: 'water',
    name: '饮水情况',
    icon: 'fa-droplet',
    color: '#3B82F6',
    type: 'select',
    description: '今天喝了多少水？',
    options: [
      { value: 0, label: '不足500ml', score: 1 },
      { value: 500, label: '500-1000ml', score: 2 },
      { value: 1000, label: '1000-1500ml', score: 3 },
      { value: 1500, label: '1500-2000ml', score: 4 },
      { value: 2000, label: '2000ml以上', score: 5 }
    ],
    unit: 'ml'
  },
  {
    id: 'energy',
    name: '精力水平',
    icon: 'fa-bolt',
    color: '#10B981',
    type: 'scale',
    description: '今天整体精力如何？（1-10）',
    min: 1,
    max: 10,
    unit: '分'
  }
];

// 趋势图要展示的指标
const CHECKIN_TREND_METRICS = ['sleep_hours', 'exercise_minutes', 'mood_score', 'energy'];
