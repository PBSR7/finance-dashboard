import { useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useFinance } from "@/contexts/FinanceContext";
import { formatCurrencyShort } from "@/lib/currency";

export function BalanceTrendChart() {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const monthly: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };
      if (t.type === "income") monthly[month].income += t.amount;
      else monthly[month].expense += t.amount;
    });

    const months = Object.keys(monthly).sort();
    let cumBalance = 0;
    return months.map((m) => {
      cumBalance += monthly[m].income - monthly[m].expense;
      const label = new Date(m + "-01").toLocaleString("en-US", { month: "short" });
      return {
        month: label,
        income: monthly[m].income,
        expense: monthly[m].expense,
        balance: cumBalance,
      };
    });
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center h-[340px]">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card card-hover rounded-xl p-4 sm:p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Balance Trend</h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--income))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--income))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => formatCurrencyShort(v)} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
            />
            <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" fill="url(#balanceGrad)" strokeWidth={2} name="Balance" />
            <Area type="monotone" dataKey="income" stroke="hsl(var(--income))" fill="url(#incomeGrad)" strokeWidth={1.5} strokeDasharray="5 5" name="Income" />
            <Line type="monotone" dataKey="expense" stroke="hsl(var(--expense))" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
