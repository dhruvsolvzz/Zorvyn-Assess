import { TransactionPageSwitcher } from '../components/TransactionPageSwitcher';
import { PageTransition } from '../components/PageTransition';

export function TransactionsPage() {
  return (
    <PageTransition>
      <PageTransition.Item>
        <header className="mb-6 mt-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">
            Recent Transactions
          </h2>
        </header>
      </PageTransition.Item>

      <PageTransition.Item>
        <TransactionPageSwitcher />
      </PageTransition.Item>
    </PageTransition>
  );
}
