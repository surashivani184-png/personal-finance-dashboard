/**
 * Personal Finance Dashboard - Data Visualizations (Chart.js Integration)
 * MCA 1st Semester Web Programming Mini Project
 * Module: Charts rendering, dynamic theme updates, data formatting
 */

class FinanceCharts {
  constructor() {
    this.expensePieChart = null;
    this.cashFlowBarChart = null;
    this.emiChart = null;
    this.sipChart = null;
  }

  isChartJsAvailable() {
    return typeof Chart !== 'undefined';
  }

  getChartColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      textColor: isDark ? '#a3aed0' : '#64748b',
      gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
      tooltipBg: isDark ? '#111c44' : '#1e293b'
    };
  }

  // Render the Expense by Category Donut Chart
  renderExpensePieChart() {
    const canvas = document.getElementById('expensePieCanvas');
    if (!canvas || !this.isChartJsAvailable()) return;

    const transactions = store.getTransactions().filter(t => t.type === 'expense');
    const categoryTotals = {};

    transactions.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + (parseFloat(t.amount) || 0);
    });

    const labels = Object.keys(categoryTotals).map(k => CATEGORIES[k]?.name || k);
    const dataValues = Object.values(categoryTotals);
    const backgroundColors = Object.keys(categoryTotals).map(k => CATEGORIES[k]?.color || '#94a3b8');

    if (this.expensePieChart) {
      this.expensePieChart.destroy();
    }

    if (labels.length === 0) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('No expense data yet', canvas.width / 2, canvas.height / 2);
      return;
    }

    const { textColor } = this.getChartColors();

    this.expensePieChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#111c44' : '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 12,
              color: textColor,
              font: { family: 'Inter', size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const currency = store.getSettings().currency;
                const sym = CURRENCIES[currency]?.symbol || '₹';
                const val = context.raw || 0;
                return ` ${context.label}: ${sym}${val.toLocaleString()}`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  // Render Income vs Expense Bar Chart
  renderCashFlowBarChart() {
    const canvas = document.getElementById('cashFlowBarCanvas');
    if (!canvas || !this.isChartJsAvailable()) return;

    const transactions = store.getTransactions();
    // Group transactions by date (last 7 days or date groups)
    const dateMap = {};

    transactions.forEach(t => {
      const d = t.date || 'Other';
      if (!dateMap[d]) {
        dateMap[d] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        dateMap[d].income += parseFloat(t.amount) || 0;
      } else if (t.type === 'expense') {
        dateMap[d].expense += parseFloat(t.amount) || 0;
      }
    });

    // Sort dates ascending
    const sortedDates = Object.keys(dateMap).sort();
    // Take the most recent 7 entries for clean display
    const recentDates = sortedDates.slice(-7);

    const labels = recentDates.map(d => {
      const parts = d.split('-');
      return parts.length === 3 ? `${parts[2]}/${parts[1]}` : d;
    });

    const incomeData = recentDates.map(d => dateMap[d].income);
    const expenseData = recentDates.map(d => dateMap[d].expense);

    if (this.cashFlowBarChart) {
      this.cashFlowBarChart.destroy();
    }

    const { textColor, gridColor } = this.getChartColors();

    this.cashFlowBarChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels.length ? labels : ['No Data'],
        datasets: [
          {
            label: 'Income',
            data: incomeData.length ? incomeData : [0],
            backgroundColor: '#05cd99',
            borderRadius: 6,
            maxBarThickness: 24
          },
          {
            label: 'Expense',
            data: expenseData.length ? expenseData : [0],
            backgroundColor: '#ee5d50',
            borderRadius: 6,
            maxBarThickness: 24
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: 'Inter', size: 11 },
              callback: function(val) {
                const currency = store.getSettings().currency;
                const sym = CURRENCIES[currency]?.symbol || '₹';
                return `${sym}${val >= 1000 ? (val / 1000) + 'k' : val}`;
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 10,
              padding: 10,
              color: textColor,
              font: { family: 'Inter', size: 12 }
            }
          }
        }
      }
    });
  }

  // EMI Breakdown Chart
  renderEmiChart(principal, totalInterest) {
    const canvas = document.getElementById('emiChartCanvas');
    if (!canvas || !this.isChartJsAvailable()) return;

    if (this.emiChart) {
      this.emiChart.destroy();
    }

    const { textColor } = this.getChartColors();

    this.emiChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['Principal Loan Amount', 'Total Interest Payable'],
        datasets: [{
          data: [principal, totalInterest],
          backgroundColor: ['#4318ff', '#ffb547'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });
  }

  // SIP Wealth Gain Chart
  renderSipChart(investedAmount, estReturns) {
    const canvas = document.getElementById('sipChartCanvas');
    if (!canvas || !this.isChartJsAvailable()) return;

    if (this.sipChart) {
      this.sipChart.destroy();
    }

    const { textColor } = this.getChartColors();

    this.sipChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Total Invested Amount', 'Estimated Wealth Gain'],
        datasets: [{
          data: [investedAmount, estReturns],
          backgroundColor: ['#7551ff', '#05cd99'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });
  }

  // Re-render when theme or data updates
  refreshAll() {
    this.renderExpensePieChart();
    this.renderCashFlowBarChart();
  }
}

const charts = new FinanceCharts();
