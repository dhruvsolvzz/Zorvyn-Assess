import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { Button } from './button';
import { TracingBeam } from './tracing-beam';
import gsap from 'gsap';

export const Hero195 = () => {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonsRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

      tl.fromTo(titleRef.current, 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.2 }
      )
      .fromTo(descriptionRef.current, 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1 }, 
        '-=0.9'
      )
      .fromTo(buttonsRef.current.children, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15 }, 
        '-=1.1'
      );
    });

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    gsap.to(textRef.current, {
      y: -10,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        textRef.current.innerText = 'Zorvyn Edition.';
        gsap.fromTo(textRef.current, 
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      }
    });
  };

  const handleMouseLeave = () => {
    gsap.to(textRef.current, {
      y: 10,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        textRef.current.innerText = 'Smart Finance.';
        gsap.fromTo(textRef.current, 
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      }
    });
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="w-full relative flex justify-center items-center py-10 lg:py-20">
      <TracingBeam className="px-6 w-full">
        <div className="flex gap-8 flex-col pb-10">
          <div className="flex gap-4 flex-col">
            <h1 
              ref={titleRef}
              className="text-4xl md:text-6xl tracking-tighter text-left font-bold text-foreground opacity-0"
            >
              Master Your Money with
              <br />
              <span 
                className="text-primary italic inline-block cursor-pointer select-none"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span ref={textRef} className="inline-block">Smart Finance.</span>
              </span>
            </h1>
            <p 
              ref={descriptionRef}
              className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left opacity-0"
            >
              Take complete control of your financial destiny. Track spending, set budget goals, and uncover actionable
              insights entirely in your browser with bank-level local encryption.
            </p>
          </div>
          <div 
            ref={buttonsRef}
            className="flex flex-row gap-3 items-center justify-start"
          >
            <Button 
              size="lg" 
              className="gap-2 group transition-all hover:scale-105 active:scale-95" 
              variant="default"
              onClick={handleDashboardClick}
            >
              <span>View Dashboard</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" className="gap-2 hover:scale-105 active:scale-95 transition-all" variant="outline">
              <span>Book Demo</span>
            </Button>
          </div>
        </div>
      </TracingBeam>
    </div>
  );
};
