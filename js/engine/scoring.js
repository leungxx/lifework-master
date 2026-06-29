// ============================================================
// 评分引擎 - 将问卷答案转换为维度得分
// ============================================================

const ScoringEngine = {
  /**
   * 处理完整问卷答案，返回评分结果
   * @param {Object} answers - { M1: value, M2: value, ... }
   * @returns {Object} scores - 各维度得分和分析
   */
  calculate(answers) {
    const dimensionScores = {};
    let totalScore = 0;
    let totalMaxScore = 0;
    let answeredCount = 0;
    const detailScores = {};

    // 按维度分组计算
    for (const [dimId, dim] of Object.entries(DIMENSIONS)) {
      const dimQuestions = QUESTIONNAIRE.filter(q => q.dimension === dimId);
      let dimScore = 0;
      let dimMaxScore = 0;
      const subScores = {};

      for (const q of dimQuestions) {
        const answer = answers[q.id];
        if (answer === undefined || answer === null) continue;

        answeredCount++;
        let questionScore = 0;
        let questionMax = 0;

        if (q.type === 'single') {
          // 兼容字符串和数字类型的 answer
          const opt = q.options.find(o => String(o.value) === String(answer));
          if (opt && typeof opt.value === 'number') {
            questionScore = opt.value;
            questionMax = 4; // 默认最大4分
          } else if (opt && typeof opt.value === 'string') {
            // 文字选项（如 L8, P8, B6, W6, W7 等），计分为默认2分
            questionScore = 2;
            questionMax = 4;
          }
        } else if (q.type === 'scale') {
          // 1-10量表转换为百分制
          questionScore = parseInt(answer) || 0;
          questionMax = q.max || 10;
        } else if (q.type === 'multi') {
          // 多选题：根据选项计算
          if (Array.isArray(answer)) {
            if (q.id === 'M5') {
              // M5 应对策略：正向策略计分
              const positive = ['exercise', 'talk'];
              const neutral = ['alone', 'entertain'];
              const negative = ['suppress'];
              let score = 2; // 基础分
              answer.forEach(v => {
                if (positive.includes(v)) score += 1;
                if (neutral.includes(v)) score += 0.5;
                if (negative.includes(v)) score -= 1;
              });
              questionScore = Math.max(1, Math.min(4, score));
              questionMax = 4;
            } else if (q.id === 'M8') {
              // M8 困扰议题：越少越好
              const count = answer.filter(v => v !== 'other').length;
              questionScore = Math.max(1, 4 - count);
              questionMax = 4;
            } else if (q.id === 'P2') {
              // P2 运动类型：种类越多越好
              const types = answer.filter(v => v !== 'none');
              questionScore = Math.min(4, types.length + 1);
              questionMax = 4;
            } else if (q.id === 'P6') {
              // P6 身体不适：越少越好
              if (answer.includes('none')) {
                questionScore = 4;
              } else {
                questionScore = Math.max(1, 4 - answer.length);
              }
              questionMax = 4;
            } else if (q.id === 'B3') {
              // B3 皮肤问题
              if (answer.includes('good') && answer.length === 1) {
                questionScore = 4;
              } else if (answer.includes('good')) {
                questionScore = Math.max(1, 4 - (answer.length - 1));
              } else {
                questionScore = Math.max(1, 4 - answer.length);
              }
              questionMax = 4;
            } else if (q.id === 'G2') {
              // G2 目标覆盖：领域越多越好
              const count = answer.filter(v => v !== 'other').length;
              questionScore = Math.min(4, count);
              questionMax = 4;
            } else {
              questionScore = 2;
              questionMax = 4;
            }
          }
        } else if (q.type === 'text') {
          // 文字题不参与计分
          continue;
        }

        dimScore += questionScore;
        dimMaxScore += questionMax;

        // 子指标
        if (q.metric) {
          subScores[q.metric] = {
            score: questionScore,
            max: questionMax,
            percentage: Math.round((questionScore / questionMax) * 100)
          };
        }
      }

      // 维度百分制得分
      const dimPercentage = dimMaxScore > 0 ? Math.round((dimScore / dimMaxScore) * 100) : 0;
      const grade = Format.getGrade(dimPercentage);

      dimensionScores[dimId] = {
        id: dimId,
        name: dim.name,
        icon: dim.icon,
        color: dim.color,
        rawScore: dimScore,
        maxScore: dimMaxScore,
        percentage: dimPercentage,
        grade: grade,
        subScores: subScores,
        questionCount: dimQuestions.length
      };

      totalScore += dimPercentage;
      totalMaxScore += 100;
    }

    // 综合得分
    const dimCount = Object.keys(dimensionScores).length;
    const overallPercentage = dimCount > 0 ? Math.round(totalScore / dimCount) : 0;
    const overallGrade = Format.getGrade(overallPercentage);

    return {
      overall: {
        percentage: overallPercentage,
        grade: overallGrade,
        answeredCount: answeredCount,
        totalQuestions: QUESTIONNAIRE.length
      },
      dimensions: dimensionScores,
      answeredCount: answeredCount
    };
  },

  /**
   * 获取维度强弱项分析
   */
  getStrengthWeakness(scores) {
    const dims = Object.values(scores.dimensions);
    const sorted = [...dims].sort((a, b) => b.percentage - a.percentage);

    const strengths = sorted.slice(0, 2).map(d => ({
      id: d.id,
      name: d.name,
      percentage: d.percentage,
      color: d.color
    }));

    const weaknesses = sorted.slice(-2).reverse().map(d => ({
      id: d.id,
      name: d.name,
      percentage: d.percentage,
      color: d.color
    }));

    return { strengths, weaknesses };
  },

  /**
   * 获取优先级建议（基于紧迫度×影响度）
   */
  getPriorityMatrix(scores) {
    const dims = Object.values(scores.dimensions);
    const priorities = dims.map(d => ({
      id: d.id,
      name: d.name,
      score: d.percentage,
      // 分数越低越紧迫
      urgency: 100 - d.percentage,
      // 心理和身体健康影响度最高
      impact: ['mental', 'physical'].includes(d.id) ? 9 :
              ['life', 'productivity'].includes(d.id) ? 7 :
              ['goal', 'beauty'].includes(d.id) ? 5 : 3,
      priority: 0
    }));

    // 计算优先级分数
    priorities.forEach(p => {
      p.priority = (p.urgency * 0.6 + (10 - p.impact) * 4);
    });

    return priorities.sort((a, b) => b.priority - a.priority);
  }
};
