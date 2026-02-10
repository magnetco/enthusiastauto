import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export function RootLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className="flex flex-col min-h-screen ml-72"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <Outlet />

        {/* Footer */}
        <footer className="border-t mt-auto" style={{ borderColor: 'var(--border-color)' }}>
          <div className="px-6 py-4">
            <p className="text-sm text-center" style={{ color: 'var(--text-tertiary)' }}>
              Enthusiast Auto Data Manager • Connected to Neon Postgres
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
