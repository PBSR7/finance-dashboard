import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Trash2, ArrowUp, ArrowDown, Download } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import { Category } from "@/data/mockData";
import { formatCurrency } from "@/lib/currency";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";

const allCategories: Category[] = [
  "Salary", "Freelance", "Investments", "Food & Dining", "Shopping",
  "Transportation", "Entertainment", "Bills & Utilities", "Healthcare",
  "Education", "Travel", "Subscriptions",
];

export function TransactionList() {
  const { filteredTransactions, filters, setFilters, role, addTransaction, deleteTransaction } = useFinance();
  const [showAdd, setShowAdd] = useState(false);
  const [newTxn, setNewTxn] = useState({
    description: "", amount: "", category: "Food & Dining" as Category,
    type: "expense" as "income" | "expense", date: new Date().toISOString().slice(0, 10),
  });

  const handleAdd = () => {
    if (!newTxn.description || !newTxn.amount) return;
    addTransaction({
      description: newTxn.description,
      amount: parseFloat(newTxn.amount),
      category: newTxn.category,
      type: newTxn.type,
      date: newTxn.date,
    });
    setNewTxn({ description: "", amount: "", category: "Food & Dining", type: "expense", date: new Date().toISOString().slice(0, 10) });
    setShowAdd(false);
  };

  const exportCSV = () => {
    const headers = "Date,Description,Category,Type,Amount (INR)\n";
    const rows = filteredTransactions.map((t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (field: "date" | "amount") => {
    setFilters((f) => ({
      ...f,
      sortBy: field,
      sortDir: f.sortBy === field && f.sortDir === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-xl p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export
          </Button>
          {role === "admin" && (
            <Dialog open={showAdd} onOpenChange={setShowAdd}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-2">
                  <div><Label>Description</Label><Input value={newTxn.description} onChange={(e) => setNewTxn((p) => ({ ...p, description: e.target.value }))} placeholder="e.g. Grocery Store" /></div>
                  <div><Label>Amount (₹)</Label><Input type="number" value={newTxn.amount} onChange={(e) => setNewTxn((p) => ({ ...p, amount: e.target.value }))} placeholder="0" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Type</Label>
                      <Select value={newTxn.type} onValueChange={(v) => setNewTxn((p) => ({ ...p, type: v as "income" | "expense" }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={newTxn.date} onChange={(e) => setNewTxn((p) => ({ ...p, date: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={newTxn.category} onValueChange={(v) => setNewTxn((p) => ({ ...p, category: v as Category }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{allCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAdd} className="w-full">Add Transaction</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-9 bg-secondary border-border"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
          </div>
          <Select value={filters.type} onValueChange={(v) => setFilters((f) => ({ ...f, type: v as "all" | "income" | "expense" }))}>
            <SelectTrigger className="w-full sm:w-[130px] bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.category} onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}>
            <SelectTrigger className="w-full sm:w-[160px] bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DateRangeFilter
            from={filters.dateFrom}
            to={filters.dateTo}
            onChange={(from, to) => setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }))}
          />
        </div>
      </div>

      {/* Sort buttons */}
      <div className="flex gap-2 mb-3">
        <Button variant="ghost" size="sm" onClick={() => toggleSort("date")} className="text-xs text-muted-foreground">
          Date {filters.sortBy === "date" && (filters.sortDir === "desc" ? <ArrowDown className="h-3 w-3 ml-1" /> : <ArrowUp className="h-3 w-3 ml-1" />)}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => toggleSort("amount")} className="text-xs text-muted-foreground">
          Amount {filters.sortBy === "amount" && (filters.sortDir === "desc" ? <ArrowDown className="h-3 w-3 ml-1" /> : <ArrowUp className="h-3 w-3 ml-1" />)}
        </Button>
      </div>

      {/* Transaction list */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg mb-1">No transactions found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredTransactions.slice(0, 50).map((txn) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${txn.type === "income" ? "bg-income" : "bg-expense"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{txn.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{new Date(txn.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border hidden sm:inline-flex">{txn.category}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold tabular-nums ${txn.type === "income" ? "text-income" : "text-expense"}`}>
                    {txn.type === "income" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
                  </span>
                  {role === "admin" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 text-muted-foreground hover:text-expense"
                      onClick={() => deleteTransaction(txn.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      {filteredTransactions.length > 50 && (
        <p className="text-xs text-muted-foreground text-center mt-3">Showing 50 of {filteredTransactions.length} transactions</p>
      )}
    </motion.div>
  );
}
