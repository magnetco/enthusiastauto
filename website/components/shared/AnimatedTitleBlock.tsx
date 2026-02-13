'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedTitleBlockProps {
  title?: string;
  className?: string;
}

export function AnimatedTitleBlock({ 
  title = 'SERVIC',
  className = '' 
}: AnimatedTitleBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chevron1Ref = useRef<SVGSVGElement>(null);
  const chevron2Ref = useRef<SVGSVGElement>(null);
  const chevron3Ref = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%', // Start when element is 80% down the viewport
          toggleActions: 'play none none none', // Play once on enter
        },
      });

      // Animate all three chevrons simultaneously
      // Chevron 1 (red) - fades in at position 0
      tl.fromTo(
        chevron1Ref.current,
        { 
          opacity: 0,
          x: 0 
        },
        { 
          opacity: 1,
          x: 0,
          duration: 0.2,
          ease: 'power2.out'
        },
        0 // Start at time 0
      );

      // Chevron 2 (blue) - slides from 0 to 30px
      tl.fromTo(
        chevron2Ref.current,
        { 
          opacity: 0,
          x: 0 
        },
        { 
          opacity: 1,
          x: 30,
          duration: 0.2,
          ease: 'power2.out'
        },
        0 // Start at time 0 (same time as chevron 1)
      );

      // Chevron 3 (blue) - slides from 0 to 60px
      tl.fromTo(
        chevron3Ref.current,
        { 
          opacity: 0,
          x: 0 
        },
        { 
          opacity: 1,
          x: 60,
          duration: 0.2,
          ease: 'power2.out'
        },
        0 // Start at time 0 (same time as chevrons 1 & 2)
      );

      // Text fades in at 300ms (0.3s) delay
      tl.fromTo(
        textRef.current,
        { 
          opacity: 0 
        },
        { 
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out'
        },
        0.3 // Start at 300ms
      );
    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div ref={containerRef} className={`flex items-center gap-4 ${className}`}>
      {/* Chevron Container */}
      <div className="relative flex items-center" style={{ width: '120px', height: '80px' }}>
        {/* Chevron 1 - Red - Stays at position 0 */}
        <svg
          ref={chevron1Ref}
          width="30"
          height="40"
          viewBox="0 0 30 40"
          className="absolute"
          style={{
            left: '0px',
            top: '20px',
            opacity: 0,
          }}
        >
          <path d="M 0 0 L 20 20 L 0 40 Z" fill="#F90020" />
        </svg>

        {/* Chevron 2 - Blue - Slides from 0 to 30px */}
        <svg
          ref={chevron2Ref}
          width="30"
          height="40"
          viewBox="0 0 30 40"
          className="absolute"
          style={{
            left: '0px',
            top: '20px',
            opacity: 0,
          }}
        >
          <path d="M 0 0 L 20 20 L 0 40 Z" fill="#2E90FA" />
        </svg>

        {/* Chevron 3 - Blue - Slides from 0 to 60px */}
        <svg
          ref={chevron3Ref}
          width="30"
          height="40"
          viewBox="0 0 30 40"
          className="absolute"
          style={{
            left: '0px',
            top: '20px',
            opacity: 0,
          }}
        >
          <path d="M 0 0 L 20 20 L 0 40 Z" fill="#2E90FA" />
        </svg>
      </div>

      {/* Text - Fades in at 300ms */}
      <h1
        ref={textRef}
        className="text-5xl font-bold"
        style={{
          opacity: 0,
        }}
      >
        {title}
      </h1>
    </div>
  );
}
