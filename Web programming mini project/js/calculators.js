/**
 * Personal Finance Dashboard - Financial Calculators
 * MCA 1st Semester Web Programming Mini Project
 * Module: EMI Loan Calculator, SIP Compound Wealth Calculator, 50-30-20 Rule
 */

const Calculators = {
  // Calculate Equated Monthly Installment (EMI)
  calculateEMI(principal, annualRate, tenureYears) {
    const P = parseFloat(principal);
    const R = parseFloat(annualRate);
    const N = parseFloat(tenureYears) * 12; // Total months

    if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || R < 0 || N <= 0) {
      return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0 };
    }

    if (R === 0) {
      const emi = P / N;
      return {
        monthlyEmi: Math.round(emi),
        totalInterest: 0,
        totalPayment: Math.round(P)
      };
    }

    const monthlyRate = R / (12 * 100);
    const emi = (P * monthlyRate * Math.pow(1 + monthlyRate, N)) / (Math.pow(1 + monthlyRate, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  },

  // Calculate Systematic Investment Plan (SIP)
  calculateSIP(monthlyInvestment, expectedReturnRate, tenureYears) {
    const P = parseFloat(monthlyInvestment);
    const annualRate = parseFloat(expectedReturnRate);
    const years = parseFloat(tenureYears);

    if (isNaN(P) || isNaN(annualRate) || isNaN(years) || P <= 0 || annualRate < 0 || years <= 0) {
      return { investedAmount: 0, estReturns: 0, totalValue: 0 };
    }

    const n = years * 12; // total months
    const i = annualRate / (12 * 100); // monthly interest

    const investedAmount = P * n;
    let totalValue = 0;

    if (i === 0) {
      totalValue = investedAmount;
    } else {
      // Future value of annuity due: FV = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
      totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }

    const estReturns = Math.max(0, totalValue - investedAmount);

    return {
      investedAmount: Math.round(investedAmount),
      estReturns: Math.round(estReturns),
      totalValue: Math.round(totalValue)
    };
  },

  // 50/30/20 Budget Rule Planner
  calculate503020(monthlyNetIncome) {
    const income = parseFloat(monthlyNetIncome) || 0;
    return {
      needs: Math.round(income * 0.50),     // 50% for Needs: Rent, groceries, bills, tuition
      wants: Math.round(income * 0.30),     // 30% for Wants: Dining out, gadgets, hobbies
      savings: Math.round(income * 0.20)   // 20% for Savings: Emergency fund, investments, SIP
    };
  }
};
