import React from 'react';
import { FiCreditCard, FiDownload } from 'react-icons/fi';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { MenuToggle } from '@/components/ui/menu-toggle';
import { ToggleTheme } from '@/components/ui/toggle-theme';
import { useStore } from '@/store/useStore';
import { getLenis } from '@/hooks/useLenis';

export function SimpleHeader() {
  const [open, setOpen] = React.useState(false);
  const { role, setRole, transactions } = useStore();

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'transactions.json');
    linkElement.click();
  };

  const links = [
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Insights', href: '#insights' },
    { label: 'Transactions', href: '#transactions' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(href, {
        offset: -80,
        duration: 1.5,
      });
    }
  };

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-lg">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
            <FiCreditCard className="size-4 text-white" />
          </div>
          <p className="font-mono text-lg font-bold">FinDash</p>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({ variant: 'ghost' })}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="flex items-center gap-1 bg-muted/80 border rounded-md p-1">
            <button
              onClick={() => setRole('viewer')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                role === 'viewer'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Viewer
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                role === 'admin'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Admin
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <FiDownload className="size-3.5" />
            Export
          </Button>
          <ToggleTheme />
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <Button size="icon" variant="outline" className="lg:hidden">
            <MenuToggle
              strokeWidth={2.5}
              open={open}
              onOpenChange={setOpen}
              className="size-6"
            />
          </Button>
          <SheetContent
            className="bg-background/95 supports-backdrop-filter:bg-background/80 gap-0 backdrop-blur-lg"
            showClose={false}
            side="left"
          >
            <div className="grid gap-y-1 overflow-y-auto px-4 pt-12 pb-5">
              {links.map((link) => (
                <a
                  key={link.label}
                  className={buttonVariants({ variant: 'ghost', className: 'justify-start' })}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
              <div className="my-3 border-t" />
              <div className="flex items-center gap-1 bg-muted/80 border rounded-md p-1 w-fit">
                <button
                  onClick={() => setRole('viewer')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    role === 'viewer'
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Viewer
                </button>
                <button
                  onClick={() => setRole('admin')}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    role === 'admin'
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Admin
                </button>
              </div>
              <div className="mt-2">
                <ToggleTheme />
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={handleExport} className="gap-2 w-full">
                <FiDownload className="size-4" />
                Export JSON
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

