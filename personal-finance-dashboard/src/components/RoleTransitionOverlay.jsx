import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';

/**
 * Full-screen cinematic overlay that plays a ripple + icon morph 
 * animation when the user switches between Admin and Viewer roles.
 */
export function RoleTransitionOverlay() {
  const role = useStore((s) => s.role);
  const overlayRef = useRef(null);
  const iconRef = useRef(null);
  const labelRef = useRef(null);
  const rippleRef = useRef(null);
  const prevRole = useRef(null);

  useEffect(() => {
    if (prevRole.current === null) {
      prevRole.current = role;
      return;
    }
    if (prevRole.current === role) return;
    prevRole.current = role;

    const overlay = overlayRef.current;
    const icon = iconRef.current;
    const label = labelRef.current;
    const ripple = rippleRef.current;
    if (!overlay || !icon || !label || !ripple) return;

    const isAdmin = role === 'admin';

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    // Phase 1: Reveal overlay
    tl.set(overlay, {
      display: 'flex',
      pointerEvents: 'all',
    })
      .fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.in' }
      )

      // Phase 2: Ripple burst
      .fromTo(
        ripple,
        { scale: 0, opacity: 0.8 },
        {
          scale: 3,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.1'
      )

      // Phase 3: Icon entrance
      .fromTo(
        icon,
        { scale: 0, rotation: -180, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(2)',
        },
        '-=0.6'
      )

      // Phase 4: Label entrance
      .fromTo(
        label,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35 },
        '-=0.2'
      )

      // Phase 5: Hold
      .to({}, { duration: 0.3 })

      // Phase 6: Dismiss everything
      .to(icon, {
        scale: 1.3,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      })
      .to(label, { y: -10, opacity: 0, duration: 0.2 }, '-=0.2')
      .to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none', pointerEvents: 'none' });
        },
      });
  }, [role]);

  const isAdmin = role === 'admin';

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'none',
        pointerEvents: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Ripple circle */}
      <div
        ref={rippleRef}
        style={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: isAdmin
            ? 'radial-gradient(circle, rgba(129,140,248,0.4), transparent 70%)'
            : 'radial-gradient(circle, rgba(52,211,153,0.4), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <div
        ref={iconRef}
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          background: isAdmin
            ? 'linear-gradient(135deg, #6366F1, #818CF8)'
            : 'linear-gradient(135deg, #10B981, #34D399)',
          boxShadow: isAdmin
            ? '0 8px 32px rgba(99,102,241,0.4)'
            : '0 8px 32px rgba(16,185,129,0.4)',
          color: '#fff',
          opacity: 0,
        }}
      >
        {isAdmin ? '🔑' : '👁️'}
      </div>

      {/* Label */}
      <div
        ref={labelRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          opacity: 0,
        }}
      >
        <span
          style={{
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
          }}
        >
          {isAdmin ? 'Admin Mode' : 'Viewer Mode'}
        </span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {isAdmin ? 'Full access enabled' : 'Read-only view'}
        </span>
      </div>
    </div>
  );
}
