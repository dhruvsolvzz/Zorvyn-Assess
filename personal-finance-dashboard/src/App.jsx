import { SimpleHeader } from './components/ui/simple-header';
import { AnimatedRoutes } from './components/AnimatedRoutes';
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
        <AnimatedRoutes />
      </main>
    </div>
  );
}

export default App;
