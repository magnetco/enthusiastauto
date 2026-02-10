import { ThemeToggle } from './ThemeToggle'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Appearance Section */}
      <div 
        className="rounded-lg p-6"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderWidth: '1px',
          borderColor: 'var(--border-color)',
        }}
      >
        <h3 
          className="text-lg font-medium mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p 
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Theme
            </p>
            <p 
              className="text-sm mt-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              Choose between light and dark mode
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* About Section */}
      <div 
        className="rounded-lg p-6"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderWidth: '1px',
          borderColor: 'var(--border-color)',
        }}
      >
        <h3 
          className="text-lg font-medium mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          About
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Application</span>
            <span style={{ color: 'var(--text-primary)' }}>Enthusiast Auto Data Manager</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Version</span>
            <span style={{ color: 'var(--text-primary)' }}>1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Database</span>
            <span style={{ color: 'var(--text-primary)' }}>Neon Postgres</span>
          </div>
        </div>
      </div>
    </div>
  )
}
