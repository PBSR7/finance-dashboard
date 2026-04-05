import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Transaction, Role, generateTransactions } from "@/data/mockData";

interface Filters {
  search: string;
  type: "all" | "income" | "expense";
  category: string;
  sortBy: "date" | "amount";
  sortDir: "asc" | "desc";
}

interface FinanceContextType {
  transactions: Transaction[];
  role: Role;
  setRole: (role: Role) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filteredTransactions: Transaction[];
  addTransaction: (txn: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

const STORAGE_KEY = "finance-dashboard-data";
const ROLE_KEY = "finance-dashboard-role";

function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return generateTransactions();
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);
  const [role, setRole] = useState<Role>(() => (localStorage.getItem(ROLE_KEY) as Role) || "admin");
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "all",
    category: "all",
    sortBy: "date",
    sortDir: "desc",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  const filteredTransactions = React.useMemo(() => {
    let result = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (filters.type !== "all") result = result.filter((t) => t.type === filters.type);
    if (filters.category !== "all") result = result.filter((t) => t.category === filters.category);
    result.sort((a, b) => {
      const mul = filters.sortDir === "asc" ? 1 : -1;
      if (filters.sortBy === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mul * (a.amount - b.amount);
    });
    return result;
  }, [transactions, filters]);

  const addTransaction = useCallback((txn: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...txn, id: `txn-${Date.now()}` }, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <FinanceContext.Provider
      value={{
        transactions, role, setRole, filters, setFilters,
        filteredTransactions, addTransaction, deleteTransaction,
        totalIncome, totalExpenses, balance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
