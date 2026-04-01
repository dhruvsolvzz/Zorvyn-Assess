import { FiDownload } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { ToggleTheme } from './ui/toggle-theme';
import { SmartFinanceLogo } from './ui/SmartFinanceLogo';

export function Header() {
  const { role, setRole, transactions } = useStore();

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'transactions.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <SmartFinanceLogo className="w-10 h-10" />
          <span className="text-xl font-bold tracking-tighter text-foreground">
            Smart <span className="text-primary">Finance</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted/70 p-1 rounded-lg border">
            <button
              onClick={() => setRole('viewer')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                role === 'viewer'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Viewer
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                role === 'admin'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Admin
            </button>
          </div>

          <button
            onClick={handleExport}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </button>

          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}

