// ============================================================
// 总协调师综合分析引擎
// ============================================================

const CoordinatorEngine = {
  /**
   * 生成总协调师的综合分析报告
   */
  generate(scores, analyses) {
    const dims = Object.values(scores.dimensions);
    const overall = scores.overall;

    // 强弱项
    const sw = ScoringEngine.getStrengthWeakness(scores);

    // 优先级矩阵
    const priorities = ScoringEngine.getPriorityMatrix(scores);

    // 跨维度关联分析
    const crossLinks = this._analyzeCrossLinks(dims);

    // 生成综合洞察
    const insights = this._generateInsights(overall, dims, sw, crossLinks);

    // 生成90天改善方案
    const plan = this._generate90DayPlan(priorities, crossLinks);

    return {
      overall: {
        percentage: overall.percentage,
        grade: overall.grade,
        answeredCount: overall.answeredCount,
        totalQuestions: overall.totalQuestions
      },
      strengths: sw.strengths,
      weaknesses: sw.weaknesses,
      priorities: priorities,
      crossLinks: crossLinks,
      insights: insights,
      plan: plan,
      generatedAt: new Date().toISOString()
    };
  },

  /**
   * 跨维度关联分析
   */
  _analyzeCrossLinks(dims) {
    const links = [];
    const dimMap = {};
    dims.forEach(d => { dimMap[d.id] = d; });

    // 心理-工作关联
    if (dimMap.mental && dimMap.productivity) {
      if (dimMap.mental.percentage < 60 && dimMap.productivity.percentage < 60) {
        links.push({
          type: 'chain',
          name: '压力-效率恶性循环',
          dims: ['mental', 'productivity'],
          description: '心理压力较大可能正在影响您的工作效率，而低效率又反过来增加心理压力，形成恶性循环。',
          suggestion: '建议优先改善心理健康，同时降低工作目标负荷，打破循环。'
        });
      }
    }

    // 睡眠-精力-效率关联
    if (dimMap.life && dimMap.productivity) {
      const sleepSub = dimMap.life.subScores?.sleep_quality;
      if (sleepSub && sleepSub.percentage < 60 && dimMap.productivity.percentage < 70) {
        links.push({
          type: 'chain',
          name: '睡眠不足影响工作效率',
          dims: ['life', 'productivity'],
          description: '睡眠质量不佳可能直接影响您的日间精力和工作效率。',
          suggestion: '建议将改善睡眠作为首要任务，良好的睡眠是高效工作的基础。'
        });
      }
    }

    // 运动-心理关联
    if (dimMap.physical && dimMap.mental) {
      const exFreq = dimMap.physical.subScores?.exercise_freq;
      if (exFreq && exFreq.percentage < 50 && dimMap.mental.percentage < 70) {
        links.push({
          type: 'opportunity',
          name: '运动是天然的抗焦虑良方',
          dims: ['physical', 'mental'],
          description: '增加规律运动可以同时改善身体和心理健康，运动释放的内啡肽有助于缓解焦虑。',
          suggestion: '建议将运动作为改善心理健康的辅助手段，从每天15分钟快走开始。'
        });
      }
    }

    // 美丽-心理关联
    if (dimMap.beauty && dimMap.mental) {
      if (dimMap.beauty.percentage < 55 && dimMap.mental.percentage < 65) {
        links.push({
          type: 'opportunity',
          name: '外在形象与内在自信相互影响',
          dims: ['beauty', 'mental'],
          description: '对外在形象的不满意可能影响自信心，而心理状态又会影响对自身形象的感知。',
          suggestion: '建议从小处着手改善形象（如更换发型、整理衣橱），外在改变可以带来心理上的正向反馈。'
        });
      }
    }

    // 目标-效率关联
    if (dimMap.goal && dimMap.productivity) {
      if (dimMap.goal.percentage < 55 && dimMap.productivity.percentage < 65) {
        links.push({
          type: 'chain',
          name: '目标不清导致效率低下',
          dims: ['goal', 'productivity'],
          description: '缺乏明确目标可能导致优先级混乱，进而影响工作效率。',
          suggestion: '建议先花时间明确季度目标，再基于目标优化每日任务安排。'
        });
      }
    }

    return links;
  },

  /**
   * 生成综合洞察
   */
  _generateInsights(overall, dims, sw, crossLinks) {
    const insights = [];

    // 总体评价
    if (overall.percentage >= 85) {
      insights.push('您的整体状态非常优秀！六个维度均衡发展，显示出良好的自我管理能力。建议在保持现状的基础上，选择1-2个维度进行突破性提升。');
    } else if (overall.percentage >= 70) {
      insights.push('您的整体状态良好，在大多数维度上表现不错。重点关注弱势维度，可以进一步提升整体生活质量和工作效能。');
    } else if (overall.percentage >= 55) {
      insights.push('您的整体状态处于中等水平，多个维度存在改善空间。建议制定系统性的改善计划，从最紧迫的维度开始逐步提升。');
    } else {
      insights.push('您的整体状态需要重点关注。建议不要同时改善所有维度，而是选择1-2个最关键的方向，集中精力取得突破。');
    }

    // 均衡性分析
    const scores_arr = dims.map(d => d.percentage);
    const maxScore = Math.max(...scores_arr);
    const minScore = Math.min(...scores_arr);
    const gap = maxScore - minScore;

    if (gap > 30) {
      insights.push(`各维度之间存在较大差距（${gap}分），建议重点关注弱势维度，同时保持优势维度的良好状态。`);
    } else if (gap < 15) {
      insights.push('各维度发展较为均衡，这是一个积极的信号，说明您在不同领域都有良好的基础。');
    }

    // 跨维度联动
    if (crossLinks.length > 0) {
      insights.push(`检测到${crossLinks.length}个跨维度联动关系，这意味着改善一个维度可能同时带动其他维度的提升。`);
    }

    return insights;
  },

  /**
   * 生成90天改善方案
   */
  _generate90DayPlan(priorities, crossLinks) {
    const phases = [
      {
        period: '第1-2周：基础建设',
        title: '建立评估基线和核心习惯',
        items: []
      },
      {
        period: '第3-4周：初步改善',
        title: '聚焦首要维度，实现可见变化',
        items: []
      },
      {
        period: '第5-8周：系统优化',
        title: '拓展到其他维度，建立联动效应',
        items: []
      },
      {
        period: '第9-12周：巩固提升',
        title: '固化新习惯，评估改善效果',
        items: []
      }
    ];

    // 根据优先级分配任务
    const topPriority = priorities[0];
    const secondPriority = priorities[1];

    if (topPriority) {
      phases[0].items.push(`完成${topPriority.name}维度的深度评估，明确具体改善目标`);
      phases[1].items.push(`集中改善${topPriority.name}：建立每日微习惯，从最小可行行动开始`);
    }

    if (secondPriority) {
      phases[2].items.push(`在巩固${topPriority?.name || '首要维度'}的基础上，开始优化${secondPriority.name}`);
    }

    // 通用建议
    phases[0].items.push('建立每日健康打卡习惯（睡眠、运动、情绪三项基础指标）');
    phases[1].items.push('每周进行一次小型复盘，记录进展和遇到的障碍');
    phases[2].items.push('建立跨维度的联动改善策略，利用优势维度带动弱势维度');
    phases[3].items.push('进行90天全面复盘，重新评估六维度得分，对比基线数据');
    phases[3].items.push('根据改善效果，制定下一个90天的优化方案');

    // 跨维度联动建议
    if (crossLinks.length > 0) {
      const linkItem = crossLinks[0];
      phases[1].items.push(`关注跨维度联动：${linkItem.suggestion}`);
    }

    return phases;
  }
};
