import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCreditCard, FiDownload } from 'react-icons/fi';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { MenuToggle } from '@/components/ui/menu-toggle';
import { ToggleTheme } from '@/components/ui/toggle-theme';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';

function AnimatedRoleToggle({ role, setRole, className = '' }) {
  const containerRef = useRef(null);
  const pillRef = useRef(null);
  const viewerRef = useRef(null);
  const adminRef = useRef(null);
  const isInitialMount = useRef(true);

  const animatePill = useCallback(() => {
    if (!pillRef.current || !viewerRef.current || !adminRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const target = role === 'viewer' ? viewerRef.current : adminRef.current;
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const x = targetRect.left - containerRect.left;
    const width = targetRect.width;

    if (isInitialMount.current) {
      gsap.set(pillRef.current, { x, width });
      isInitialMount.current = false;
      return;
    }

    gsap.to(pillRef.current, {
      x,
      width,
      duration: 0.5,
      ease: 'elastic.out(1, 0.75)',
    });

    gsap.fromTo(
      target,
      { scale: 0.92 },
      { scale: 1, duration: 0.35, ease: 'back.out(3)' }
    );
  }, [role]);

  useEffect(() => {
    const id = requestAnimationFrame(animatePill);
    return () => cancelAnimationFrame(id);
  }, [animatePill]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center gap-0 bg-muted/80 border rounded-md p-1 ${className}`}
    >
      <div
        ref={pillRef}
        className="absolute top-1 bottom-1 rounded bg-background shadow-sm"
        style={{ pointerEvents: 'none', zIndex: 0 }}
      />

      <button
        ref={viewerRef}
        onClick={() => setRole('viewer')}
        className={`relative z-10 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded transition-colors duration-200 ${
          role === 'viewer'
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Viewer
      </button>
      <button
        ref={adminRef}
        onClick={() => setRole('admin')}
        className={`relative z-10 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded transition-colors duration-200 ${
          role === 'admin'
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Admin
      </button>
    </div>
  );
}

export function SimpleHeader() {
  const [open, setOpen] = useState(false);
  const { transactions, role, setRole } = useStore();
  const location = useLocation();

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'transactions.json');
    linkElement.click();
  };

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Transactions', to: '/transactions' },
  ];

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-lg">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <div className="p-1.5 rounded-lg transition-transform group-hover:scale-110" style={{ backgroundColor: 'var(--primary)' }}>
            <FiCreditCard className="size-4 text-white" />
          </div>
          <p className="font-mono text-lg font-bold tracking-tighter">Zorvyn.</p>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              className={buttonVariants({
                variant: location.pathname === link.to ? 'secondary' : 'ghost',
              })}
              to={link.to}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <AnimatedRoleToggle role={role} setRole={setRole} />
          <ToggleTheme />
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <FiDownload className="size-3.5" />
            Export
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-2 lg:hidden">
          <ToggleTheme />
          <Sheet open={open} onOpenChange={setOpen}>
            <Button size="icon" variant="outline">
              <MenuToggle strokeWidth={2.5} open={open} onOpenChange={setOpen} className="size-6" />
            </Button>
            <SheetContent 
              side="right" 
              className="bg-background/95 supports-backdrop-filter:bg-background/80 gap-0 backdrop-blur-lg pt-12"
              showClose={false}
            >
              <div className="grid gap-y-2 px-4">
                <div className="mb-4 pb-4 border-b">
                   <AnimatedRoleToggle role={role} setRole={setRole} className="w-fit" />
                </div>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    className={buttonVariants({
                      variant: location.pathname === link.to ? 'secondary' : 'ghost',
                      className: 'justify-start font-bold',
                    })}
                    to={link.to}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <div className="my-6 border-t" />
                
                <Button variant="outline" onClick={handleExport} className="gap-2 w-full">
                  <FiDownload className="size-4" />
                  Export JSON
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
