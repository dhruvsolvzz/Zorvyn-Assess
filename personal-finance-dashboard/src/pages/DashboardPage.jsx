import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SummaryCards } from '../components/SummaryCards';
import { InsightsPanel } from '../components/InsightsPanel';
import { Charts } from '../components/Charts';
import { PageTransition } from '../components/PageTransition';

export function DashboardPage() {
  const fetchTransactions = useStore((state) => state.fetchTransactions);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <PageTransition>
      <PageTransition.Item>
        <header className="mb-8 mt-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal finances and track your spending patterns.
          </p>
        </header>
      </PageTransition.Item>

      <PageTransition.Item>
        <SummaryCards />
      </PageTransition.Item>

      <PageTransition.Item>
        <InsightsPanel />
        <Charts />
      </PageTransition.Item>
    </PageTransition>
  );
}
