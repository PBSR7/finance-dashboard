export type TransactionType = "income" | "expense";

export type Category =
  | "Salary"
  | "Freelance"
  | "Investments"
  | "Food & Dining"
  | "Shopping"
  | "Transportation"
  | "Entertainment"
  | "Bills & Utilities"
  | "Healthcare"
  | "Education"
  | "Travel"
  | "Subscriptions";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

export type Role = "admin" | "viewer";

const descriptions: Record<Category, string[]> = {
  Salary: ["Monthly Salary", "Bonus Payment", "Overtime Pay"],
  Freelance: ["Web Design Project", "Consulting Fee", "Logo Design", "App Development"],
  Investments: ["Stock Dividends", "Crypto Gains", "Bond Interest", "Rental Income"],
  "Food & Dining": ["Grocery Store", "Restaurant Dinner", "Coffee Shop", "Food Delivery", "Lunch"],
  Shopping: ["Amazon Purchase", "Clothing Store", "Electronics", "Home Decor", "Books"],
  Transportation: ["Uber Ride", "Gas Station", "Metro Card", "Parking Fee", "Car Wash"],
  Entertainment: ["Netflix", "Movie Tickets", "Concert", "Gaming", "Spotify"],
  "Bills & Utilities": ["Electricity Bill", "Water Bill", "Internet", "Phone Bill", "Rent"],
  Healthcare: ["Doctor Visit", "Pharmacy", "Gym Membership", "Lab Tests"],
  Education: ["Online Course", "Textbooks", "Workshop", "Certification"],
  Travel: ["Flight Ticket", "Hotel Booking", "Airbnb", "Travel Insurance"],
  Subscriptions: ["Notion", "GitHub Pro", "Adobe CC", "iCloud Storage"],
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Target: ₹1,00,000 total income spread over 6 months
// ~₹16,667/month average income
// Expenses ~70-75% of income = ~₹70,000-75,000 total
export function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  let id = 1;

  // Fixed income distribution per month to hit exactly ₹1,00,000
  const monthlyIncome: { month: number; items: { category: Category; amount: number; desc: string }[] }[] = [
    {
      month: 1,
      items: [
        { category: "Salary", amount: 12000, desc: "Monthly Salary" },
        { category: "Freelance", amount: 5000, desc: "Web Design Project" },
      ],
    },
    {
      month: 2,
      items: [
        { category: "Salary", amount: 12000, desc: "Monthly Salary" },
        { category: "Investments", amount: 3000, desc: "Stock Dividends" },
      ],
    },
    {
      month: 3,
      items: [
        { category: "Salary", amount: 12000, desc: "Monthly Salary" },
        { category: "Freelance", amount: 6000, desc: "App Development" },
        { category: "Investments", amount: 2000, desc: "Bond Interest" },
      ],
    },
    {
      month: 4,
      items: [
        { category: "Salary", amount: 12000, desc: "Monthly Salary" },
        { category: "Freelance", amount: 4000, desc: "Consulting Fee" },
      ],
    },
    {
      month: 5,
      items: [
        { category: "Salary", amount: 12000, desc: "Monthly Salary" },
        { category: "Salary", amount: 5000, desc: "Bonus Payment" },
        { category: "Investments", amount: 3000, desc: "Rental Income" },
      ],
    },
    {
      month: 6,
      items: [
        { category: "Salary", amount: 12000, desc: "Monthly Salary" },
      ],
    },
  ];
  // Total: 12k*6 + 5k + 3k + 6k + 2k + 4k + 5k + 3k + 12k(m6 only salary) = wait let me recount
  // M1: 17000, M2: 15000, M3: 20000, M4: 16000, M5: 20000, M6: 12000 = 100000 ✓

  // Add income transactions
  for (const mi of monthlyIncome) {
    for (const item of mi.items) {
      const day = 1 + Math.floor(seededRandom(id * 7) * 27);
      txns.push({
        id: `txn-${id++}`,
        date: `2025-${String(mi.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        description: item.desc,
        amount: item.amount,
        category: item.category,
        type: "income",
      });
    }
  }

  // Expense budget per category (total ~₹72,000 across 6 months)
  const expenseBudgets: { category: Category; monthlyRange: [number, number]; countRange: [number, number] }[] = [
    { category: "Food & Dining", monthlyRange: [2000, 3500], countRange: [3, 5] },
    { category: "Shopping", monthlyRange: [1000, 3000], countRange: [1, 3] },
    { category: "Transportation", monthlyRange: [800, 1500], countRange: [2, 4] },
    { category: "Entertainment", monthlyRange: [500, 1200], countRange: [1, 3] },
    { category: "Bills & Utilities", monthlyRange: [3000, 4500], countRange: [3, 5] },
    { category: "Healthcare", monthlyRange: [500, 1500], countRange: [1, 2] },
    { category: "Education", monthlyRange: [500, 1500], countRange: [1, 2] },
    { category: "Travel", monthlyRange: [0, 2000], countRange: [0, 1] },
    { category: "Subscriptions", monthlyRange: [300, 600], countRange: [2, 4] },
  ];

  for (let month = 1; month <= 6; month++) {
    for (const budget of expenseBudgets) {
      const seed = month * 100 + expenseBudgets.indexOf(budget) * 13;
      const monthlyTotal = budget.monthlyRange[0] +
        Math.floor(seededRandom(seed) * (budget.monthlyRange[1] - budget.monthlyRange[0]));

      if (monthlyTotal === 0) continue;

      const count = budget.countRange[0] +
        Math.floor(seededRandom(seed + 1) * (budget.countRange[1] - budget.countRange[0] + 1));

      if (count === 0) continue;

      // Split monthly total into `count` transactions
      let remaining = monthlyTotal;
      const descs = descriptions[budget.category];

      for (let i = 0; i < count; i++) {
        const isLast = i === count - 1;
        const amt = isLast
          ? remaining
          : Math.max(50, Math.floor(remaining / (count - i) * (0.5 + seededRandom(id * 17))));
        remaining -= amt;
        if (remaining < 0) remaining = 0;

        const day = 1 + Math.floor(seededRandom(id * 11) * 27);
        txns.push({
          id: `txn-${id++}`,
          date: `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          description: descs[Math.floor(seededRandom(id * 3) * descs.length)],
          amount: amt,
          category: budget.category,
          type: "expense",
        });
        id++;
      }
    }
  }

  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Salary: "hsl(var(--chart-1))",
  Freelance: "hsl(var(--chart-2))",
  Investments: "hsl(var(--chart-6))",
  "Food & Dining": "hsl(var(--chart-4))",
  Shopping: "hsl(var(--chart-5))",
  Transportation: "hsl(var(--chart-2))",
  Entertainment: "hsl(var(--chart-3))",
  "Bills & Utilities": "hsl(var(--destructive))",
  Healthcare: "hsl(var(--chart-1))",
  Education: "hsl(var(--chart-2))",
  Travel: "hsl(var(--chart-4))",
  Subscriptions: "hsl(var(--chart-3))",
};

export const CATEGORY_CHART_COLORS = [
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--destructive))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-3))",
];
