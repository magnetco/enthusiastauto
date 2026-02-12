import { useState, useEffect } from 'react'
import { Download, Check, AlertCircle, Car, Image as ImageIcon } from '../components/Icons'
import { fetchData } from '../lib/api'

interface ExportConfig {
  configured: boolean
  projectId: string | null
  dataset: string | null
  hasToken: boolean
}

interface VehicleStats {
  total: number
  current: number
  sold: number
  withImages: number
}

export function VehicleExportRoute() {
  const [config, setConfig] = useState<ExportConfig | null>(null)
  const [stats, setStats] = useState<VehicleStats | null>(null)
  const [exporting, setExporting] = useState(false)
  const [includeImages, setIncludeImages] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchData<ExportConfig>('/vehicle-export/config')
      .then(setConfig)
      .catch((err) => setError(err.message))

    fetchData<VehicleStats>('/vehicle-export/stats')
      .then(setStats)
      .catch((err) => setError(err.message))
  }, [])

  const handleExport = async () => {
    setExporting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`http://localhost:4041/api/vehicle-export/export?includeImages=${includeImages}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/)
      const filename = filenameMatch ? filenameMatch[1] : `vehicles-export-${Date.now()}.${includeImages ? 'zip' : 'csv'}`

      // Create a blob from the response
      const blob = await response.blob()

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setSuccess(`Successfully exported ${stats?.total || 0} vehicles${includeImages ? ' with images' : ''}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export vehicles')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Vehicle Export</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Export vehicles from Sanity CMS to CSV or ZIP
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

          {/* Vehicle Statistics */}
          {stats && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Vehicle Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                    <Car />
                    <span>Total Vehicles</span>
                  </div>
                  <div className="text-2xl font-semibold text-white">{stats.total}</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="text-zinc-400 text-sm mb-1">Current Inventory</div>
                  <div className="text-2xl font-semibold text-green-400">{stats.current}</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="text-zinc-400 text-sm mb-1">Sold</div>
                  <div className="text-2xl font-semibold text-zinc-400">{stats.sold}</div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-zinc-400 text-sm mb-1">
                    <ImageIcon />
                    <span>With Images</span>
                  </div>
                  <div className="text-2xl font-semibold text-blue-400">{stats.withImages}</div>
                </div>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Export Options</h3>
            
            <div className="space-y-4">
              {/* Include Images Toggle */}
              <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 text-white font-medium mb-1">
                    <ImageIcon />
                    <span>Include Images</span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Export as ZIP with CSV data and all vehicle images
                  </p>
                </div>
                <button
                  onClick={() => setIncludeImages(!includeImages)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    includeImages ? 'bg-green-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      includeImages ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Export Format Info */}
              <div className="bg-zinc-800/20 border border-zinc-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">Export Format</h4>
                <div className="text-sm text-zinc-400 space-y-1">
                  {includeImages ? (
                    <>
                      <p>• ZIP archive containing:</p>
                      <p className="ml-4">- vehicles.csv (all vehicle data)</p>
                      <p className="ml-4">- images/ folder (organized by vehicle slug)</p>
                      <p className="ml-4">- Each vehicle gets: signature shot + gallery images</p>
                    </>
                  ) : (
                    <>
                      <p>• CSV file with columns:</p>
                      <p className="ml-4">- Listing Title, Slug, VIN, Stock Number</p>
                      <p className="ml-4">- Chassis, Year, Make, Model</p>
                      <p className="ml-4">- Mileage, Listing Price, Status</p>
                      <p className="ml-4">- Image URLs (signature shot, gallery)</p>
                    </>
                  )}
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={!config?.configured || exporting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg text-base font-medium transition-colors text-white"
              >
                <Download />
                {exporting ? (
                  <span>Exporting...</span>
                ) : (
                  <span>
                    Export {stats?.total || 0} Vehicles
                    {includeImages ? ' with Images (ZIP)' : ' (CSV)'}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400">
                <Check />
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Instructions */}
          {config?.configured && (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-3">Export Information</h3>
              <div className="text-sm text-zinc-400 space-y-2">
                <p>
                  <strong className="text-white">Data Only (CSV):</strong> Fast export with all vehicle data and image URLs. 
                  Perfect for backups, data analysis, or importing to other systems.
                </p>
                <p>
                  <strong className="text-white">With Images (ZIP):</strong> Complete export including all vehicle images. 
                  Takes longer but provides a full backup with images organized by vehicle slug.
                </p>
                <p className="text-zinc-500 text-xs mt-4">
                  💡 Tip: Use data-only exports for regular backups. Use image exports for complete archival or migration.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
