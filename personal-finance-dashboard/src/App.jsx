import { SimpleHeader } from './components/ui/simple-header';
import { DemoOne } from './components/ui/demo';
import { SummaryCards } from './components/SummaryCards';
import { InsightsPanel } from './components/InsightsPanel';
import { Charts } from './components/Charts';
import { TransactionManager } from './components/TransactionManager';
import { useLenis } from './hooks/useLenis';
import { ToastViewport } from './components/ui/toast-1';
import { RoleSwitchNotifier } from './components/RoleSwitchNotifier';

function App() {
  useLenis();
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ToastViewport />
      <RoleSwitchNotifier />
      <SimpleHeader />
      <main className="container mx-auto px-4 py-8 antialiased max-w-7xl">
        <section id="hero">
          <DemoOne />
        </section>

        <section id="dashboard" className="scroll-mt-20">
          <header className="mb-8 mt-12">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal finances and track your spending patterns.
            </p>
          </header>

          <SummaryCards />
        </section>

        <section id="insights" className="scroll-mt-20">
          <InsightsPanel />
          <Charts />
        </section>

        <section id="transactions" className="scroll-mt-20">
          <header className="mb-6 mt-12">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Recent Transactions</h2>
          </header>
          <TransactionManager />
        </section>
      </main>
    </div>
  );
}

export default App;

