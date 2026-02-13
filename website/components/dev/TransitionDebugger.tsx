'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * TransitionDebugger Component
 * 
 * Development-only component that shows visual feedback during page transitions.
 * Displays a small indicator in the bottom-right corner when transitions are active.
 * 
 * Usage: Add to layout.tsx in development mode only
 * 
 * @example
 * ```tsx
 * {isDev && <TransitionDebugger />}
 * ```
 */
export function TransitionDebugger() {
	const pathname = usePathname();
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [transitionCount, setTransitionCount] = useState(0);
	const previousPathname = useState(pathname)[0];

	useEffect(() => {
		if (previousPathname !== pathname) {
			setIsTransitioning(true);
			setTransitionCount((count) => count + 1);

			// Match the actual transition duration
			const timer = setTimeout(() => {
				setIsTransitioning(false);
			}, 1400);

			return () => clearTimeout(timer);
		}
	}, [pathname, previousPathname]);

	// Don't render in production
	if (process.env.NODE_ENV === 'production') {
		return null;
	}

	return (
		<div className="fixed bottom-4 right-4 z-50 pointer-events-none">
			<div
				className={`
					rounded-lg border-2 px-3 py-2 text-xs font-mono shadow-lg transition-all duration-300
					${
						isTransitioning
							? 'border-green-500 bg-green-50 text-green-900 scale-110'
							: 'border-gray-300 bg-white text-gray-600 scale-100 opacity-50'
					}
				`}
			>
				<div className="flex items-center gap-2">
					<div
						className={`
							h-2 w-2 rounded-full transition-all duration-300
							${isTransitioning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}
						`}
					/>
					<span className="font-semibold">
						{isTransitioning ? 'Transitioning' : 'Ready'}
					</span>
				</div>
				<div className="mt-1 text-[10px] opacity-60">
					Count: {transitionCount}
				</div>
			</div>
		</div>
	);
}
