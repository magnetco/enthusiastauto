'use client';

import { useEffect, useState } from 'react';

/**
 * Development grid overlay component
 * - 12 column grid with 82px columns
 * - Diagonal hash pattern for section padding visualization
 * - Toggle with Ctrl/Cmd + G
 */
export function GridOverlay() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Toggle with Ctrl+G or Cmd+G
			if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
				e.preventDefault();
				setIsVisible((prev) => !prev);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	if (!isVisible) return null;

	return (
		<>
			{/* 12-column grid overlay */}
			<div className="pointer-events-none fixed inset-0 z-[9999]">
				<div className="mx-auto h-full max-w-[1440px] px-4 md:px-8">
					<div className="grid h-full grid-cols-12 gap-4">
						{Array.from({ length: 12 }).map((_, i) => (
							<div
								key={i}
								className="bg-pink-500/20"
								style={{
									minWidth: '82px',
								}}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Diagonal hash pattern for padding visualization */}
			<div
				className="pointer-events-none fixed inset-0 z-[9998]"
				style={{
					backgroundImage: `repeating-linear-gradient(
						45deg,
						transparent,
						transparent 10px,
						rgba(236, 72, 153, 0.15) 10px,
						rgba(236, 72, 153, 0.15) 11px
					)`,
				}}
			/>

			{/* Indicator badge */}
			<div className="pointer-events-none fixed bottom-4 right-4 z-[10000] rounded-md bg-pink-600 px-3 py-2 text-xs font-medium text-white shadow-lg">
				Grid Overlay Active (⌘G to toggle)
			</div>
		</>
	);
}
