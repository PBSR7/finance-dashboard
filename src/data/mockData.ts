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

const categories: { category: Category; type: TransactionType; range: [number, number] }[] = [
  { category: "Salary", type: "income", range: [3000, 5500] },
  { category: "Freelance", type: "income", range: [500, 2500] },
  { category: "Investments", type: "income", range: [100, 1200] },
  { category: "Food & Dining", type: "expense", range: [15, 120] },
  { category: "Shopping", type: "expense", range: [20, 350] },
  { category: "Transportation", type: "expense", range: [10, 80] },
  { category: "Entertainment", type: "expense", range: [10, 100] },
  { category: "Bills & Utilities", type: "expense", range: [50, 300] },
  { category: "Healthcare", type: "expense", range: [30, 500] },
  { category: "Education", type: "expense", range: [50, 400] },
  { category: "Travel", type: "expense", range: [100, 800] },
  { category: "Subscriptions", type: "expense", range: [5, 30] },
];

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

export function generateTransactions(): Transaction[] {
  const txns: Transaction[] = [];
  let id = 1;

  for (let month = 0; month < 6; month++) {
    // 1-2 income items per month
    const incomeCount = 1 + Math.floor(seededRandom(month * 100) * 2);
    for (let i = 0; i < incomeCount; i++) {
      const cat = categories.filter((c) => c.type === "income")[Math.floor(seededRandom(month * 10 + i) * 3)];
      const day = 1 + Math.floor(seededRandom(id * 7) * 27);
      const amt = cat.range[0] + Math.floor(seededRandom(id * 13) * (cat.range[1] - cat.range[0]));
      const descs = descriptions[cat.category];
      txns.push({
        id: `txn-${id++}`,
        date: `2025-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        description: descs[Math.floor(seededRandom(id) * descs.length)],
        amount: amt,
        category: cat.category,
        type: "income",
      });
    }

    // 8-15 expense items per month
    const expenseCount = 8 + Math.floor(seededRandom(month * 200 + 1) * 8);
    for (let i = 0; i < expenseCount; i++) {
      const expenseCats = categories.filter((c) => c.type === "expense");
      const cat = expenseCats[Math.floor(seededRandom(month * 50 + i * 3) * expenseCats.length)];
      const day = 1 + Math.floor(seededRandom(id * 11) * 27);
      const amt = cat.range[0] + Math.floor(seededRandom(id * 17) * (cat.range[1] - cat.range[0]));
      const descs = descriptions[cat.category];
      txns.push({
        id: `txn-${id++}`,
        date: `2025-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        description: descs[Math.floor(seededRandom(id * 3) * descs.length)],
        amount: amt,
        category: cat.category,
        type: "expense",
      });
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
