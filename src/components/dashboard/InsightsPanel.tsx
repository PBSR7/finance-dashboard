import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";

export function InsightsPanel() {
  const { transactions, totalIncome, totalExpenses } = useFinance();

  const insights = useMemo(() => {
    const result: { icon: typeof TrendingUp; title: string; value: string; color: string }[] = [];

    const byCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      });
    const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      result.push({
        icon: TrendingUp,
        title: "Top Spending",
        value: `${sorted[0][0]}: ₹${sorted[0][1].toLocaleString("en-IN")}`,
        color: "text-expense",
      });
    }

    const monthly: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const m = t.date.slice(0, 7);
        monthly[m] = (monthly[m] || 0) + t.amount;
      });
    const months = Object.keys(monthly).sort();
    if (months.length >= 2) {
      const curr = monthly[months[months.length - 1]];
      const prev = monthly[months[months.length - 2]];
      const change = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
      result.push({
        icon: change > 0 ? TrendingUp : TrendingDown,
        title: "Monthly Change",
        value: `${change > 0 ? "+" : ""}${change.toFixed(1)}% vs last month`,
        color: change > 0 ? "text-expense" : "text-income",
      });
    }

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    result.push({
      icon: savingsRate < 20 ? AlertTriangle : Lightbulb,
      title: "Savings Health",
      value: savingsRate < 10 ? "Low savings — consider cutting expenses" : savingsRate < 20 ? "Moderate savings — room to improve" : "Great savings rate!",
      color: savingsRate < 10 ? "text-expense" : savingsRate < 20 ? "text-warning" : "text-income",
    });

    if (transactions.length > 0) {
      const expenseCount = transactions.filter((t) => t.type === "expense").length;
      const avgExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;
      result.push({
        icon: Lightbulb,
        title: "Avg Expense",
        value: `₹${avgExpense.toFixed(0)} per transaction`,
        color: "text-chart-2",
      });
    }

    return result;
  }, [transactions, totalIncome, totalExpenses]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card card-hover rounded-xl p-4 sm:p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Insights</h3>
      <div className="space-y-3 sm:space-y-4">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
            <div className={`mt-0.5 ${insight.color}`}>
              <insight.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{insight.title}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{insight.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
