import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useFinance } from "@/contexts/FinanceContext";
import { CATEGORY_CHART_COLORS } from "@/data/mockData";

export function SpendingBreakdown() {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const byCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      });
    return Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center h-[340px]">
        <p className="text-muted-foreground">No expense data</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card card-hover rounded-xl p-4 sm:p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Spending Breakdown</h3>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="h-[200px] w-[200px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart className="text-inherit">
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={CATEGORY_CHART_COLORS[index % CATEGORY_CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 w-full max-h-[200px] overflow-y-auto pr-1">
          {data.slice(0, 6).map((item, i) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_CHART_COLORS[i % CATEGORY_CHART_COLORS.length] }}
                />
                <span className="text-muted-foreground truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium tabular-nums">₹{item.value.toLocaleString("en-IN")}</span>
                <span className="text-muted-foreground text-xs w-10 text-right">
                  {((item.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
