# FinFlow – Personal Finance Dashboard
### Master of Computer Applications (MCA) – 1st Semester Mini Project
**Course:** Web Programming / Web Technologies Laboratory  
**Stack:** HTML5, CSS3 (Custom Properties & Modern Responsive Grid), Vanilla JavaScript (ES6+), Chart.js (CDN), LocalStorage API.

---

## 📌 1. Project Overview & Objective
**FinFlow** is a modern, responsive, client-side personal finance management dashboard designed to assist students and young professionals in budgeting, tracking multi-wallet inflows/outflows, achieving savings milestones, and planning loans and compound investments.

Built strictly according to MCA 1st semester curriculum standards without heavy framework dependencies (like React, Angular, or Vue), this project demonstrates pure mastery over:
- Semantic HTML5 structure and accessible form controls.
- Advanced CSS3 styling with Custom Properties (variables), Flexbox, CSS Grid, animations, and Dark/Light theme switching.
- Asynchronous and event-driven Vanilla JavaScript (ES6+), Object-Oriented Store pattern, LocalStorage CRUD persistence, and dynamic DOM manipulation.
- Financial algorithms (Loan EMI amortization, Compound SIP Wealth Accumulation, and Keynesian 50/30/20 Budgeting).

---

## 🚀 2. Key Modules & Features

### 📊 Module 1: Real-Time Executive Dashboard
- **Key Financial Health Cards:** Instant overview of **Net Balance**, **Total Income**, **Total Expenses**, **Savings Ratio (%)**, and an intelligent **Financial Health Score (0–100)**.
- **Multi-Wallet Overview:** Real-time balances across cash, bank accounts, digital UPI wallets, credit cards, and savings reserves.
- **Visual Analytics:**
  - Cash Inflow vs. Outflow comparative bar chart over time.
  - Expense breakdown by category using an interactive Doughnut chart.
- **Recent Activity Feed:** Shows the latest 5 transactions with quick status indicators.

### 💳 Module 2: Transactions Management (CRUD)
- **Add, Edit, and Delete:** Full lifecycle management of transaction entries.
- **Multi-Criteria Search & Filtering:** Filter by Type (*Income / Expense*), Category (*Food, Housing, Education, Freelance, etc.*), and Account (*Bank, UPI, Cash*).
- **Sorting Engine:** Sort ascending or descending by Date or Amount.
- **Export to CSV:** One-click generation of `.csv` spreadsheet export for external record keeping.

### 🎯 Module 3: Budgets & Goal Tracking
- **Category Monthly Limits:** Assign budget ceilings to individual categories (e.g., Food, Entertainment, Shopping).
- **Visual Progress Bars:** Dynamic color-coded thresholds:
  - 🟢 **Safe:** Spending below 80% of limit.
  - 🟡 **Warning:** Spending between 80% and 100%.
  - 🔴 **Danger:** Spending exceeded budget limit.
- **Savings Goals Tracker:** Set targets with target deadlines (e.g., *Laptop Upgrade, AWS Certification, Emergency Fund*), track completion percentages, and deposit funds incrementally.

### 🧮 Module 4: Integrated Financial Calculators
1. **Loan EMI Calculator:**
   $$\text{EMI} = \frac{P \times r \times (1+r)^n}{(1+r)^n - 1}$$
   Computes monthly repayment, total interest, total payable amount, and interactive Principal vs. Interest pie chart.
2. **SIP / Compound Wealth Calculator:**
   $$M = P \times \frac{(1+i)^n - 1}{i} \times (1+i)$$
   Projects compound growth for early savings and mutual funds.
3. **50 / 30 / 20 Budget Rule Planner:**
   Automatically allocates net income into 50% Needs, 30% Wants, and 20% Savings.

### ⚙️ Module 5: Settings, Themes, and Data Security
- **Light & Dark Theme Switcher:** Smooth CSS transition preserved in LocalStorage.
- **Multi-Currency Support:** Seamless toggle between INR (₹), USD ($), and EUR (€).
- **Data Backup & Restore:** Export full state to a portable `.json` file or restore from a backup.
- **One-Click Demo Data:** Preloaded with realistic student mock records for instant viva demonstration.

---

## 📁 3. File & Folder Structure

```text
Web programming mini project/
│
├── index.html            # Main semantic HTML5 application layout & modals
├── README.md             # Project documentation & MCA viva guide
│
├── css/
│   └── style.css         # Modern styling, CSS variables, dark/light themes, print media
│
└── js/
    ├── data.js           # LocalStorage data store, mock data generator, CRUD helpers
    ├── charts.js         # Chart.js visualization wrappers and theme adapters
    ├── calculators.js    # Financial math formulas (EMI, SIP, 50-30-20 rule)
    └── app.js            # DOM controller, tab router, modal handling & event listeners
```

---

## 💻 4. How to Run the Project

1. **No Installation or Server Required!**
2. Simply double-click `index.html` or right-click and choose **"Open with Google Chrome"** (or Edge, Firefox, Safari).
3. (Optional for VS Code users): Right-click `index.html` and click **"Open with Live Server"**.
4. To test data persistence: Add a new transaction, refresh your browser (`F5`), and observe that the data remains intact!
5. To test backup: Go to **Settings & Backup** -> Click **Export Backup (JSON)**.

---

## 🎓 5. MCA 1st Sem Viva Voce Q&A Preparation

Here are answers to potential questions examiners or professors may ask during project evaluation:

### Q1: Why did you choose Vanilla JavaScript instead of frameworks like React or Angular?
> **Answer:** For an MCA 1st Semester Web Programming project, using Vanilla JavaScript (ES6+) showcases core fundamental competencies in DOM manipulation, JavaScript event handling, array higher-order methods (`map`, `filter`, `reduce`), and browser Web APIs (such as `localStorage` and `Blob`) without the abstraction layers of frameworks.

### Q2: How does data persistence work in this project?
> **Answer:** We utilize the HTML5 `localStorage` Web Storage API. When records are created or updated, JavaScript serializes the objects into JSON strings using `JSON.stringify()`. Upon page load, data is retrieved via `localStorage.getItem()` and parsed back into active JavaScript objects with `JSON.parse()`.

### Q3: How is the Light/Dark mode implemented?
> **Answer:** The theme is implemented using CSS Custom Properties (CSS variables) declared under the `:root` and `[data-theme="dark"]` selectors in `style.css`. When the theme toggle button is clicked, JavaScript updates the `data-theme` attribute on the root `<html>` element, triggering an instantaneous recalculation of colors across all components.

### Q4: How is responsive design achieved?
> **Answer:** The dashboard relies on CSS Flexbox and CSS Grid layouts combined with `@media` queries. For mobile screens (≤ 820px), the sidebar transitions off-screen with a slide-in drawer accessible via a hamburger button, and multi-column grids collapse gracefully into single-column layouts.

### Q5: What formula was used for the EMI Loan Calculator?
> **Answer:** The standard loan amortization formula:
> $$E = \frac{P \cdot r \cdot (1 + r)^n}{(1 + r)^n - 1}$$
> Where $P$ is the principal loan amount, $r$ is the monthly interest rate ($\text{Annual Rate} / 1200$), and $n$ is the total number of monthly payments.

### Q6: How does the CSV export feature work without a backend server?
> **Answer:** JavaScript constructs a comma-separated values string in memory from the transaction array, wraps it in an HTML5 `Blob` object with MIME type `text/csv`, creates a temporary object URL via `URL.createObjectURL(blob)`, and triggers an automatic browser download using a dynamic anchor `<a>` element.

---

## 👨‍💻 Project Metadata
- **Project Type:** MCA 1st Semester Mini Project
- **Subject:** Web Programming / Advanced Internet Technologies
- **Compatibility:** Modern Desktop, Tablet, and Mobile Web Browsers
