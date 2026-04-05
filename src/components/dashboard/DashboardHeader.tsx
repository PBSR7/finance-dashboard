import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { RoleToggle } from "@/components/dashboard/RoleToggle";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

export function DashboardHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary glow-primary">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your financial activity at a glance</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <RoleToggle />
      </div>
    </motion.header>
  );
}
