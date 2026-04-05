import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { formatCurrency } from "@/lib/currency";

const cards = [
  { key: "balance", label: "Total Balance", icon: Wallet, colorClass: "text-primary" },
  { key: "income", label: "Total Income", icon: TrendingUp, colorClass: "text-income" },
  { key: "expenses", label: "Total Expenses", icon: TrendingDown, colorClass: "text-expense" },
  { key: "savings", label: "Savings Rate", icon: PiggyBank, colorClass: "text-warning" },
] as const;

function AnimatedValue({ value, isCurrency }: { value: number; isCurrency: boolean }) {
  const animated = useAnimatedCounter(value, 1400, isCurrency ? 0 : 1);
  if (isCurrency) return <>{formatCurrency(animated)}</>;
  return <>{animated.toFixed(1)}%</>;
}

export function SummaryCards() {
  const { balance, totalIncome, totalExpenses } = useFinance();
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const numericValues: Record<string, number> = {
    balance, income: totalIncome, expenses: totalExpenses, savings: savingsRate,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="glass-card card-hover rounded-xl p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">{card.label}</span>
            <div className={`p-1.5 sm:p-2 rounded-lg bg-secondary ${card.colorClass}`}>
              <card.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-bold tracking-tight tabular-nums">
            <AnimatedValue value={numericValues[card.key]} isCurrency={card.key !== "savings"} />
          </p>
        </motion.div>
      ))}
    </div>
  );
}
