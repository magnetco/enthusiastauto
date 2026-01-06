import { Router, Request, Response } from 'express'
import { createClient } from '@sanity/client'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '..', '..', '.env') })
dotenv.config({ path: resolve(__dirname, '..', '..', '..', 'website', '.env.local') })

const router = Router()

// Initialize Sanity client (lazy, on first use)
function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-21'
  const token = process.env.SANITY_API_TOKEN

  if (!projectId || !dataset || !token) {
    throw new Error('Missing Sanity configuration. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN are set.')
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })
}

// Get Sanity config status
router.get('/config', async (_req: Request, res: Response) => {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
    const token = process.env.SANITY_API_TOKEN

    res.json({
      configured: !!(projectId && dataset && token),
      projectId: projectId ? `${projectId.slice(0, 4)}...` : null,
      dataset: dataset || null,
      hasToken: !!token,
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to check config' })
  }
})

// Get existing vehicles from Sanity
router.get('/existing', async (_req: Request, res: Response) => {
  try {
    const client = getSanityClient()
    const vehicles = await client.fetch(`
      *[_type == "vehicle"] {
        _id,
        "slug": slug.current,
        listingTitle,
        stockNumber
      } | order(listingTitle asc)
    `)
    res.json(vehicles)
  } catch (error) {
    console.error('Error fetching existing vehicles:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to fetch vehicles' })
  }
})

// Parse CSV and return preview
router.post('/preview', async (req: Request, res: Response) => {
  try {
    const { csvData } = req.body

    if (!csvData || typeof csvData !== 'string') {
      return res.status(400).json({ error: 'Missing CSV data' })
    }

    // Parse CSV
    const lines = csvData.trim().split('\n')
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV must have a header row and at least one data row' })
    }

    const headers = parseCSVLine(lines[0])
    const vehicles = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const row: Record<string, string> = {}
      
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || ''
      })

      // Only include rows with required fields
      if (row['Listing Title'] && row['Slug'] && row['VIN']) {
        vehicles.push({
          listingTitle: row['Listing Title'],
          slug: row['Slug'],
          stockNumber: row['Stock Number'] || '',
          vin: row['VIN'],
          chassis: row['Chassis'] || '',
          mileage: parseInt(row['Mileage']) || 0,
          listingPrice: parseFloat(row['Listing Price']) || 0,
          inventoryStatus: row['Current or Sold Inventory?'] || 'Current Inventory',
          hasSignatureShot: !!row['Signature Shot'],
          hasGallery: !!(row['Gallery Exterior 1'] || row['Gallery Interior 1']),
        })
      }
    }

    // Get existing vehicles to mark duplicates
    try {
      const client = getSanityClient()
      const existing = await client.fetch(`*[_type == "vehicle"]{ "slug": slug.current }`)
      const existingSlugs = new Set(existing.map((v: { slug: string }) => v.slug))

      vehicles.forEach((v: { slug: string; exists?: boolean }) => {
        v.exists = existingSlugs.has(v.slug)
      })
    } catch {
      // If we can't check existing, just continue
    }

    res.json({
      total: vehicles.length,
      vehicles,
    })
  } catch (error) {
    console.error('Error parsing CSV:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to parse CSV' })
  }
})

// Import a single vehicle
router.post('/import-one', async (req: Request, res: Response) => {
  try {
    const { vehicle } = req.body

    if (!vehicle || !vehicle.slug || !vehicle.listingTitle) {
      return res.status(400).json({ error: 'Invalid vehicle data' })
    }

    const client = getSanityClient()

    // Build minimal vehicle document (without images for now)
    const vehicleDoc = {
      _type: 'vehicle',
      _id: `vehicle-${vehicle.slug}`,
      listingTitle: vehicle.listingTitle,
      slug: {
        _type: 'slug',
        current: vehicle.slug,
      },
      stockNumber: vehicle.stockNumber || '',
      vin: vehicle.vin || '',
      chassis: vehicle.chassis || '',
      mileage: parseInt(vehicle.mileage) || 0,
      listingPrice: parseFloat(vehicle.listingPrice) || 0,
      inventoryStatus: vehicle.inventoryStatus || 'Current Inventory',
      isLive: vehicle.isLive !== false,
    }

    await client.createOrReplace(vehicleDoc)

    res.json({ success: true, id: vehicleDoc._id })
  } catch (error) {
    console.error('Error importing vehicle:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to import vehicle' })
  }
})

// Simple CSV line parser (handles quoted fields)
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

export default router

