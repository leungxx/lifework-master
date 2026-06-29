// ============================================================
// 专家分析引擎 - 基于评分生成专家评语和建议
// ============================================================

const ExpertAnalysisEngine = {
  /**
   * 生成所有专家的分析结果
   */
  generateAll(scores, answers) {
    const analyses = {};

    for (const [dimId, dim] of Object.entries(DIMENSIONS)) {
      const dimScore = scores.dimensions[dimId];
      if (!dimScore) continue;

      const dimAnalyses = {};
      for (const expertId of dim.experts) {
        const expert = EXPERTS[expertId];
        if (!expert) continue;

        dimAnalyses[expertId] = this._generateExpertAnalysis(expert, dimScore, answers);
      }
      analyses[dimId] = dimAnalyses;
    }

    return analyses;
  },

  /**
   * 生成单一位专家的分析
   */
  _generateExpertAnalysis(expert, dimScore, answers) {
    const percentage = dimScore.percentage;
    const gradeKey = Format.getGrade(percentage).key;

    // 从模板获取评语
    let comment = '';
    if (expert.templates && expert.templates[gradeKey]) {
      comment = expert.templates[gradeKey];
    } else {
      comment = this._getDefaultComment(percentage);
    }

    // 生成建议
    const suggestions = this._generateSuggestions(expert, dimScore, answers);

    return {
      expert: {
        id: expert.id,
        name: expert.name,
        title: expert.title,
        icon: expert.icon,
        role: expert.role,
        duties: expert.duties,
        methods: expert.methods
      },
      score: percentage,
      grade: gradeKey,
      comment: comment,
      suggestions: suggestions
    };
  },

  _getDefaultComment(percentage) {
    if (percentage >= 85) return '该维度表现优秀，继续保持当前的良好状态。';
    if (percentage >= 70) return '该维度整体良好，有小幅优化空间。';
    if (percentage >= 55) return '该维度处于一般水平，建议制定改善计划。';
    return '该维度需要重点关注和改善。';
  },

  _generateSuggestions(expert, dimScore, answers) {
    const suggestions = [];
    const percentage = dimScore.percentage;

    switch (expert.id) {
      case 'counselor':
        suggestions.push('建立每日情绪日志，记录3个关键情绪和触发事件');
        suggestions.push('练习CBT思维记录表，识别和挑战负面自动思维');
        if (percentage < 70) suggestions.push('考虑学习正念减压(MBSR)或接纳承诺疗法(ACT)技巧');
        if (percentage < 55) suggestions.push('建议寻找可信赖的倾诉对象或专业心理咨询师');
        break;

      case 'mindfulness':
        suggestions.push('每天安排5-10分钟正念呼吸练习，建议在固定时段进行');
        suggestions.push('尝试" STOP"技巧：暂停(Stop)-呼吸(Take a breath)-观察(Observe)-继续(Proceed)');
        if (percentage < 70) suggestions.push('下载正念冥想App（如Headspace、潮汐），跟随引导练习');
        break;

      case 'resilience':
        suggestions.push('建立"逆境成长日记"，记录每次困难中学到的经验');
        suggestions.push('练习乐观解释风格：将负面事件归因为暂时的、特定的、可改变的');
        if (percentage < 70) suggestions.push('设定每周一个小挑战，刻意走出舒适区，积累成功经验');
        break;

      case 'planner':
        suggestions.push('使用时间日志追踪一周，识别时间黑洞和低效时段');
        suggestions.push('建立早晚固定仪式：晨间规划10分钟+晚间回顾5分钟');
        if (percentage < 70) suggestions.push('使用四象限法对任务进行分类，优先处理重要不紧急的事务');
        break;

      case 'nutritionist':
        suggestions.push('确保每天摄入至少400g蔬菜水果（约5份）');
        suggestions.push('建立饮水提醒习惯，目标是每天1500-2000ml');
        if (percentage < 70) suggestions.push('减少加工食品和外卖频率，增加自主烹饪比例');
        break;

      case 'sleep':
        suggestions.push('固定就寝和起床时间，即使是周末也尽量保持一致');
        suggestions.push('睡前1小时停止使用电子设备，建立放松仪式（阅读、冥想、温水浴）');
        if (percentage < 70) suggestions.push('优化睡眠环境：保持卧室凉爽(18-22°C)、黑暗、安静');
        break;

      case 'rehab':
        suggestions.push('每坐45分钟起身活动5分钟，做简单的颈肩拉伸');
        suggestions.push('注意日常体态：保持耳-肩-髋在一条直线上');
        if (percentage < 70) suggestions.push('从每天步行30分钟开始，逐步增加运动量');
        break;

      case 'fitness':
        suggestions.push('制定包含有氧+力量+柔韧的周度训练计划');
        suggestions.push('每周至少150分钟中等强度有氧运动+2次力量训练');
        if (percentage < 70) suggestions.push('从每周2-3次、每次20分钟的低强度运动开始，逐步进阶');
        break;

      case 'tcm':
        suggestions.push('根据季节调整作息：春夏晚睡早起，秋冬早睡晚起');
        suggestions.push('常按足三里、涌泉穴等保健穴位，每次3-5分钟');
        if (percentage < 70) suggestions.push('注意饮食温热，避免生冷食物，保护脾胃阳气');
        break;

      case 'image':
        suggestions.push('明确自己的色彩季型和体型特征，建立个人风格基调');
        suggestions.push('打造胶囊衣橱：选择百搭基础款，提高穿搭效率');
        if (percentage < 70) suggestions.push('从整理现有衣橱开始，淘汰不适合的单品');
        break;

      case 'skincare':
        suggestions.push('坚持基础护肤三步：温和清洁+充分保湿+严格防晒');
        suggestions.push('建立皮肤日记，记录产品使用效果和皮肤变化');
        if (percentage < 70) suggestions.push('评估现有护肤品的成分是否匹配自己的皮肤类型');
        break;

      case 'efficiency':
        suggestions.push('每天开始前列出最重要的3件事(MIT)，优先完成');
        suggestions.push('使用番茄工作法：25分钟专注+5分钟休息，保护深度工作时间');
        if (percentage < 70) suggestions.push('进行一周时间审计，识别并消除低价值活动');
        break;

      case 'energy':
        suggestions.push('识别个人精力高峰时段，将重要任务安排在此时间段');
        suggestions.push('每90分钟安排一次5-10分钟的恢复休息');
        if (percentage < 70) suggestions.push('建立精力日志，追踪体能、情绪、思维、意志四维精力波动');
        break;

      case 'architect':
        suggestions.push('进行价值观澄清练习，确定最重要的3-5个核心价值观');
        suggestions.push('使用SMART原则设定季度目标：具体、可衡量、可达成、相关、有时限');
        if (percentage < 70) suggestions.push('从设定1个最重要的月度目标开始，建立目标管理的正向循环');
        break;

      case 'tracker':
        suggestions.push('建立周度进度检查习惯，每周日晚上回顾目标进展');
        suggestions.push('设置阶段性里程碑和检查点，将大目标分解为小步骤');
        if (percentage < 70) suggestions.push('使用简单的进度追踪工具（如习惯打卡App、Notion等）');
        break;

      case 'reflector':
        suggestions.push('采用KPT复盘法：每周记录Keep(保持)/Problem(问题)/Try(尝试)');
        suggestions.push('每月进行一次深度复盘，总结关键经验和下月改进计划');
        if (percentage < 70) suggestions.push('从每日三问开始建立复盘习惯：做得好/可改进/明天重点');
        break;
    }

    // 根据得分添加额外建议
    if (percentage >= 85) {
      suggestions.push('继续保持现有习惯，可以尝试向他人分享经验和方法');
    }

    return suggestions;
  }
};
