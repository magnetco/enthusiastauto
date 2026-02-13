import { PageTransition } from 'components/ui/page-transition';

/**
 * Root Template
 * 
 * Wraps all page content with PageTransition component to enable
 * smooth page-to-page transitions with staggered element animations.
 * 
 * Note: template.tsx creates a new instance on navigation, triggering
 * the transition effect in PageTransition component.
 */
export default function Template({ children }: { children: React.ReactNode }) {
	return <PageTransition>{children}</PageTransition>;
}
