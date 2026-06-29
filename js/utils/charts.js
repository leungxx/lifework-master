// ============================================================
// Chart.js 通用工具
// ============================================================

const Charts = {
  // 默认全局配置
  defaults: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          font: { family: "'Inter', sans-serif", size: 12 },
          usePointStyle: true,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleFont: { family: "'Inter', sans-serif", size: 13 },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 8
      }
    }
  },

  // 颜色方案
  colors: {
    primary: '#6366F1',
    primaryAlpha: 'rgba(99, 102, 241, 0.2)',
    mental: '#8B5CF6',
    mentalAlpha: 'rgba(139, 92, 246, 0.2)',
    life: '#EC4899',
    lifeAlpha: 'rgba(236, 72, 153, 0.2)',
    physical: '#F59E0B',
    physicalAlpha: 'rgba(245, 158, 11, 0.2)',
    beauty: '#10B981',
    beautyAlpha: 'rgba(16, 185, 129, 0.2)',
    productivity: '#3B82F6',
    productivityAlpha: 'rgba(59, 130, 246, 0.2)',
    goal: '#EF4444',
    goalAlpha: 'rgba(239, 68, 68, 0.2)'
  },

  // 六维雷达图
  createRadarChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    const dimColors = [
      Charts.colors.mental,
      Charts.colors.life,
      Charts.colors.physical,
      Charts.colors.beauty,
      Charts.colors.productivity,
      Charts.colors.goal
    ];

    return new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['心理健康', '生活健康', '身体健康', '美丽管理', '工作效率', '目标管理'],
        datasets: [{
          label: data.label || '健康画像',
          data: data.values || [],
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          borderColor: Charts.colors.primary,
          borderWidth: 2,
          pointBackgroundColor: dimColors,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: {
              stepSize: 20,
              backdropColor: 'transparent',
              font: { size: 10 }
            },
            pointLabels: {
              font: { size: 13, family: "'Inter', sans-serif", weight: '500' },
              color: '#475569'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.06)'
            },
            angleLines: {
              color: 'rgba(0, 0, 0, 0.06)'
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw}分`
            }
          }
        },
        ...options
      }
    });
  },

  // 环形图
  createDoughnutChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels || [],
        datasets: [{
          data: data.values || [],
          backgroundColor: data.colors || [
            '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'
          ],
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 8
            }
          }
        },
        ...options
      }
    });
  },

  // 柱状图
  createBarChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels || [],
        datasets: data.datasets || []
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '分'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.04)'
            }
          },
          x: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        ...options
      }
    });
  },

  // 销毁图表实例
  destroy(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const instance = Chart.getChart(canvas);
    if (instance) {
      instance.destroy();
    }
  }
};
