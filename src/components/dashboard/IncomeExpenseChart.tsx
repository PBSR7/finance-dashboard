import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useFinance } from "@/contexts/FinanceContext";

export function IncomeExpenseChart() {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const monthly: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };
      if (t.type === "income") monthly[month].income += t.amount;
      else monthly[month].expense += t.amount;
    });

    return Object.keys(monthly)
      .sort()
      .map((m) => ({
        month: new Date(m + "-01").toLocaleString("en-US", { month: "short" }),
        Income: monthly[m].income,
        Expenses: monthly[m].expense,
        Net: monthly[m].income - monthly[m].expense,
      }));
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
      transition={{ delay: 0.5 }}
      className="glass-card card-hover rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Legend wrapperStyle={{ color: "hsl(var(--foreground))", fontSize: 12 }} />
            <Bar dataKey="Income" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="hsl(var(--expense))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
