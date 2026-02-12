import { SettingsPage } from '../components/SettingsPage'

export function SettingsRoute() {
  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Settings</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Manage application preferences
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <SettingsPage />
      </main>
    </>
  )
}
