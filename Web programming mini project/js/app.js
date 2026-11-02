/**
 * Personal Finance Dashboard - Main Application Controller
 * MCA 1st Semester Web Programming Mini Project
 * Module: UI Interactions, Event Listeners, State Coordination, and DOM Rendering
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Initial State & Elements
  // ==========================================
  const sidebar = document.getElementById('sidebar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const currencySelector = document.getElementById('currencySelector');
  const toastContainer = document.getElementById('toastContainer');
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  const tabContents = document.querySelectorAll('.tab-content');

  // Currency helper
  function getCurrencySymbol() {
    const code = store.getSettings().currency || 'INR';
    return CURRENCIES[code]?.symbol || '₹';
  }

  function formatMoney(amount) {
    const sym = getCurrencySymbol();
    const num = Math.abs(parseFloat(amount) || 0);
    return `${sym}${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  }

  // Update all currency labels in the DOM
  function updateCurrencyLabels() {
    const sym = getCurrencySymbol();
    document.querySelectorAll('.currency-label').forEach(el => el.textContent = sym);
  }

  // Toast Notification Trigger
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'circle-check' : (type === 'danger' ? 'triangle-exclamation' : 'circle-info');
    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================
  // 2. Theme Management (Dark / Light)
  // ==========================================
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    store.saveSettings({ theme });
    charts.refreshAll();
    updateCalculatorCharts();
  }

  const initialSettings = store.getSettings();
  applyTheme(initialSettings.theme || 'light');
  if (currencySelector) {
    currencySelector.value = initialSettings.currency || 'INR';
  }

  themeToggleBtn?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  currencySelector?.addEventListener('change', (e) => {
    const newCur = e.target.value;
    store.saveSettings({ currency: newCur });
    const settingCur = document.getElementById('settingCurrency');
    if (settingCur) settingCur.value = newCur;
    updateCurrencyLabels();
    refreshAllViews();
    showToast(`Currency changed to ${CURRENCIES[newCur]?.label}`);
  });

  // Mobile menu toggle
  mobileMenuBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar on click outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 820 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    }
  });

  // ==========================================
  // 3. Tab Navigation Controller
  // ==========================================
  function switchTab(tabId) {
    navLinks.forEach(link => {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    tabContents.forEach(tab => {
      if (tab.id === `tab-${tabId}`) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update Header Titles based on active tab
    const pageTitle = document.getElementById('pageTitle');
    const pageGreeting = document.getElementById('pageGreeting');
    const userName = store.getSettings().userName || 'MCA Scholar';

    switch (tabId) {
      case 'dashboard':
        pageTitle.textContent = 'Financial Overview';
        pageGreeting.textContent = `Welcome, ${userName}! Here is your current financial pulse.`;
        charts.refreshAll();
        break;
      case 'transactions':
        pageTitle.textContent = 'Transactions Management';
        pageGreeting.textContent = 'Manage, filter, search, and export your income & expense history.';
        renderTransactionsTable();
        break;
      case 'budgets':
        pageTitle.textContent = 'Budgets & Savings Goals';
        pageGreeting.textContent = 'Control category expenditures and monitor your academic savings targets.';
        renderBudgetsAndGoals();
        break;
      case 'analytics':
        pageTitle.textContent = 'Analytics & Viva Report';
        pageGreeting.textContent = 'Comprehensive statistical analysis ready for review and printing.';
        renderAnalyticsReport();
        break;
      case 'calculators':
        pageTitle.textContent = 'Financial Calculators';
        pageGreeting.textContent = 'Plan educational loans, compound SIP investments, and 50/30/20 budgets.';
        runAllCalculators();
        break;
      case 'settings':
        pageTitle.textContent = 'Settings & Data Management';
        pageGreeting.textContent = 'Backup, restore, and configure your dashboard preferences.';
        loadSettingsView();
        break;
    }

    // Close mobile drawer on navigation
    if (window.innerWidth <= 820) {
      sidebar.classList.remove('open');
    }
  }

  navLinks.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  document.getElementById('btnViewAllTxns')?.addEventListener('click', () => switchTab('transactions'));
  document.getElementById('btnManageGoals')?.addEventListener('click', () => switchTab('budgets'));
  document.getElementById('btnNewTxnFromTable')?.addEventListener('click', () => openTxnModal());

  // ==========================================
  // 4. Modal Management
  // ==========================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-close-modal');
      closeModal(targetId);
    });
  });

  // Close on backdrop click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Populate dynamic category dropdowns based on type (expense / income)
  function populateCategoryDropdown(selectElement, filterType = 'all') {
    if (!selectElement) return;
    selectElement.innerHTML = '';

    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      if (filterType === 'all' || cat.type === filterType || cat.type === 'both') {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = cat.name;
        selectElement.appendChild(opt);
      }
    });
  }

  // Populate account dropdown
  function populateAccountDropdown(selectElement) {
    if (!selectElement) return;
    selectElement.innerHTML = '';
    Object.entries(ACCOUNTS).forEach(([key, acc]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = acc.name;
      selectElement.appendChild(opt);
    });
  }

  // Open Add/Edit Transaction Modal
  const txnModalTitle = document.getElementById('txnModalTitle');
  const txnEditId = document.getElementById('txnEditId');
  const txnForm = document.getElementById('txnForm');
  const txnCategorySelect = document.getElementById('txnCategory');
  const txnAccountSelect = document.getElementById('txnAccount');
  const txnRadioTypes = document.querySelectorAll('input[name="txnType"]');

  function openTxnModal(existingTxn = null) {
    txnForm.reset();
    populateAccountDropdown(txnAccountSelect);

    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('txnDate').value = todayStr;

    if (existingTxn) {
      txnModalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Transaction';
      txnEditId.value = existingTxn.id;
      
      const typeRadio = document.querySelector(`input[name="txnType"][value="${existingTxn.type}"]`);
      if (typeRadio) typeRadio.checked = true;

      populateCategoryDropdown(txnCategorySelect, existingTxn.type);

      document.getElementById('txnAmount').value = existingTxn.amount;
      document.getElementById('txnDate').value = existingTxn.date;
      document.getElementById('txnTitle').value = existingTxn.title;
      txnCategorySelect.value = existingTxn.category;
      txnAccountSelect.value = existingTxn.account;
      document.getElementById('txnNotes').value = existingTxn.notes || '';
    } else {
      txnModalTitle.innerHTML = '<i class="fa-solid fa-circle-plus"></i> Add Transaction';
      txnEditId.value = '';
      populateCategoryDropdown(txnCategorySelect, 'expense');
    }

    openModal('transactionModal');
  }

  // Dynamic filter for categories when switching radio buttons
  txnRadioTypes.forEach(radio => {
    radio.addEventListener('change', (e) => {
      populateCategoryDropdown(txnCategorySelect, e.target.value);
    });
  });

  document.getElementById('btnOpenAddModal')?.addEventListener('click', () => openTxnModal());

  // Handle Transaction Form Submission
  txnForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedType = document.querySelector('input[name="txnType"]:checked')?.value || 'expense';
    const amount = parseFloat(document.getElementById('txnAmount').value);
    const date = document.getElementById('txnDate').value;
    const title = document.getElementById('txnTitle').value.trim();
    const category = txnCategorySelect.value;
    const account = txnAccountSelect.value;
    const notes = document.getElementById('txnNotes').value.trim();
    const editId = txnEditId.value;

    if (!amount || amount <= 0) {
      showToast('Please enter a valid positive amount', 'danger');
      return;
    }
    if (!title) {
      showToast('Please enter a transaction title', 'danger');
      return;
    }

    const txnData = { title, amount, type: selectedType, category, account, date, notes };

    if (editId) {
      store.updateTransaction(editId, txnData);
      showToast('Transaction updated successfully!', 'success');
    } else {
      store.addTransaction(txnData);
      showToast('New transaction added successfully!', 'success');
    }

    closeModal('transactionModal');
    refreshAllViews();
  });

  // ==========================================
  // 5. Dashboard View Rendering
  // ==========================================
  function renderDashboard() {
    const overview = store.calculateOverview();
    const sym = getCurrencySymbol();

    // Top metrics
    const netBalEl = document.getElementById('cardNetBalance');
    if (netBalEl) {
      netBalEl.textContent = `${sym}${overview.totalBalance.toLocaleString('en-IN')}`;
      netBalEl.style.color = overview.totalBalance >= 0 ? '' : 'var(--danger)';
    }

    const incomeEl = document.getElementById('cardTotalIncome');
    if (incomeEl) incomeEl.textContent = `${sym}${overview.totalIncome.toLocaleString('en-IN')}`;

    const expenseEl = document.getElementById('cardTotalExpense');
    if (expenseEl) expenseEl.textContent = `${sym}${overview.totalExpense.toLocaleString('en-IN')}`;

    const savingsEl = document.getElementById('cardSavingsRate');
    if (savingsEl) savingsEl.textContent = `${overview.savingsRate}%`;

    const savingsBadge = document.getElementById('cardSavingsBadge');
    if (savingsBadge) {
      if (overview.savingsRate >= 20) {
        savingsBadge.className = 'metric-badge positive';
        savingsBadge.textContent = 'Healthy Savings';
      } else if (overview.savingsRate > 0) {
        savingsBadge.className = 'metric-badge neutral';
        savingsBadge.textContent = 'Low Buffer';
      } else {
        savingsBadge.className = 'metric-badge negative';
        savingsBadge.textContent = 'Deficit Spend';
      }
    }

    const healthEl = document.getElementById('cardHealthScore');
    if (healthEl) healthEl.textContent = `${overview.healthScore}/100`;

    const healthLabel = document.getElementById('cardHealthLabel');
    if (healthLabel) {
      if (overview.healthScore >= 75) {
        healthLabel.className = 'metric-badge positive';
        healthLabel.textContent = 'Excellent';
      } else if (overview.healthScore >= 50) {
        healthLabel.className = 'metric-badge neutral';
        healthLabel.textContent = 'Fair';
      } else {
        healthLabel.className = 'metric-badge negative';
        healthLabel.textContent = 'Critical';
      }
    }

    // Wallets Container
    const walletsContainer = document.getElementById('walletsContainer');
    if (walletsContainer) {
      walletsContainer.innerHTML = '';
      Object.entries(ACCOUNTS).forEach(([key, acc]) => {
        const bal = overview.accountBalances[key] || 0;
        const chip = document.createElement('div');
        chip.className = 'wallet-chip';
        chip.innerHTML = `
          <div class="w-name">
            <i class="fa-solid ${acc.icon}"></i>
            <span>${acc.name.split(' ')[0]}</span>
          </div>
          <div class="w-bal" style="color: ${bal < 0 ? 'var(--danger)' : 'var(--text-primary)'}">
            ${sym}${bal.toLocaleString('en-IN')}
          </div>
        `;
        walletsContainer.appendChild(chip);
      });
    }

    // Recent Transactions (top 5)
    const recentBody = document.getElementById('dashboardRecentTxnsBody');
    if (recentBody) {
      const txns = store.getTransactions().slice(0, 5);
      if (txns.length === 0) {
        recentBody.innerHTML = `<tr><td colspan="5" class="empty-state">No transactions yet. Click "+ Add Transaction" to begin.</td></tr>`;
      } else {
        recentBody.innerHTML = txns.map(t => {
          const cat = CATEGORIES[t.category] || { name: t.category, icon: 'fa-tag', color: '#94a3b8' };
          const acc = ACCOUNTS[t.account] || { name: t.account };
          const isIncome = t.type === 'income';
          return `
            <tr>
              <td><span style="font-weight: 500; font-size: 0.85rem;">${t.date}</span></td>
              <td>
                <span class="cat-tag">
                  <span class="cat-icon-circle" style="background-color: ${cat.color}20; color: ${cat.color};">
                    <i class="fa-solid ${cat.icon}"></i>
                  </span>
                  ${cat.name}
                </span>
              </td>
              <td>
                <div style="font-weight: 600;">${escapeHtml(t.title)}</div>
                ${t.notes ? `<div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(t.notes)}</div>` : ''}
              </td>
              <td><span class="badge-account">${acc.name.split(' ')[0]}</span></td>
              <td style="text-align: right;">
                <span class="amount-text ${isIncome ? 'income' : 'expense'}">
                  ${isIncome ? '+' : '-'}${formatMoney(t.amount)}
                </span>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Quick Goal Highlight (first goal)
    const goalHighlight = document.getElementById('dashboardGoalHighlight');
    if (goalHighlight) {
      const goals = store.getGoals();
      if (goals.length === 0) {
        goalHighlight.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-muted);">No active goals. Add one in Budgets & Goals!</div>`;
      } else {
        const g = goals[0];
        const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
        goalHighlight.innerHTML = `
          <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">
            <span>${escapeHtml(g.title)}</span>
            <span style="color: var(--primary);">${pct}%</span>
          </div>
          <div class="progress-track" style="height: 8px; margin-bottom: 8px;">
            <div class="progress-fill safe" style="width: ${pct}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary);">
            <span>Saved: ${formatMoney(g.currentAmount)}</span>
            <span>Target: ${formatMoney(g.targetAmount)}</span>
          </div>
        `;
      }
    }

    charts.refreshAll();
  }

  // ==========================================
  // 6. Transactions Tab Controller
  // ==========================================
  const txnSearchInput = document.getElementById('txnSearchInput');
  const txnFilterType = document.getElementById('txnFilterType');
  const txnFilterCategory = document.getElementById('txnFilterCategory');
  const txnFilterAccount = document.getElementById('txnFilterAccount');
  const txnSortBy = document.getElementById('txnSortBy');
  const fullTxnBody = document.getElementById('fullTransactionsTableBody');
  const txnsEmptyState = document.getElementById('txnsEmptyState');
  const txnResultsCount = document.getElementById('txnResultsCount');

  // Populate Filter Dropdowns
  function initFilterDropdowns() {
    if (txnFilterCategory) {
      txnFilterCategory.innerHTML = '<option value="all">All Categories</option>';
      Object.entries(CATEGORIES).forEach(([key, cat]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = cat.name;
        txnFilterCategory.appendChild(opt);
      });
    }

    if (txnFilterAccount) {
      txnFilterAccount.innerHTML = '<option value="all">All Accounts</option>';
      Object.entries(ACCOUNTS).forEach(([key, acc]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = acc.name;
        txnFilterAccount.appendChild(opt);
      });
    }
  }

  function renderTransactionsTable() {
    let transactions = store.getTransactions();
    const query = txnSearchInput ? txnSearchInput.value.toLowerCase().trim() : '';
    const typeFilter = txnFilterType ? txnFilterType.value : 'all';
    const catFilter = txnFilterCategory ? txnFilterCategory.value : 'all';
    const accFilter = txnFilterAccount ? txnFilterAccount.value : 'all';
    const sortVal = txnSortBy ? txnSortBy.value : 'date-desc';

    // 1. Filtering
    transactions = transactions.filter(t => {
      const matchQuery = !query || 
        t.title.toLowerCase().includes(query) || 
        (t.notes && t.notes.toLowerCase().includes(query));
      
      const matchType = typeFilter === 'all' || t.type === typeFilter;
      const matchCat = catFilter === 'all' || t.category === catFilter;
      const matchAcc = accFilter === 'all' || t.account === accFilter;

      return matchQuery && matchType && matchCat && matchAcc;
    });

    // 2. Sorting
    transactions.sort((a, b) => {
      if (sortVal === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortVal === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortVal === 'amount-desc') return b.amount - a.amount;
      if (sortVal === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    // 3. Render count
    if (txnResultsCount) {
      txnResultsCount.textContent = `Showing ${transactions.length} record(s)`;
    }

    // 4. Render Table rows
    if (!fullTxnBody) return;

    if (transactions.length === 0) {
      fullTxnBody.innerHTML = '';
      if (txnsEmptyState) txnsEmptyState.style.display = 'block';
      return;
    }

    if (txnsEmptyState) txnsEmptyState.style.display = 'none';

    fullTxnBody.innerHTML = transactions.map(t => {
      const cat = CATEGORIES[t.category] || { name: t.category, icon: 'fa-tag', color: '#94a3b8' };
      const acc = ACCOUNTS[t.account] || { name: t.account };
      const isIncome = t.type === 'income';

      return `
        <tr>
          <td><span style="font-weight: 500;">${t.date}</span></td>
          <td>
            <span class="cat-tag">
              <span class="cat-icon-circle" style="background-color: ${cat.color}20; color: ${cat.color};">
                <i class="fa-solid ${cat.icon}"></i>
              </span>
              ${cat.name}
            </span>
          </td>
          <td>
            <div style="font-weight: 600;">${escapeHtml(t.title)}</div>
            ${t.notes ? `<div style="font-size: 0.78rem; color: var(--text-muted);">${escapeHtml(t.notes)}</div>` : ''}
          </td>
          <td><span class="badge-account">${acc.name}</span></td>
          <td>
            <span class="metric-badge ${isIncome ? 'positive' : 'negative'}">
              ${isIncome ? 'Income' : 'Expense'}
            </span>
          </td>
          <td style="text-align: right;">
            <span class="amount-text ${isIncome ? 'income' : 'expense'}">
              ${isIncome ? '+' : '-'}${formatMoney(t.amount)}
            </span>
          </td>
          <td>
            <div class="row-actions" style="justify-content: center;">
              <button class="btn-icon-action" data-edit-id="${t.id}" title="Edit Transaction">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn-icon-action delete" data-delete-id="${t.id}" title="Delete Transaction">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach row action listeners (Event delegation)
    fullTxnBody.querySelectorAll('[data-edit-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-edit-id');
        const txn = store.getTransactions().find(t => t.id === id);
        if (txn) openTxnModal(txn);
      });
    });

    fullTxnBody.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-id');
        if (confirm('Are you sure you want to delete this transaction entry?')) {
          store.deleteTransaction(id);
          showToast('Transaction removed', 'warning');
          refreshAllViews();
        }
      });
    });
  }

  // Filter Event Listeners
  [txnSearchInput, txnFilterType, txnFilterCategory, txnFilterAccount, txnSortBy].forEach(el => {
    el?.addEventListener('input', renderTransactionsTable);
    el?.addEventListener('change', renderTransactionsTable);
  });

  document.getElementById('btnClearTxnFilters')?.addEventListener('click', () => {
    if (txnSearchInput) txnSearchInput.value = '';
    if (txnFilterType) txnFilterType.value = 'all';
    if (txnFilterCategory) txnFilterCategory.value = 'all';
    if (txnFilterAccount) txnFilterAccount.value = 'all';
    if (txnSortBy) txnSortBy.value = 'date-desc';
    renderTransactionsTable();
  });

  // CSV Export Trigger
  document.getElementById('btnExportCSV')?.addEventListener('click', () => {
    const csvContent = store.exportCSV();
    if (!csvContent) {
      showToast('No transactions to export', 'warning');
      return;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FinFlow_Transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Transactions exported to CSV!');
  });

  // ==========================================
  // 7. Budgets & Goals Controller
  // ==========================================
  const budgetCardsGrid = document.getElementById('budgetCardsGrid');
  const goalsCardsGrid = document.getElementById('goalsCardsGrid');
  const budgetCategorySelect = document.getElementById('budgetCategorySelect');

  function renderBudgetsAndGoals() {
    const budgets = store.getBudgets();
    const goals = store.getGoals();
    const transactions = store.getTransactions().filter(t => t.type === 'expense');

    // Calculate actual spending per category
    const spentByCategory = {};
    transactions.forEach(t => {
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + (parseFloat(t.amount) || 0);
    });

    // 1. Render Budgets Grid
    if (budgetCardsGrid) {
      const budgetEntries = Object.entries(budgets);
      if (budgetEntries.length === 0) {
        budgetCardsGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">No budget limits configured. Click "Set Budget Limits" to add one.</div>`;
      } else {
        budgetCardsGrid.innerHTML = budgetEntries.map(([catKey, b]) => {
          const cat = CATEGORIES[catKey] || { name: catKey, icon: 'fa-tag', color: '#94a3b8' };
          const spent = spentByCategory[catKey] || 0;
          const limit = b.limit || 1;
          const pct = Math.round((spent / limit) * 100);
          const remaining = limit - spent;

          let statusClass = 'safe';
          let badgeText = 'Within Budget';
          if (pct > 100) {
            statusClass = 'danger';
            badgeText = 'Over Budget!';
          } else if (pct > 80) {
            statusClass = 'warning';
            badgeText = 'Near Limit';
          }

          return `
            <div class="budget-card">
              <div class="budget-top">
                <span class="cat-tag">
                  <span class="cat-icon-circle" style="background-color: ${cat.color}20; color: ${cat.color};">
                    <i class="fa-solid ${cat.icon}"></i>
                  </span>
                  ${cat.name}
                </span>
                <span class="metric-badge ${statusClass === 'safe' ? 'positive' : (statusClass === 'danger' ? 'negative' : 'neutral')}">
                  ${badgeText}
                </span>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 0.82rem; color: var(--text-secondary);">Spent: <strong>${formatMoney(spent)}</strong></span>
                  <span style="font-size: 0.82rem; font-weight: 700;">${pct}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill ${statusClass}" style="width: ${Math.min(100, pct)}%;"></div>
                </div>
              </div>

              <div class="budget-stats">
                <span>Limit: <strong>${formatMoney(limit)}</strong></span>
                <span>Remaining: <strong style="color: ${remaining < 0 ? 'var(--danger)' : 'var(--success)'};">${formatMoney(remaining)}</strong></span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // 2. Render Goals Grid
    if (goalsCardsGrid) {
      if (goals.length === 0) {
        goalsCardsGrid.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;">No goals set yet. Create an academic or personal savings goal!</div>`;
      } else {
        goalsCardsGrid.innerHTML = goals.map(g => {
          const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          const remaining = Math.max(0, g.targetAmount - g.currentAmount);

          return `
            <div class="goal-card">
              <div class="goal-top">
                <h4 style="font-size: 1rem; font-weight: 700;">${escapeHtml(g.title)}</h4>
                <button class="btn-icon-action delete" data-delete-goal="${g.id}" title="Remove Goal">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>

              <div style="font-size: 0.8rem; color: var(--text-muted);">
                <i class="fa-solid fa-calendar-day"></i> Target Date: ${g.targetDate || 'Not set'}
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 0.85rem; font-weight: 600; color: var(--primary);">${formatMoney(g.currentAmount)}</span>
                  <span style="font-size: 0.85rem; font-weight: 700;">${pct}%</span>
                </div>
                <div class="progress-track" style="height: 10px;">
                  <div class="progress-fill safe" style="width: ${pct}%;"></div>
                </div>
              </div>

              <div class="budget-stats">
                <span>Target: <strong>${formatMoney(g.targetAmount)}</strong></span>
                <span>Remaining: <strong>${formatMoney(remaining)}</strong></span>
              </div>

              <button class="btn btn-secondary btn-sm" style="width: 100%; margin-top: 6px;" data-deposit-goal="${g.id}" data-goal-title="${escapeHtml(g.title)}">
                <i class="fa-solid fa-circle-dollar-to-slot"></i> Deposit Funds
              </button>
            </div>
          `;
        }).join('');

        // Attach listeners to goals buttons
        goalsCardsGrid.querySelectorAll('[data-delete-goal]').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-delete-goal');
            if (confirm('Are you sure you want to remove this goal?')) {
              store.deleteGoal(id);
              showToast('Goal removed', 'warning');
              renderBudgetsAndGoals();
              renderDashboard();
            }
          });
        });

        goalsCardsGrid.querySelectorAll('[data-deposit-goal]').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-deposit-goal');
            const title = btn.getAttribute('data-goal-title');
            document.getElementById('depositGoalId').value = id;
            document.getElementById('depositGoalPrompt').textContent = `Add savings to: "${title}"`;
            document.getElementById('depositAmount').value = '';
            openModal('goalDepositModal');
          });
        });
      }
    }
  }

  // Budget Modal Open & Submit
  document.getElementById('btnOpenSetBudgetModal')?.addEventListener('click', () => {
    if (budgetCategorySelect) {
      budgetCategorySelect.innerHTML = '';
      Object.entries(CATEGORIES).filter(([k, v]) => v.type === 'expense' || v.type === 'both').forEach(([key, cat]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = cat.name;
        budgetCategorySelect.appendChild(opt);
      });
    }
    openModal('budgetModal');
  });

  document.getElementById('budgetForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = budgetCategorySelect.value;
    const limit = parseFloat(document.getElementById('budgetLimitInput').value);
    if (!limit || limit <= 0) {
      showToast('Please enter a valid budget limit', 'danger');
      return;
    }
    store.setBudget(category, limit);
    closeModal('budgetModal');
    renderBudgetsAndGoals();
    showToast(`Budget limit updated for ${CATEGORIES[category]?.name || category}!`);
  });

  // Goal Modal Open & Submit
  document.getElementById('btnOpenAddGoalModal')?.addEventListener('click', () => {
    document.getElementById('goalForm').reset();
    const nextYear = new Date();
    nextYear.setMonth(nextYear.getMonth() + 6);
    document.getElementById('goalDate').value = nextYear.toISOString().split('T')[0];
    openModal('goalModal');
  });

  document.getElementById('goalForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('goalTitle').value.trim();
    const targetAmount = parseFloat(document.getElementById('goalTarget').value);
    const currentAmount = parseFloat(document.getElementById('goalCurrent').value) || 0;
    const targetDate = document.getElementById('goalDate').value;

    if (!title || !targetAmount || targetAmount <= 0) {
      showToast('Please enter goal title and target amount', 'danger');
      return;
    }

    store.addGoal({ title, targetAmount, currentAmount, targetDate });
    closeModal('goalModal');
    renderBudgetsAndGoals();
    renderDashboard();
    showToast('New savings goal created!');
  });

  // Goal Deposit Submit
  document.getElementById('goalDepositForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const goalId = document.getElementById('depositGoalId').value;
    const amount = parseFloat(document.getElementById('depositAmount').value);

    if (!amount || amount <= 0) {
      showToast('Please enter a valid amount', 'danger');
      return;
    }

    store.updateGoalProgress(goalId, amount);
    closeModal('goalDepositModal');
    renderBudgetsAndGoals();
    renderDashboard();
    showToast(`Successfully deposited ${formatMoney(amount)} into goal!`, 'success');
  });

  // ==========================================
  // 8. Analytics & Report View
  // ==========================================
  function renderAnalyticsReport() {
    const reportBox = document.getElementById('analyticsReportContainer');
    if (!reportBox) return;

    const overview = store.calculateOverview();
    const transactions = store.getTransactions();
    const expenses = transactions.filter(t => t.type === 'expense');

    const catTotals = {};
    expenses.forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });

    const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCats.length > 0 ? CATEGORIES[sortedCats[0][0]]?.name || sortedCats[0][0] : 'None';
    const topCatSpent = sortedCats.length > 0 ? sortedCats[0][1] : 0;
    const topPct = overview.totalExpense > 0 ? Math.round((topCatSpent / overview.totalExpense) * 100) : 0;

    reportBox.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div style="background: var(--bg-input); padding: 16px; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 0.8rem; color: var(--text-secondary);">Total Recorded Transactions</div>
          <div style="font-size: 1.5rem; font-weight: 700;">${transactions.length}</div>
        </div>
        <div style="background: var(--bg-input); padding: 16px; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 0.8rem; color: var(--text-secondary);">Highest Expense Category</div>
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--danger);">${topCategory} (${topPct}%)</div>
        </div>
        <div style="background: var(--bg-input); padding: 16px; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 0.8rem; color: var(--text-secondary);">Net Monthly Surplus / Deficit</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: ${overview.totalBalance >= 0 ? 'var(--success)' : 'var(--danger)'};">
            ${formatMoney(overview.totalBalance)}
          </div>
        </div>
        <div style="background: var(--bg-input); padding: 16px; border-radius: var(--border-radius-md); border: 1px solid var(--border-color);">
          <div style="font-size: 0.8rem; color: var(--text-secondary);">Savings Ratio Rating</div>
          <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">
            ${overview.savingsRate}% (${overview.savingsRate >= 20 ? 'Optimal' : 'Needs Optimization'})
          </div>
        </div>
      </div>

      <h3 style="font-size: 1rem; margin-bottom: 12px; font-weight: 700;">
        <i class="fa-solid fa-list-check"></i> Category Spending Distribution
      </h3>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Spent</th>
              <th>Share of Expenses</th>
              <th>Monthly Budget</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${sortedCats.length === 0 ? '<tr><td colspan="5" style="text-align:center;">No expense records available.</td></tr>' :
              sortedCats.map(([catKey, amt]) => {
                const cat = CATEGORIES[catKey] || { name: catKey, icon: 'fa-tag', color: '#94a3b8' };
                const pct = overview.totalExpense > 0 ? ((amt / overview.totalExpense) * 100).toFixed(1) : 0;
                const budget = store.getBudgets()[catKey]?.limit || 0;
                const isOver = budget > 0 && amt > budget;

                return `
                  <tr>
                    <td>
                      <span class="cat-tag">
                        <span class="cat-icon-circle" style="background-color: ${cat.color}20; color: ${cat.color};">
                          <i class="fa-solid ${cat.icon}"></i>
                        </span>
                        ${cat.name}
                      </span>
                    </td>
                    <td><strong>${formatMoney(amt)}</strong></td>
                    <td>${pct}%</td>
                    <td>${budget > 0 ? formatMoney(budget) : 'Not configured'}</td>
                    <td>
                      <span class="metric-badge ${isOver ? 'negative' : (budget > 0 ? 'positive' : 'neutral')}">
                        ${isOver ? 'Exceeded Budget' : (budget > 0 ? 'Within Limit' : 'Uncapped')}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')
            }
          </tbody>
        </table>
      </div>

      <div style="margin-top: 24px; padding: 16px; border-radius: var(--border-radius-md); background-color: var(--primary-light); border: 1px solid var(--border-color);">
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary); margin-bottom: 6px;">
          <i class="fa-solid fa-lightbulb"></i> Academic Viva Note & Financial Recommendations:
        </h4>
        <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--text-primary); line-height: 1.6;">
          <li>Your top spending sector is <strong>${topCategory}</strong> consuming ${topPct}% of your budget.</li>
          <li>Maintaining a savings rate above 20% fulfills the classical Keynesian / 50-30-20 rule for students.</li>
          <li>All metrics update dynamically via Vanilla JavaScript without full-page refreshes using the HTML5 DOM and LocalStorage.</li>
        </ul>
      </div>
    `;
  }

  // ==========================================
  // 9. Financial Calculators Controller
  // ==========================================
  const emiPrincipal = document.getElementById('emiPrincipal');
  const emiRate = document.getElementById('emiRate');
  const emiTenure = document.getElementById('emiTenure');

  const sipMonthly = document.getElementById('sipMonthly');
  const sipReturn = document.getElementById('sipReturn');
  const sipTenure = document.getElementById('sipTenure');

  function calculateAndRenderEMI() {
    const P = parseFloat(emiPrincipal.value) || 0;
    const R = parseFloat(emiRate.value) || 0;
    const N = parseFloat(emiTenure.value) || 0;

    const res = Calculators.calculateEMI(P, R, N);
    document.getElementById('emiResultMonthly').textContent = formatMoney(res.monthlyEmi);
    document.getElementById('emiResultInterest').textContent = formatMoney(res.totalInterest);
    document.getElementById('emiResultTotal').textContent = formatMoney(res.totalPayment);

    charts.renderEmiChart(P, res.totalInterest);
  }

  function calculateAndRenderSIP() {
    const P = parseFloat(sipMonthly.value) || 0;
    const R = parseFloat(sipReturn.value) || 0;
    const N = parseFloat(sipTenure.value) || 0;

    const res = Calculators.calculateSIP(P, R, N);
    document.getElementById('sipResultInvested').textContent = formatMoney(res.investedAmount);
    document.getElementById('sipResultReturns').textContent = formatMoney(res.estReturns);
    document.getElementById('sipResultTotal').textContent = formatMoney(res.totalValue);

    charts.renderSipChart(res.investedAmount, res.estReturns);
  }

  function calculateAndRender503020() {
    const income = parseFloat(document.getElementById('ruleMonthlyIncome')?.value) || 0;
    const res = Calculators.calculate503020(income);
    const grid = document.getElementById('ruleResultsGrid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="metric-card balance">
        <div class="metric-info">
          <div class="metric-label">50% Needs</div>
          <div class="metric-value">${formatMoney(res.needs)}</div>
          <div class="metric-sub">Rent, groceries, utility bills & tuition</div>
        </div>
      </div>
      <div class="metric-card expense">
        <div class="metric-info">
          <div class="metric-label">30% Wants</div>
          <div class="metric-value">${formatMoney(res.wants)}</div>
          <div class="metric-sub">Dining out, entertainment, shopping</div>
        </div>
      </div>
      <div class="metric-card income">
        <div class="metric-info">
          <div class="metric-label">20% Savings</div>
          <div class="metric-value">${formatMoney(res.savings)}</div>
          <div class="metric-sub">Emergency fund, mutual funds & certifications</div>
        </div>
      </div>
    `;
  }

  function updateCalculatorCharts() {
    if (document.getElementById('tab-calculators')?.classList.contains('active')) {
      calculateAndRenderEMI();
      calculateAndRenderSIP();
    }
  }

  function runAllCalculators() {
    calculateAndRenderEMI();
    calculateAndRenderSIP();
    calculateAndRender503020();
  }

  [emiPrincipal, emiRate, emiTenure].forEach(el => el?.addEventListener('input', calculateAndRenderEMI));
  [sipMonthly, sipReturn, sipTenure].forEach(el => el?.addEventListener('input', calculateAndRenderSIP));
  document.getElementById('btnCalculate503020')?.addEventListener('click', calculateAndRender503020);

  // ==========================================
  // 10. Settings & Backup Controller
  // ==========================================
  function loadSettingsView() {
    const s = store.getSettings();
    const nameInput = document.getElementById('settingUserName');
    const curSelect = document.getElementById('settingCurrency');
    if (nameInput) nameInput.value = s.userName || 'MCA Student';
    if (curSelect) curSelect.value = s.currency || 'INR';
  }

  document.getElementById('btnSavePreferences')?.addEventListener('click', () => {
    const name = document.getElementById('settingUserName').value.trim();
    const currency = document.getElementById('settingCurrency').value;

    store.saveSettings({ userName: name, currency });
    if (currencySelector) currencySelector.value = currency;
    updateCurrencyLabels();
    refreshAllViews();
    showToast('Preferences saved successfully!');
  });

  // Download JSON Backup
  document.getElementById('btnDownloadJSON')?.addEventListener('click', () => {
    const dataStr = store.exportToJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FinFlow_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON downloaded!');
  });

  // Restore JSON File
  document.getElementById('importJSONFile')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const ok = store.importFromJSON(event.target.result);
      if (ok) {
        showToast('Backup restored successfully!', 'success');
        refreshAllViews();
      } else {
        showToast('Invalid JSON backup file', 'danger');
      }
    };
    reader.readAsText(file);
  });

  // Reset to Defaults (Quick Demo & Settings Button)
  function handleResetDemo() {
    if (confirm('Reload default sample data? This will restore initial MCA demo transactions and goals.')) {
      store.resetToDefaults();
      refreshAllViews();
      showToast('Demo data reloaded!', 'info');
    }
  }

  document.getElementById('btnQuickDemo')?.addEventListener('click', handleResetDemo);
  document.getElementById('btnResetToDefaults')?.addEventListener('click', handleResetDemo);

  // Clear All Data
  document.getElementById('btnClearAllData')?.addEventListener('click', () => {
    if (confirm('CAUTION: This will delete all your transactions, budgets, and goals! Proceed?')) {
      store.saveTransactions([]);
      store.saveGoals([]);
      refreshAllViews();
      showToast('All transaction records cleared', 'warning');
    }
  });

  // ==========================================
  // 11. Helper utilities & Refresh Coordinator
  // ==========================================
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function refreshAllViews() {
    renderDashboard();
    renderTransactionsTable();
    renderBudgetsAndGoals();
    renderAnalyticsReport();
  }

  // Initial Boot
  initFilterDropdowns();
  updateCurrencyLabels();
  refreshAllViews();
  runAllCalculators();
});
