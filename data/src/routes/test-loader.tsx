import { AnimatedLoader, InlineLoader, FullPageLoader } from "../components/AnimatedLoader";

export default function TestLoaderPage() {
  return (
    <div className="min-h-screen py-16 px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Animated Loader Showcase
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Beautiful rotating gradient loader matching the hero button animation
          </p>
        </div>

        {/* Base Loader */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Base Loader
          </h2>
          <div 
            className="rounded-lg p-12 flex items-center justify-center"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <AnimatedLoader size={48} thickness={3} message="Loading..." />
          </div>
        </section>

        {/* Size Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Size Variants
          </h2>
          <div 
            className="rounded-lg p-12 flex items-center justify-around"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <div className="text-center space-y-4">
              <AnimatedLoader size={32} thickness={2} />
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Small (32px)
              </p>
            </div>
            <div className="text-center space-y-4">
              <AnimatedLoader size={48} thickness={3} />
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Medium (48px)
              </p>
            </div>
            <div className="text-center space-y-4">
              <AnimatedLoader size={64} thickness={4} />
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Large (64px)
              </p>
            </div>
          </div>
        </section>

        {/* Inline Loader */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Inline Loader
          </h2>
          <div 
            className="rounded-lg p-12 flex items-center justify-around"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <InlineLoader size="sm" message="Small" />
            <InlineLoader size="md" message="Medium" />
            <InlineLoader size="lg" message="Large" />
          </div>
        </section>

        {/* With Messages */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            With Messages
          </h2>
          <div 
            className="rounded-lg p-12 space-y-8"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <AnimatedLoader size={48} thickness={3} message="Loading data..." />
            <AnimatedLoader size={48} thickness={3} message="Processing request..." />
            <AnimatedLoader size={48} thickness={3} message="Syncing records..." />
          </div>
        </section>

        {/* In Button */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            In Buttons
          </h2>
          <div 
            className="rounded-lg p-12 flex gap-4 items-center justify-center"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <button 
              className="px-6 py-3 rounded-lg font-medium flex items-center gap-2"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              <AnimatedLoader size={20} thickness={2} />
              <span>Submitting...</span>
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium flex items-center gap-2"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            >
              <AnimatedLoader size={20} thickness={2} />
              <span>Processing...</span>
            </button>
          </div>
        </section>

        {/* Color Comparison */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Gradient Colors
          </h2>
          <div 
            className="rounded-lg p-12"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <div className="flex items-center justify-center gap-8 mb-8">
              <AnimatedLoader size={64} thickness={4} />
            </div>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded" 
                  style={{ backgroundColor: '#026AA2' }} 
                />
                <span style={{ color: 'var(--text-tertiary)' }}>#026AA2</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded" 
                  style={{ backgroundColor: '#529BCA' }} 
                />
                <span style={{ color: 'var(--text-tertiary)' }}>#529BCA</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded" 
                  style={{ backgroundColor: '#F90020' }} 
                />
                <span style={{ color: 'var(--text-tertiary)' }}>#F90020</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
