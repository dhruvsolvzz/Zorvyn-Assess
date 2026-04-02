import { useRef, useEffect, useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { UserTransactions } from './UserTransactions';
import { AdminTransactions } from './AdminTransactions';
import { getLenis } from '@/hooks/useLenis';
import gsap from 'gsap';

/**
 * Orchestrates a cinematic GSAP page transition when switching
 * between the User and Admin transaction views.
 */
export function TransactionPageSwitcher() {
  const role = useStore((s) => s.role);
  const [displayedRole, setDisplayedRole] = useState(role);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const wipeRef = useRef(null);
  const prevRoleRef = useRef(role);

  const runTransition = useCallback(
    (newRole) => {
      if (!containerRef.current || !contentRef.current || !wipeRef.current) {
        setDisplayedRole(newRole);
        return;
      }

      const content = contentRef.current;
      const wipe = wipeRef.current;
      const isAdmin = newRole === 'admin';
      setIsTransitioning(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false);
        },
      });

      // Phase 1: Slide current content out
      tl.to(content, {
        opacity: 0,
        y: -30,
        scale: 0.98,
        duration: 0.35,
        ease: 'power2.in',
      });

      // Phase 2: Wipe overlay in
      tl.set(wipe, { display: 'block' });
      tl.fromTo(
        wipe,
        { scaleX: 0, transformOrigin: isAdmin ? 'left center' : 'right center' },
        {
          scaleX: 1,
          duration: 0.35,
          ease: 'power3.inOut',
        },
        '-=0.1'
      );

      // Phase 3: Swap content while wipe covers
      tl.call(() => {
        setDisplayedRole(newRole);
      });

      // Phase 4: Wipe overlay out (opposite direction)
      tl.to(wipe, {
        scaleX: 0,
        transformOrigin: isAdmin ? 'right center' : 'left center',
        duration: 0.35,
        ease: 'power3.inOut',
        delay: 0.05,
      });
      tl.set(wipe, { display: 'none' });

      // Phase 5: New content entrance
      tl.fromTo(
        content,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.2'
      );

      // Phase 6: Lenis scroll to top of section
      tl.call(() => {
        const lenis = getLenis();
        if (lenis && containerRef.current) {
          lenis.scrollTo(containerRef.current, {
            offset: -100,
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }, null, '-=0.3');
    },
    []
  );

  useEffect(() => {
    if (prevRoleRef.current === role) return;
    prevRoleRef.current = role;
    runTransition(role);
  }, [role, runTransition]);

  const isAdmin = displayedRole === 'admin';

  return (
    <div ref={containerRef} className="relative">
      {/* Wipe overlay */}
      <div
        ref={wipeRef}
        className="absolute inset-0 z-20 rounded-2xl"
        style={{
          display: 'none',
          background: isAdmin
            ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))'
            : 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
          backdropFilter: 'blur(4px)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div ref={contentRef}>
        {isAdmin ? <AdminTransactions /> : <UserTransactions />}
      </div>
    </div>
  );
}
