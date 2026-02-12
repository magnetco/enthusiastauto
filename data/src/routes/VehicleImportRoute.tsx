import { useState, useEffect, useRef } from 'react'
import { Upload, Check, AlertCircle, Car } from '../components/Icons'
import { fetchData, postData } from '../lib/api'

interface VehiclePreview {
  listingTitle: string
  slug: string
  stockNumber: string
  vin: string
  chassis: string
  mileage: number
  listingPrice: number
  status: string
  hasSignatureShot: boolean
  hasGallery: boolean
  exists?: boolean
}

interface ImportConfig {
  configured: boolean
  projectId: string | null
  dataset: string | null
  hasToken: boolean
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

export function VehicleImportRoute() {
  const [config, setConfig] = useState<ImportConfig | null>(null)
  const [vehicles, setVehicles] = useState<VehiclePreview[]>([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 })
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchData<ImportConfig>('/vehicle-import/config')
      .then(setConfig)
      .catch((err) => setError(err.message))
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setVehicles([])

    try {
      const text = await file.text()
      const result = await postData<{ total: number; vehicles: VehiclePreview[] }>(
        '/vehicle-import/preview',
        { csvData: text }
      )
      setVehicles(result.vehicles)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV')
    }
  }

  const handleImport = async () => {
    const toImport = vehicles.filter((v) => !v.exists)
    if (toImport.length === 0) {
      setError('No new vehicles to import')
      return
    }

    setImporting(true)
    setImportProgress({ current: 0, total: toImport.length, success: 0, failed: 0 })

    for (let i = 0; i < toImport.length; i++) {
      try {
        await postData('/vehicle-import/import-one', { vehicle: toImport[i] })
        setImportProgress((prev) => ({
          ...prev,
          current: i + 1,
          success: prev.success + 1,
        }))
      } catch {
        setImportProgress((prev) => ({
          ...prev,
          current: i + 1,
          failed: prev.failed + 1,
        }))
      }
    }

    setImporting(false)
  }

  const newVehicles = vehicles.filter((v) => !v.exists)
  const existingVehicles = vehicles.filter((v) => v.exists)

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Vehicle Import</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Import vehicles from CSV to Sanity CMS
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="space-y-6">
          {/* Config Status */}
          {config && !config.configured && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle />
                <span className="font-medium">Sanity Not Configured</span>
              </div>
              <p className="text-sm text-yellow-500/70 mt-1">
                Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN in your environment.
              </p>
            </div>
          )}

          {config?.configured && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400">
                <Check />
                <span className="font-medium">Connected to Sanity</span>
              </div>
              <p className="text-sm text-green-500/70 mt-1">
                Project: {config.projectId} • Dataset: {config.dataset}
              </p>
            </div>
          )}

          {/* File Upload */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Upload CSV File</h3>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!config?.configured}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
              >
                <Upload />
                Choose CSV File
              </button>
              <span className="text-sm text-zinc-500">
                Upload a CSV file with vehicle inventory data
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Preview */}
          {vehicles.length > 0 && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-white">Preview</h3>
                  <p className="text-sm text-zinc-500 mt-1">
                    {vehicles.length} vehicles found • {newVehicles.length} new • {existingVehicles.length} already exist
                  </p>
                </div>
                <button
                  onClick={handleImport}
                  disabled={importing || newVehicles.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                >
                  <Car />
                  Import {newVehicles.length} Vehicles
                </button>
              </div>

              {/* Import Progress */}
              {importing && (
                <div className="mb-4 p-4 bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-zinc-400">
                      Importing {importProgress.current} of {importProgress.total}...
                    </span>
                    <span className="text-zinc-500">
                      <span className="text-green-400">{importProgress.success} success</span>
                      {importProgress.failed > 0 && (
                        <span className="text-red-400 ml-2">{importProgress.failed} failed</span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Vehicle List */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-zinc-500 border-b border-zinc-800">
                      <th className="pb-2 pr-4">Status</th>
                      <th className="pb-2 pr-4">Title</th>
                      <th className="pb-2 pr-4">Chassis</th>
                      <th className="pb-2 pr-4">Mileage</th>
                      <th className="pb-2 pr-4">Price</th>
                      <th className="pb-2 pr-4">Inventory</th>
                      <th className="pb-2">Media</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v, i) => (
                      <tr key={i} className={`border-b border-zinc-800/50 ${v.exists ? 'opacity-50' : ''}`}>
                        <td className="py-2 pr-4">
                          {v.exists ? (
                            <span className="text-yellow-400 text-xs">EXISTS</span>
                          ) : (
                            <span className="text-green-400 text-xs">NEW</span>
                          )}
                        </td>
                        <td className="py-2 pr-4 text-white">{v.listingTitle}</td>
                        <td className="py-2 pr-4 text-zinc-400">{v.chassis || '—'}</td>
                        <td className="py-2 pr-4 text-zinc-400">{v.mileage.toLocaleString()}</td>
                        <td className="py-2 pr-4 text-zinc-400">{formatPrice(v.listingPrice)}</td>
                        <td className="py-2 pr-4">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            v.status === 'current' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-zinc-500/20 text-zinc-400'
                          }`}>
                            {v.status === 'current' ? 'Current' : 'Sold'}
                          </span>
                        </td>
                        <td className="py-2">
                          <span className="text-zinc-500 text-xs">
                            {v.hasSignatureShot ? '📸' : '—'}
                            {v.hasGallery ? ' 🖼️' : ''}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Instructions */}
          {vehicles.length === 0 && config?.configured && (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-3">CSV Format</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Upload a CSV file with the following columns:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-zinc-500">Listing Title</div>
                <div className="text-zinc-400">Vehicle title (required)</div>
                <div className="text-zinc-500">Slug</div>
                <div className="text-zinc-400">URL-friendly ID (required)</div>
                <div className="text-zinc-500">VIN</div>
                <div className="text-zinc-400">Vehicle identification number (required)</div>
                <div className="text-zinc-500">Stock Number</div>
                <div className="text-zinc-400">Last 7 of VIN</div>
                <div className="text-zinc-500">Chassis</div>
                <div className="text-zinc-400">E30, E46, F87, etc.</div>
                <div className="text-zinc-500">Mileage</div>
                <div className="text-zinc-400">Current odometer</div>
                <div className="text-zinc-500">Listing Price</div>
                <div className="text-zinc-400">Sale price</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
