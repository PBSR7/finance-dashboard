import { FinanceProvider } from "@/contexts/FinanceContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { BalanceTrendChart } from "@/components/dashboard/BalanceTrendChart";
import { SpendingBreakdown } from "@/components/dashboard/SpendingBreakdown";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";

const Index = () => {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <DashboardHeader />
          <SummaryCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            <div className="lg:col-span-2">
              <BalanceTrendChart />
            </div>
            <div>
              <SpendingBreakdown />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            <div className="lg:col-span-2">
              <TransactionList />
            </div>
            <div>
              <InsightsPanel />
            </div>
          </div>
        </div>
      </div>
    </FinanceProvider>
  );
};

export default Index;
