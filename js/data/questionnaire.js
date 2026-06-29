// ============================================================
// 44题综合评估问卷
// 每题: id, dimension, question, type(single/multi/text), options[], hint
// ============================================================

const QUESTIONNAIRE = [
  // ==================== 心理健康 (M1-M8, 共8题) ====================
  {
    id: 'M1',
    dimension: 'mental',
    metric: 'anxiety',
    question: '在过去两周中，您感到紧张、焦虑或不安的频率是？',
    type: 'single',
    options: [
      { value: 4, text: '几乎没有' },
      { value: 3, text: '偶尔（每周1-2天）' },
      { value: 2, text: '经常（每周3-4天）' },
      { value: 1, text: '几乎每天' }
    ]
  },
  {
    id: 'M2',
    dimension: 'mental',
    metric: 'resilience',
    question: '当遇到意外困难或挫折时，您通常能在多长时间内调整好心态？',
    type: 'single',
    options: [
      { value: 4, text: '很快，几乎立刻就能调整' },
      { value: 3, text: '需要几个小时' },
      { value: 2, text: '需要一两天' },
      { value: 1, text: '需要较长时间，甚至很难恢复' }
    ]
  },
  {
    id: 'M3',
    dimension: 'mental',
    metric: 'mindfulness',
    question: '在日常工作或生活中，您能专注于当下（不被杂念或手机带走）的时间占比大约是？',
    type: 'single',
    options: [
      { value: 4, text: '80%以上' },
      { value: 3, text: '60%-80%' },
      { value: 2, text: '40%-60%' },
      { value: 1, text: '40%以下' }
    ]
  },
  {
    id: 'M4',
    dimension: 'mental',
    metric: 'awareness',
    question: '您对自己情绪的变化有清晰的觉察和命名能力吗？（例如能清楚说出"我现在感到焦虑/愤怒/失落"）',
    type: 'single',
    options: [
      { value: 4, text: '非常清晰，总能准确觉察和描述' },
      { value: 3, text: '比较清晰，大多数时候能' },
      { value: 2, text: '一般，有时能有时不能' },
      { value: 1, text: '不太能，经常搞不清楚自己的情绪' }
    ]
  },
  {
    id: 'M5',
    dimension: 'mental',
    metric: 'coping',
    question: '当情绪低落时，您通常采取什么方式应对？（多选）',
    type: 'multi',
    options: [
      { value: 'exercise', text: '运动锻炼' },
      { value: 'talk', text: '找人倾诉' },
      { value: 'alone', text: '独处消化' },
      { value: 'entertain', text: '娱乐转移注意力' },
      { value: 'suppress', text: '压抑或忽略情绪' },
      { value: 'other', text: '其他方式' }
    ],
    hint: '可多选，选择您最常用的方式'
  },
  {
    id: 'M6',
    dimension: 'mental',
    metric: 'selfcare',
    question: '您每周有多少时间用于自我关怀活动（冥想、写日记、散步放松、泡澡等）？',
    type: 'single',
    options: [
      { value: 4, text: '5小时以上' },
      { value: 3, text: '3-5小时' },
      { value: 2, text: '1-3小时' },
      { value: 1, text: '不到1小时或几乎没有' }
    ]
  },
  {
    id: 'M7',
    dimension: 'mental',
    metric: 'satisfaction',
    question: '您对自己整体心理状态的满意度如何？（1=非常不满意，10=非常满意）',
    type: 'scale',
    min: 1,
    max: 10
  },
  {
    id: 'M8',
    dimension: 'mental',
    metric: 'issues',
    question: '您目前最困扰的心理议题是什么？（多选，最多选3项）',
    type: 'multi',
    options: [
      { value: 'anxiety', text: '焦虑和紧张' },
      { value: 'stress', text: '压力过大' },
      { value: 'mood_swing', text: '情绪波动' },
      { value: 'lonely', text: '孤独感' },
      { value: 'self_doubt', text: '自我怀疑/不自信' },
      { value: 'burnout', text: '倦怠/缺乏动力' },
      { value: 'other', text: '其他' }
    ],
    hint: '可多选，最多选3项'
  },

  // ==================== 生活健康 (L1-L8, 共8题) ====================
  {
    id: 'L1',
    dimension: 'life',
    metric: 'sleep_duration',
    question: '您通常每晚实际睡眠时长是多少小时？',
    type: 'single',
    options: [
      { value: 4, text: '7-8小时' },
      { value: 3, text: '6-7小时或8-9小时' },
      { value: 2, text: '5-6小时' },
      { value: 1, text: '不足5小时或超过9小时' }
    ]
  },
  {
    id: 'L2',
    dimension: 'life',
    metric: 'sleep_quality',
    question: '关于您的睡眠质量：入睡后通常会醒来几次？醒来后能否快速重新入睡？',
    type: 'single',
    options: [
      { value: 4, text: '几乎不醒，一觉到天亮' },
      { value: 3, text: '醒来1次，能很快重新入睡' },
      { value: 2, text: '醒来1-2次，有时难以重新入睡' },
      { value: 1, text: '频繁醒来，经常难以重新入睡' }
    ]
  },
  {
    id: 'L3',
    dimension: 'life',
    metric: 'diet_regularity',
    question: '您的三餐时间是否规律？每周有几天能按时吃饭？',
    type: 'single',
    options: [
      { value: 4, text: '非常规律，每天都能按时' },
      { value: 3, text: '基本规律，每周5-6天' },
      { value: 2, text: '不太规律，每周3-4天' },
      { value: 1, text: '很不规律，每周少于3天' }
    ]
  },
  {
    id: 'L4',
    dimension: 'life',
    metric: 'nutrition',
    question: '您每天摄入的蔬菜水果份量大约是多少？（1份=一个拳头大小）',
    type: 'single',
    options: [
      { value: 4, text: '5份以上' },
      { value: 3, text: '3-4份' },
      { value: 2, text: '1-2份' },
      { value: 1, text: '很少或几乎没有' }
    ]
  },
  {
    id: 'L5',
    dimension: 'life',
    metric: 'hydration',
    question: '您每天饮水量大约是多少毫升？（一杯约250ml）',
    type: 'single',
    options: [
      { value: 4, text: '2000ml以上（约8杯以上）' },
      { value: 3, text: '1500-2000ml（约6-8杯）' },
      { value: 2, text: '1000-1500ml（约4-6杯）' },
      { value: 1, text: '1000ml以下（不足4杯）' }
    ]
  },
  {
    id: 'L6',
    dimension: 'life',
    metric: 'schedule_control',
    question: '您对每天的日程安排感到掌控的程度如何？',
    type: 'single',
    options: [
      { value: 4, text: '完全掌控，井井有条' },
      { value: 3, text: '大部分能掌控' },
      { value: 2, text: '有时能掌控，有时失控' },
      { value: 1, text: '经常感到失控' }
    ]
  },
  {
    id: 'L7',
    dimension: 'life',
    metric: 'leisure',
    question: '每周您有多少时间用于纯粹的放松和娱乐（非刷手机/社交媒体）？',
    type: 'single',
    options: [
      { value: 4, text: '10小时以上' },
      { value: 3, text: '6-10小时' },
      { value: 2, text: '3-5小时' },
      { value: 1, text: '不足3小时' }
    ]
  },
  {
    id: 'L8',
    dimension: 'life',
    metric: 'improve_priority',
    question: '您认为目前最需要改善的生活习惯是什么？',
    type: 'single',
    options: [
      { value: 'sleep', text: '睡眠质量' },
      { value: 'diet', text: '饮食习惯' },
      { value: 'hydration', text: '饮水习惯' },
      { value: 'schedule', text: '作息规律' },
      { value: 'exercise', text: '运动习惯' },
      { value: 'other', text: '其他' }
    ]
  },

  // ==================== 身体健康 (P1-P8, 共8题) ====================
  {
    id: 'P1',
    dimension: 'physical',
    metric: 'exercise_freq',
    question: '您每周进行多少次中等强度以上的运动（每次持续30分钟以上）？',
    type: 'single',
    options: [
      { value: 4, text: '4次以上' },
      { value: 3, text: '3次' },
      { value: 2, text: '1-2次' },
      { value: 1, text: '几乎没有' }
    ]
  },
  {
    id: 'P2',
    dimension: 'physical',
    metric: 'exercise_type',
    question: '您目前的运动类型主要包括哪些？（多选）',
    type: 'multi',
    options: [
      { value: 'aerobic', text: '有氧运动（跑步、游泳、骑车等）' },
      { value: 'strength', text: '力量训练（举铁、自重训练等）' },
      { value: 'flexibility', text: '柔韧训练（瑜伽、拉伸等）' },
      { value: 'ball', text: '球类运动' },
      { value: 'none', text: '目前没有规律运动' }
    ]
  },
  {
    id: 'P3',
    dimension: 'physical',
    metric: 'pain',
    question: '您在运动中或运动后是否有过疼痛或不适？',
    type: 'single',
    options: [
      { value: 4, text: '没有，运动感觉很舒适' },
      { value: 3, text: '偶尔有轻微不适' },
      { value: 2, text: '经常有不适感' },
      { value: 1, text: '有明显疼痛，影响运动' }
    ]
  },
  {
    id: 'P4',
    dimension: 'physical',
    metric: 'endurance',
    question: '您能连续爬几层楼梯而不感到明显气喘？',
    type: 'single',
    options: [
      { value: 4, text: '10层以上' },
      { value: 3, text: '6-10层' },
      { value: 2, text: '3-5层' },
      { value: 1, text: '1-2层就明显气喘' }
    ]
  },
  {
    id: 'P5',
    dimension: 'physical',
    metric: 'sedentary',
    question: '您每天保持坐姿的总时间大约是多久？（包括工作、通勤、休闲）',
    type: 'single',
    options: [
      { value: 4, text: '4小时以下' },
      { value: 3, text: '4-6小时' },
      { value: 2, text: '6-10小时' },
      { value: 1, text: '10小时以上' }
    ]
  },
  {
    id: 'P6',
    dimension: 'physical',
    metric: 'discomfort',
    question: '您是否有以下身体不适？（多选）',
    type: 'multi',
    options: [
      { value: 'neck', text: '肩颈酸痛' },
      { value: 'back', text: '腰背不适' },
      { value: 'fatigue', text: '经常疲劳' },
      { value: 'headache', text: '头痛' },
      { value: 'eye', text: '眼睛干涩/疲劳' },
      { value: 'none', text: '以上都没有' }
    ]
  },
  {
    id: 'P7',
    dimension: 'physical',
    metric: 'fitness_satisfaction',
    question: '您对自己当前体能状态的满意度如何？（1=非常不满意，10=非常满意）',
    type: 'scale',
    min: 1,
    max: 10
  },
  {
    id: 'P8',
    dimension: 'physical',
    metric: 'exercise_preference',
    question: '如果给您制定一份运动计划，您更倾向于哪种方式？',
    type: 'single',
    options: [
      { value: 'home', text: '居家训练' },
      { value: 'gym', text: '健身房训练' },
      { value: 'outdoor', text: '户外运动' },
      { value: 'class', text: '团课/私教指导' }
    ]
  },

  // ==================== 美丽管理 (B1-B6, 共6题) ====================
  {
    id: 'B1',
    dimension: 'beauty',
    metric: 'grooming_time',
    question: '您每天在个人形象打理（护肤、化妆、穿搭等）上花费的时间大约是？',
    type: 'single',
    options: [
      { value: 4, text: '30分钟以上，享受这个过程' },
      { value: 3, text: '15-30分钟' },
      { value: 2, text: '5-15分钟' },
      { value: 1, text: '5分钟以内，很少打理' }
    ]
  },
  {
    id: 'B2',
    dimension: 'beauty',
    metric: 'style',
    question: '您对自己的着装风格有清晰的定位吗？',
    type: 'single',
    options: [
      { value: 4, text: '非常清晰，有明确的个人风格' },
      { value: 3, text: '大致有方向' },
      { value: 2, text: '比较模糊' },
      { value: 1, text: '没有概念' }
    ]
  },
  {
    id: 'B3',
    dimension: 'beauty',
    metric: 'skin_issues',
    question: '您目前的皮肤状态如何？（多选）',
    type: 'multi',
    options: [
      { value: 'oily', text: '出油多' },
      { value: 'dry', text: '干燥起皮' },
      { value: 'sensitive', text: '敏感泛红' },
      { value: 'acne', text: '长痘' },
      { value: 'spots', text: '色斑/痘印' },
      { value: 'wrinkles', text: '细纹/松弛' },
      { value: 'good', text: '状态良好' }
    ]
  },
  {
    id: 'B4',
    dimension: 'beauty',
    metric: 'skincare_routine',
    question: '您每天进行几步护肤流程？',
    type: 'single',
    options: [
      { value: 4, text: '完整流程（清洁+水+精华+乳/霜+防晒）' },
      { value: 3, text: '3-4步（如清洁+水+面霜）' },
      { value: 2, text: '1-2步（如清洁+面霜）' },
      { value: 1, text: '很少护肤' }
    ]
  },
  {
    id: 'B5',
    dimension: 'beauty',
    metric: 'posture_satisfaction',
    question: '您对自己的体态（站姿、坐姿、走路姿态）满意吗？',
    type: 'single',
    options: [
      { value: 4, text: '非常满意，体态挺拔优雅' },
      { value: 3, text: '比较满意' },
      { value: 2, text: '一般，有改善空间' },
      { value: 1, text: '不满意，存在明显体态问题' }
    ]
  },
  {
    id: 'B6',
    dimension: 'beauty',
    metric: 'improve_direction',
    question: '您最希望在形象方面获得哪方面的改善？',
    type: 'single',
    options: [
      { value: 'style', text: '穿搭风格' },
      { value: 'hair', text: '发型' },
      { value: 'skincare', text: '皮肤护理' },
      { value: 'makeup', text: '妆容技巧' },
      { value: 'posture', text: '体态气质' },
      { value: 'overall', text: '整体形象提升' }
    ]
  },

  // ==================== 工作效率 (W1-W7, 共7题) ====================
  {
    id: 'W1',
    dimension: 'productivity',
    metric: 'deep_work',
    question: '您每天高效工作（深度专注、不受打扰）的时间大约是多少小时？',
    type: 'single',
    options: [
      { value: 4, text: '4小时以上' },
      { value: 3, text: '3-4小时' },
      { value: 2, text: '1-2小时' },
      { value: 1, text: '不到1小时' }
    ]
  },
  {
    id: 'W2',
    dimension: 'productivity',
    metric: 'distraction',
    question: '您在工作中被打断的频率如何？最主要的干扰源是？',
    type: 'single',
    options: [
      { value: 4, text: '很少被打断，能保持专注' },
      { value: 3, text: '偶尔被打断，能快速回到状态' },
      { value: 2, text: '经常被打断，恢复状态需要时间' },
      { value: 1, text: '频繁被打断，很难保持专注' }
    ]
  },
  {
    id: 'W3',
    dimension: 'productivity',
    metric: 'task_method',
    question: '您使用什么方法管理待办任务？',
    type: 'single',
    options: [
      { value: 4, text: '有成熟的任务管理系统（如GTD、看板等）' },
      { value: 3, text: '使用清单或日历管理' },
      { value: 2, text: '主要靠记忆，偶尔记录' },
      { value: 1, text: '没有系统的方法' }
    ]
  },
  {
    id: 'W4',
    dimension: 'productivity',
    metric: 'completion',
    question: '每天结束时，您完成计划任务的比例大约是？',
    type: 'single',
    options: [
      { value: 4, text: '80%以上' },
      { value: 3, text: '60%-80%' },
      { value: 2, text: '40%-60%' },
      { value: 1, text: '40%以下' }
    ]
  },
  {
    id: 'W5',
    dimension: 'productivity',
    metric: 'time_pressure',
    question: '您经常感到时间不够用吗？',
    type: 'single',
    options: [
      { value: 4, text: '很少感到时间不够用' },
      { value: 3, text: '偶尔感到' },
      { value: 2, text: '经常感到' },
      { value: 1, text: '几乎每天都感到时间不够用' }
    ]
  },
  {
    id: 'W6',
    dimension: 'productivity',
    metric: 'energy_peak',
    question: '您在工作中的精力高峰通常出现在什么时段？',
    type: 'single',
    options: [
      { value: 'morning', text: '早晨（6-9点）' },
      { value: 'am', text: '上午（9-12点）' },
      { value: 'pm', text: '下午（14-17点）' },
      { value: 'evening', text: '晚上（19-22点）' },
      { value: 'irregular', text: '不规律，每天不同' }
    ]
  },
  {
    id: 'W7',
    dimension: 'productivity',
    metric: 'improve_focus',
    question: '您最希望改善的工作效率问题是什么？',
    type: 'single',
    options: [
      { value: 'procrastination', text: '拖延' },
      { value: 'distraction', text: '容易分心' },
      { value: 'priority', text: '优先级不清' },
      { value: 'planning', text: '缺乏规划' },
      { value: 'fatigue', text: '精力不足/疲劳' },
      { value: 'other', text: '其他' }
    ]
  },

  // ==================== 目标管理 (G1-G7, 共7题) ====================
  {
    id: 'G1',
    dimension: 'goal',
    metric: 'clarity',
    question: '您目前有明确的短期（3个月内）目标吗？写下来了吗？',
    type: 'single',
    options: [
      { value: 4, text: '有明确目标，并且写下来了' },
      { value: 3, text: '有目标但没写下来' },
      { value: 2, text: '目标比较模糊' },
      { value: 1, text: '目前没有明确目标' }
    ]
  },
  {
    id: 'G2',
    dimension: 'goal',
    metric: 'coverage',
    question: '您的目标涵盖了哪些领域？（多选）',
    type: 'multi',
    options: [
      { value: 'career', text: '事业发展' },
      { value: 'health', text: '健康管理' },
      { value: 'learning', text: '学习成长' },
      { value: 'family', text: '家庭关系' },
      { value: 'wealth', text: '财务管理' },
      { value: 'social', text: '社交关系' },
      { value: 'other', text: '其他' }
    ],
    hint: '可多选'
  },
  {
    id: 'G3',
    dimension: 'goal',
    metric: 'review',
    question: '您多久回顾和检视一次自己的目标进展？',
    type: 'single',
    options: [
      { value: 4, text: '每天都会回顾' },
      { value: 3, text: '每周回顾一次' },
      { value: 2, text: '每月回顾一次或更久' },
      { value: 1, text: '很少回顾或从不回顾' }
    ]
  },
  {
    id: 'G4',
    dimension: 'goal',
    metric: 'coping_goal',
    question: '当目标进展不顺利时，您通常会怎么做？',
    type: 'single',
    options: [
      { value: 4, text: '分析原因，调整计划继续前进' },
      { value: 3, text: '坚持原计划，相信会好转' },
      { value: 2, text: '降低目标难度' },
      { value: 1, text: '容易放弃或逃避' }
    ]
  },
  {
    id: 'G5',
    dimension: 'goal',
    metric: 'achievement',
    question: '您对自己过去一个月的目标达成情况满意度如何？（1=非常不满意，10=非常满意）',
    type: 'scale',
    min: 1,
    max: 10
  },
  {
    id: 'G6',
    dimension: 'goal',
    metric: 'method',
    question: '您是否有一套系统的目标设定和追踪方法？',
    type: 'single',
    options: [
      { value: 4, text: '有成熟的系统方法（如OKR、SMART等）' },
      { value: 3, text: '有一些简单的方法' },
      { value: 2, text: '正在探索中' },
      { value: 1, text: '没有系统方法' }
    ]
  },
  {
    id: 'G7',
    dimension: 'goal',
    metric: 'dream_goal',
    question: '您目前最想实现但尚未开始的一个重要目标是什么？（可选填）',
    type: 'text',
    hint: '请简单描述这个目标，这能帮助我们更好地理解您的愿望'
  }
];
