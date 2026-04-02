import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';

/**
 * Custom hook for orchestrating GSAP-powered role transitions.
 * Returns refs and utilities that components can use for animated role changes.
 */
export function useRoleTransition() {
  const role = useStore((s) => s.role);
  const prevRoleRef = useRef(role);
  const isFirstRender = useRef(true);
  const overlayRef = useRef(null);
  const sectionRefs = useRef([]);
  const callbacksRef = useRef([]);

  const registerSection = useCallback((el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  }, []);

  const onRoleChange = useCallback((cb) => {
    callbacksRef.current.push(cb);
    return () => {
      callbacksRef.current = callbacksRef.current.filter((c) => c !== cb);
    };
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevRoleRef.current = role;
      return;
    }

    if (prevRoleRef.current === role) return;
    prevRoleRef.current = role;

    const isAdmin = role === 'admin';

    // Notify all registered callbacks
    callbacksRef.current.forEach((cb) => cb(role));

    // Run the cinematic overlay
    if (overlayRef.current) {
      const overlay = overlayRef.current;
      const tl = gsap.timeline();

      tl.set(overlay, {
        display: 'flex',
        opacity: 0,
        background: isAdmin
          ? 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15), rgba(99,102,241,0.05))'
          : 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
      })
        .to(overlay, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.in',
        })
        .to(overlay, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.1,
        })
        .set(overlay, { display: 'none' });
    }

    // Stagger re-entrance for all registered sections
    if (sectionRefs.current.length > 0) {
      gsap.fromTo(
        sectionRefs.current,
        { y: 20, opacity: 0.3 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.15,
        }
      );
    }
  }, [role]);

  return { overlayRef, registerSection, onRoleChange, role };
}

/**
 * Animates an element in or out based on role.
 * @param {HTMLElement} el - The element to animate
 * @param {boolean} show - Whether to show or hide
 * @param {object} options - Additional GSAP options
 */
export function animateRoleElement(el, show, options = {}) {
  if (!el) return;

  const defaults = {
    duration: 0.5,
    ease: 'power3.out',
  };

  if (show) {
    gsap.set(el, { display: options.display || 'flex' });
    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: 15,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        ...defaults,
        ...options,
      }
    );
  } else {
    gsap.to(el, {
      opacity: 0,
      y: -10,
      scale: 0.95,
      ...defaults,
      duration: 0.3,
      ...options,
      onComplete: () => {
        gsap.set(el, { display: 'none' });
        options.onComplete?.();
      },
    });
  }
}
