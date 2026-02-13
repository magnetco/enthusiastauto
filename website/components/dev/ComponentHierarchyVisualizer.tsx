'use client';

import { useEffect, useState } from 'react';

/**
 * Component Hierarchy Visualizer
 * 
 * Development tool that displays animated dashed outlines around DOM elements
 * with color-coding based on nesting depth:
 * - Level 1: Blue
 * - Level 2: Green
 * - Level 3: Yellow
 * - Level 4: Orange
 * - Level 5+: Red
 * 
 * Each element shows a label pill with its component/element name.
 * Toggle with Ctrl/Cmd + H
 */

interface ElementOutline {
  id: string;
  rect: DOMRect;
  depth: number;
  name: string;
}

const DEPTH_COLORS = [
  { border: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.9)', label: 'Level 1' }, // Blue
  { border: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.9)', label: 'Level 2' },   // Green
  { border: 'rgb(234, 179, 8)', bg: 'rgba(234, 179, 8, 0.9)', label: 'Level 3' },   // Yellow
  { border: 'rgb(249, 115, 22)', bg: 'rgba(249, 115, 22, 0.9)', label: 'Level 4' }, // Orange
  { border: 'rgb(239, 68, 68)', bg: 'rgba(239, 68, 68, 0.9)', label: 'Level 5+' },  // Red
];

export function ComponentHierarchyVisualizer() {
  const [isVisible, setIsVisible] = useState(false);
  const [outlines, setOutlines] = useState<ElementOutline[]>([]);

  // Toggle with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scan DOM and build outline data
  useEffect(() => {
    if (!isVisible) {
      setOutlines([]);
      return;
    }

    const scanElements = () => {
      const elements: ElementOutline[] = [];
      const body = document.body;

      // Get component name from element
      const getElementName = (el: Element): string => {
        // Try data attributes first
        if (el.hasAttribute('data-component')) {
          return el.getAttribute('data-component')!;
        }
        
        // Try to get React component name from displayName or constructor
        const reactKey = Object.keys(el).find(key => 
          key.startsWith('__react') || key.startsWith('_react')
        );
        
        if (reactKey) {
          const reactProps = (el as any)[reactKey];
          if (reactProps?.type?.name) {
            return reactProps.type.name;
          }
          if (reactProps?.type?.displayName) {
            return reactProps.type.displayName;
          }
        }

        // Fallback to element info
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const classes = el.className && typeof el.className === 'string' 
          ? `.${el.className.split(' ').slice(0, 2).join('.')}` 
          : '';
        
        return `${tag}${id}${classes}` || tag;
      };

      // Calculate depth from body
      const getDepth = (el: Element): number => {
        let depth = 0;
        let current: Element | null = el;
        
        while (current && current !== body) {
          depth++;
          current = current.parentElement;
        }
        
        return Math.min(depth, 5); // Cap at 5 levels
      };

      // Walk the DOM tree
      const walk = (el: Element) => {
        // Skip script, style, and dev tool elements
        if (
          el.tagName === 'SCRIPT' ||
          el.tagName === 'STYLE' ||
          el.tagName === 'NOSCRIPT' ||
          el.closest('[data-dev-tool]')
        ) {
          return;
        }

        const rect = el.getBoundingClientRect();
        
        // Only include visible elements with reasonable size
        if (
          rect.width > 20 &&
          rect.height > 20 &&
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0
        ) {
          const depth = getDepth(el);
          const name = getElementName(el);
          
          elements.push({
            id: `${name}-${elements.length}`,
            rect,
            depth,
            name,
          });
        }

        // Recurse to children
        Array.from(el.children).forEach(walk);
      };

      walk(body);
      setOutlines(elements);
    };

    scanElements();

    // Re-scan on scroll and resize
    const handleUpdate = () => {
      requestAnimationFrame(scanElements);
    };

    window.addEventListener('scroll', handleUpdate, { passive: true });
    window.addEventListener('resize', handleUpdate);

    // Periodic refresh to catch dynamic content
    const interval = setInterval(scanElements, 2000);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
      clearInterval(interval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outlines */}
      <div 
        className="pointer-events-none fixed inset-0 z-50"
        data-dev-tool="hierarchy-visualizer"
      >
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            {DEPTH_COLORS.map((color, i) => (
              <linearGradient key={i} id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color.border} stopOpacity="1" />
                <stop offset="100%" stopColor={color.border} stopOpacity="0.6" />
              </linearGradient>
            ))}
          </defs>
          
          {outlines.map((outline) => {
            const colorIndex = Math.max(0, Math.min(outline.depth - 1, DEPTH_COLORS.length - 1));
            const color = DEPTH_COLORS[colorIndex]!;
            const rx = 4; // border radius

            return (
              <rect
                key={outline.id}
                x={outline.rect.left}
                y={outline.rect.top}
                width={outline.rect.width}
                height={outline.rect.height}
                rx={rx}
                ry={rx}
                fill="none"
                stroke={color.border}
                strokeWidth="1"
                strokeDasharray="5,5"
                className="animate-dash"
                style={{
                  transition: 'all 0.2s ease-out',
                }}
              />
            );
          })}
        </svg>

        {/* Labels */}
        {outlines.map((outline) => {
          const colorIndex = Math.max(0, Math.min(outline.depth - 1, DEPTH_COLORS.length - 1));
          const color = DEPTH_COLORS[colorIndex]!;

          return (
            <div
              key={`label-${outline.id}`}
              className="absolute flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium text-white shadow-lg"
              style={{
                left: `${outline.rect.left}px`,
                top: `${outline.rect.top - 20}px`,
                backgroundColor: color.bg,
                maxWidth: `${Math.min(outline.rect.width, 200)}px`,
                transition: 'all 0.2s ease-out',
              }}
            >
              <span className="truncate">{outline.name}</span>
              <span className="opacity-60">·</span>
              <span className="opacity-60">L{outline.depth}</span>
            </div>
          );
        })}
      </div>

      {/* Indicator badge */}
      <div 
        className="pointer-events-none fixed bottom-4 left-4 z-50 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-lg"
        data-dev-tool="hierarchy-visualizer-badge"
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {DEPTH_COLORS.map((color, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color.border }}
              />
            ))}
          </div>
          <span>Hierarchy Visualizer (⌘H to toggle)</span>
        </div>
      </div>

      {/* Global styles for SVG animation */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }

        .animate-dash {
          animation: dash 1s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-dash {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
