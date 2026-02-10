export function SettingsPage() {
  return (
    <div className="space-y-6">
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
        <div className="space-y-2 text-sm" style={{ color: 'var(--text-primary)' }}>
          <div className="flex items-center justify-between">
            <span>Application</span>
            <span>Enthusiast Auto Data Manager</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Version</span>
            <span>1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Database</span>
            <span>Neon Postgres</span>
          </div>
        </div>
      </div>
    </div>
  )
}
