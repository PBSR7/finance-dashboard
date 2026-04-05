import { useMemo } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { Progress } from "@/components/ui/progress";
import { Category } from "@/data/mockData";

const MONTHLY_BUDGETS: Partial<Record<Category, number>> = {
  "Food & Dining": 500,
  Shopping: 400,
  Transportation: 200,
  Entertainment: 150,
  "Bills & Utilities": 600,
  Healthcare: 300,
  Education: 250,
  Travel: 500,
  Subscriptions: 60,
};

export function BudgetTracker() {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const months = [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort();
    const targetMonth = months.includes(currentMonth) ? currentMonth : months[months.length - 1] || currentMonth;

    const spending: Partial<Record<Category, number>> = {};
    transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(targetMonth))
      .forEach((t) => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });

    return Object.entries(MONTHLY_BUDGETS)
      .map(([cat, budget]) => ({
        category: cat as Category,
        spent: spending[cat as Category] || 0,
        budget,
        percent: Math.min(((spending[cat as Category] || 0) / budget) * 100, 100),
        over: (spending[cat as Category] || 0) > budget,
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="glass-card card-hover rounded-xl p-4 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Monthly Budget</h3>
      </div>
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {data.map((item, i) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground truncate text-xs sm:text-sm">{item.category}</span>
              <span className={`font-medium tabular-nums text-xs sm:text-sm ${item.over ? "text-expense" : "text-foreground"}`}>
                ₹{item.spent.toLocaleString("en-IN")} / ₹{item.budget.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="relative">
              <Progress
                value={item.percent}
                className="h-2 bg-secondary"
              />
              <div
                className={`absolute inset-0 h-2 rounded-full transition-all ${
                  item.over
                    ? "bg-expense"
                    : item.percent > 75
                    ? "bg-warning"
                    : "bg-primary"
                }`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
