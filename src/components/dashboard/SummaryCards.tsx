import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const cards = [
  { key: "balance", label: "Total Balance", icon: Wallet, colorClass: "text-primary" },
  { key: "income", label: "Total Income", icon: TrendingUp, colorClass: "text-income" },
  { key: "expenses", label: "Total Expenses", icon: TrendingDown, colorClass: "text-expense" },
  { key: "savings", label: "Savings Rate", icon: DollarSign, colorClass: "text-warning" },
] as const;

export function SummaryCards() {
  const { balance, totalIncome, totalExpenses } = useFinance();
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const values: Record<string, string> = {
    balance: formatCurrency(balance),
    income: formatCurrency(totalIncome),
    expenses: formatCurrency(totalExpenses),
    savings: `${savingsRate.toFixed(1)}%`,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="glass-card card-hover rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">{card.label}</span>
            <div className={`p-2 rounded-lg bg-secondary ${card.colorClass}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight">{values[card.key]}</p>
        </motion.div>
      ))}
    </div>
  );
}
