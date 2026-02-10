import { AnimatedLoader, InlineLoader, FullPageLoader } from "@/components/ui/animated-loader";
import { LazyImage } from "@/components/ui/lazy-image";

export default function TestLoaderPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-dark-blue-primary)] py-16 px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-headline text-white mb-4">
            Animated Loader Showcase
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Beautiful rotating gradient loader matching the hero button animation
          </p>
        </div>

        {/* Base Loader */}
        <section className="space-y-6">
          <h2 className="text-2xl font-headline text-white">Base Loader</h2>
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-12 flex items-center justify-center">
            <AnimatedLoader size={48} thickness={3} message="Loading..." />
          </div>
        </section>

        {/* Size Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-headline text-white">Size Variants</h2>
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-12 flex items-center justify-around">
            <div className="text-center space-y-4">
              <AnimatedLoader size={32} thickness={2} />
              <p className="text-sm text-[var(--color-text-tertiary)]">Small (32px)</p>
            </div>
            <div className="text-center space-y-4">
              <AnimatedLoader size={48} thickness={3} />
              <p className="text-sm text-[var(--color-text-tertiary)]">Medium (48px)</p>
            </div>
            <div className="text-center space-y-4">
              <AnimatedLoader size={64} thickness={4} />
              <p className="text-sm text-[var(--color-text-tertiary)]">Large (64px)</p>
            </div>
          </div>
        </section>

        {/* Inline Loader */}
        <section className="space-y-6">
          <h2 className="text-2xl font-headline text-white">Inline Loader</h2>
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-12 flex items-center justify-around">
            <InlineLoader size="sm" message="Small" />
            <InlineLoader size="md" message="Medium" />
            <InlineLoader size="lg" message="Large" />
          </div>
        </section>

        {/* With Messages */}
        <section className="space-y-6">
          <h2 className="text-2xl font-headline text-white">With Messages</h2>
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-12 space-y-8">
            <AnimatedLoader size={48} thickness={3} message="Loading inventory..." />
            <AnimatedLoader size={48} thickness={3} message="Processing request..." />
            <AnimatedLoader size={48} thickness={3} message="Uploading images..." />
          </div>
        </section>

        {/* Lazy Image Example */}
        <section className="space-y-6">
          <h2 className="text-2xl font-headline text-white">Lazy Image Loading</h2>
          <p className="text-[var(--color-text-secondary)]">
            Reload the page to see the loader in action
          </p>
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-12">
            <LazyImage
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=800&fit=crop"
              alt="BMW M3"
              width={1200}
              height={800}
              showLoader
              loaderSize="lg"
              className="rounded-lg"
              containerClassName="max-w-2xl mx-auto"
            />
          </div>
        </section>

        {/* In Button */}
        <section className="space-y-6">
          <h2 className="text-2xl font-headline text-white">In Buttons</h2>
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-12 flex gap-4 items-center justify-center">
            <button className="px-6 py-3 bg-[var(--color-brand-red)] text-white rounded-lg font-medium flex items-center gap-2">
              <AnimatedLoader size={20} thickness={2} />
              <span>Submitting...</span>
            </button>
            <button className="px-6 py-3 bg-[var(--color-bg-tertiary)] text-white rounded-lg font-medium flex items-center gap-2">
              <AnimatedLoader size={20} thickness={2} />
              <span>Processing...</span>
            </button>
          </div>
        </section>

        {/* Color Comparison */}
        <section className="space-y-6">
          <h2 className="text-2xl font-headline text-white">Gradient Colors</h2>
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-12">
            <div className="flex items-center justify-center gap-8 mb-8">
              <AnimatedLoader size={64} thickness={4} />
            </div>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: '#026AA2' }} />
                <span className="text-[var(--color-text-tertiary)]">#026AA2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: '#529BCA' }} />
                <span className="text-[var(--color-text-tertiary)]">#529BCA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: '#F90020' }} />
                <span className="text-[var(--color-text-tertiary)]">#F90020</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
