/**
 * Personal Finance Dashboard - Data & LocalStorage Management
 * MCA 1st Semester Web Programming Mini Project
 * Module: Data Store, Preloaded Mock Data, CRUD Operations, and Persistence
 */

const STORAGE_KEYS = {
  TRANSACTIONS: 'mca_fin_transactions',
  BUDGETS: 'mca_fin_budgets',
  GOALS: 'mca_fin_goals',
  SETTINGS: 'mca_fin_settings'
};

// Standard Categories with visual styling
const CATEGORIES = {
  // Expense Categories
  food: { name: 'Food & Dining', icon: 'fa-utensils', color: '#ff7675', type: 'expense' },
  housing: { name: 'Rent & Housing', icon: 'fa-house', color: '#6c5ce7', type: 'expense' },
  transport: { name: 'Transportation', icon: 'fa-car', color: '#0984e3', type: 'expense' },
  utilities: { name: 'Bills & Utilities', icon: 'fa-bolt', color: '#fdcb6e', type: 'expense' },
  shopping: { name: 'Shopping & Clothes', icon: 'fa-bag-shopping', color: '#00cec9', type: 'expense' },
  entertainment: { name: 'Entertainment', icon: 'fa-film', color: '#e84393', type: 'expense' },
  health: { name: 'Health & Medical', icon: 'fa-heart-pulse', color: '#e17055', type: 'expense' },
  education: { name: 'MCA & Education', icon: 'fa-graduation-cap', color: '#00b894', type: 'expense' },
  
  // Income Categories
  salary: { name: 'Monthly Stipend / Salary', icon: 'fa-wallet', color: '#05cd99', type: 'income' },
  freelance: { name: 'Freelancing & Projects', icon: 'fa-briefcase', color: '#7551ff', type: 'income' },
  scholarship: { name: 'Scholarship / Allowance', icon: 'fa-award', color: '#4318ff', type: 'income' },
  investments: { name: 'Investments / Returns', icon: 'fa-chart-line', color: '#10b981', type: 'income' },
  
  // Generic
  other: { name: 'Other / Misc', icon: 'fa-ellipsis', color: '#94a3b8', type: 'both' }
};

// Supported Wallets / Accounts
const ACCOUNTS = {
  bank: { name: 'Bank Account (HDFC/SBI)', icon: 'fa-building-columns' },
  cash: { name: 'Physical Cash', icon: 'fa-money-bill-wave' },
  upi: { name: 'UPI / Digital Wallet', icon: 'fa-mobile-screen-button' },
  savings: { name: 'Emergency Savings Account', icon: 'fa-piggy-bank' },
  credit: { name: 'Credit Card', icon: 'fa-credit-card' }
};

// Currencies supported
const CURRENCIES = {
  INR: { symbol: '₹', code: 'INR', label: 'Indian Rupee (₹)' },
  USD: { symbol: '$', code: 'USD', label: 'US Dollar ($)' },
  EUR: { symbol: '€', code: 'EUR', label: 'Euro (€)' }
};

// Helper: generate unique ID
function generateId() {
  return 'txn_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Initial Sample Data Generator (Preloaded for MCA Project Viva & Evaluation)
function getInitialSampleData() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  
  // Format dates relative to current month so graphs always look active
  const d = (day) => `${y}-${m}-${String(day).padStart(2, '0')}`;

  const transactions = [
    {
      id: generateId(),
      title: 'College Scholarship Award',
      amount: 25000,
      type: 'income',
      category: 'scholarship',
      account: 'bank',
      date: d(1),
      notes: 'Semester merit scholarship grant'
    },
    {
      id: generateId(),
      title: 'Web Dev Freelance Gig',
      amount: 15000,
      type: 'income',
      category: 'freelance',
      account: 'upi',
      date: d(3),
      notes: 'Frontend UI design for client'
    },
    {
      id: generateId(),
      title: 'Semester Hostel & PG Rent',
      amount: 9500,
      type: 'expense',
      category: 'housing',
      account: 'bank',
      date: d(2),
      notes: 'Monthly room rent and maintenance'
    },
    {
      id: generateId(),
      title: 'MCA Textbooks & Reference Guides',
      amount: 2200,
      type: 'expense',
      category: 'education',
      account: 'upi',
      date: d(4),
      notes: 'Data Structures and Algorithms reference book'
    },
    {
      id: generateId(),
      title: 'Campus Cafeteria & Meals',
      amount: 1850,
      type: 'expense',
      category: 'food',
      account: 'upi',
      date: d(5),
      notes: 'Lunch & snacks with college classmates'
    },
    {
      id: generateId(),
      title: 'High-speed Broadband Fiber',
      amount: 999,
      type: 'expense',
      category: 'utilities',
      account: 'bank',
      date: d(6),
      notes: 'Monthly Internet connection'
    },
    {
      id: generateId(),
      title: 'Cloud Certification Exam Voucher',
      amount: 3500,
      type: 'expense',
      category: 'education',
      account: 'bank',
      date: d(8),
      notes: 'AWS / Cloud developer exam discount voucher'
    },
    {
      id: generateId(),
      title: 'Monthly Metro & Bus Pass',
      amount: 1100,
      type: 'expense',
      category: 'transport',
      account: 'cash',
      date: d(10),
      notes: 'Transit to campus'
    },
    {
      id: generateId(),
      title: 'Weekend Movie & Dinner',
      amount: 1250,
      type: 'expense',
      category: 'entertainment',
      account: 'upi',
      date: d(12),
      notes: 'Weekend outing with batchmates'
    },
    {
      id: generateId(),
      title: 'Gym & Badminton Membership',
      amount: 1200,
      type: 'expense',
      category: 'health',
      account: 'upi',
      date: d(14),
      notes: 'Monthly sports complex access'
    },
    {
      id: generateId(),
      title: 'Technical Consultation',
      amount: 8000,
      type: 'income',
      category: 'freelance',
      account: 'bank',
      date: d(15),
      notes: 'Debugged Python script for research scholar'
    },
    {
      id: generateId(),
      title: 'Electronics & Keyboard Upgrade',
      amount: 2400,
      type: 'expense',
      category: 'shopping',
      account: 'bank',
      date: d(18),
      notes: 'Mechanical keyboard for coding'
    },
    {
      id: generateId(),
      title: 'Groceries & Protein Supplies',
      amount: 2100,
      type: 'expense',
      category: 'food',
      account: 'cash',
      date: d(20),
      notes: 'Monthly supermarket essentials'
    }
  ];

  const budgets = {
    food: { category: 'food', limit: 6000 },
    housing: { category: 'housing', limit: 12000 },
    transport: { category: 'transport', limit: 2500 },
    utilities: { category: 'utilities', limit: 2000 },
    shopping: { category: 'shopping', limit: 4000 },
    entertainment: { category: 'entertainment', limit: 2500 },
    education: { category: 'education', limit: 8000 },
    health: { category: 'health', limit: 3000 }
  };

  const goals = [
    {
      id: 'goal_1',
      title: 'MCA Project & Lab Equipment',
      targetAmount: 20000,
      currentAmount: 14500,
      targetDate: `${y}-12-31`,
      category: 'education'
    },
    {
      id: 'goal_2',
      title: 'High-Performance Coding Laptop',
      targetAmount: 65000,
      currentAmount: 42000,
      targetDate: `${y + 1}-06-30`,
      category: 'shopping'
    },
    {
      id: 'goal_3',
      title: 'Emergency Student Cushion Fund',
      targetAmount: 30000,
      currentAmount: 22500,
      targetDate: `${y}-11-30`,
      category: 'other'
    }
  ];

  const settings = {
    userName: 'MCA Student',
    currency: 'INR',
    theme: 'light',
    monthlySavingsTarget: 15000
  };

  return { transactions, budgets, goals, settings };
}

// Data Store Class providing Clean API
class FinanceStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      this.resetToDefaults();
    }
  }

  resetToDefaults() {
    const data = getInitialSampleData();
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(data.budgets));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
  }

  // --- Transactions ---
  getTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading transactions', e);
      return [];
    }
  }

  saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  addTransaction(txn) {
    const transactions = this.getTransactions();
    const newTxn = {
      ...txn,
      id: generateId(),
      amount: parseFloat(txn.amount) || 0
    };
    transactions.unshift(newTxn);
    this.saveTransactions(transactions);
    return newTxn;
  }

  updateTransaction(id, updatedData) {
    let transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      transactions[index] = {
        ...transactions[index],
        ...updatedData,
        amount: parseFloat(updatedData.amount) || 0
      };
      this.saveTransactions(transactions);
      return transactions[index];
    }
    return null;
  }

  deleteTransaction(id) {
    let transactions = this.getTransactions();
    transactions = transactions.filter(t => t.id !== id);
    this.saveTransactions(transactions);
    return true;
  }

  // --- Budgets ---
  getBudgets() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  setBudget(categoryKey, limit) {
    const budgets = this.getBudgets();
    budgets[categoryKey] = {
      category: categoryKey,
      limit: parseFloat(limit) || 0
    };
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    return budgets;
  }

  // --- Goals ---
  getGoals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveGoals(goals) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  addGoal(goal) {
    const goals = this.getGoals();
    const newGoal = {
      ...goal,
      id: 'goal_' + Date.now(),
      targetAmount: parseFloat(goal.targetAmount) || 0,
      currentAmount: parseFloat(goal.currentAmount) || 0
    };
    goals.push(newGoal);
    this.saveGoals(goals);
    return newGoal;
  }

  updateGoalDeposit(id, deltaAmount) {
    const goals = this.getGoals();
    const goal = goals.find(g => g.id === id);
    if (goal) {
      goal.currentAmount = Math.max(0, goal.currentAmount + (parseFloat(deltaAmount) || 0));
      this.saveGoals(goals);
      return goal;
    }
    return null;
  }

  deleteGoal(id) {
    let goals = this.getGoals();
    goals = goals.filter(g => g.id !== id);
    this.saveGoals(goals);
    return true;
  }

  // --- Settings ---
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { userName: 'MCA Student', currency: 'INR', theme: 'light' };
    } catch (e) {
      return { userName: 'MCA Student', currency: 'INR', theme: 'light' };
    }
  }

  saveSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // --- Data Metrics Calculations ---
  calculateOverview() {
    const transactions = this.getTransactions();
    let totalIncome = 0;
    let totalExpense = 0;
    const accountBalances = {
      bank: 0,
      cash: 0,
      upi: 0,
      savings: 0,
      credit: 0
    };

    transactions.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      if (t.type === 'income') {
        totalIncome += amt;
        if (accountBalances[t.account] !== undefined) {
          accountBalances[t.account] += amt;
        }
      } else if (t.type === 'expense') {
        totalExpense += amt;
        if (accountBalances[t.account] !== undefined) {
          accountBalances[t.account] -= amt;
        }
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    // Financial Health Score algorithm (0 to 100)
    // Based on savings rate, expense coverage, and positive balance
    let score = 50; // base score
    if (savingsRate >= 40) score += 35;
    else if (savingsRate >= 20) score += 20;
    else if (savingsRate > 0) score += 10;
    else score -= 25;

    if (netSavings > 0) score += 15;
    score = Math.max(10, Math.min(98, score));

    return {
      totalBalance: netSavings,
      totalIncome,
      totalExpense,
      savingsRate,
      healthScore: score,
      accountBalances
    };
  }

  // Backup & Import
  exportToJSON() {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      transactions: this.getTransactions(),
      budgets: this.getBudgets(),
      goals: this.getGoals(),
      settings: this.getSettings()
    }, null, 2);
  }

  importFromJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.transactions && Array.isArray(parsed.transactions)) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(parsed.transactions));
      }
      if (parsed.budgets) {
        localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(parsed.budgets));
      }
      if (parsed.goals && Array.isArray(parsed.goals)) {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(parsed.goals));
      }
      if (parsed.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }

  exportCSV() {
    const transactions = this.getTransactions();
    if (transactions.length === 0) return '';
    const headers = ['ID', 'Date', 'Type', 'Category', 'Title', 'Amount', 'Account', 'Notes'];
    const rows = transactions.map(t => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.type}"`,
      `"${CATEGORIES[t.category]?.name || t.category}"`,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.amount,
      `"${ACCOUNTS[t.account]?.name || t.account}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

// Global instance
const store = new FinanceStore();
