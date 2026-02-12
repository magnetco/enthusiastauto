import { Router, Request, Response } from 'express'
import { createClient } from '@sanity/client'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import archiver from 'archiver'
import { Readable } from 'stream'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '..', '..', '.env') })
dotenv.config({ path: resolve(__dirname, '..', '..', '..', 'website', '.env.local') })

const router = Router()

// Initialize Sanity client
function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-21'
  const token = process.env.SANITY_API_TOKEN

  if (!projectId || !dataset || !token) {
    throw new Error('Missing Sanity configuration')
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

// Get vehicle statistics
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const client = getSanityClient()
    
    const stats = await client.fetch(`{
      "total": count(*[_type == "vehicle"]),
      "current": count(*[_type == "vehicle" && status == "current"]),
      "sold": count(*[_type == "vehicle" && status == "sold"]),
      "withImages": count(*[_type == "vehicle" && defined(signatureShot.asset)])
    }`)

    res.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to fetch stats' })
  }
})

// Export vehicles
router.get('/export', async (req: Request, res: Response) => {
  try {
    const includeImages = req.query.includeImages === 'true'
    const client = getSanityClient()

    // Fetch all vehicles with full data
    const vehicles = await client.fetch(`
      *[_type == "vehicle"] | order(listingTitle asc) {
        _id,
        listingTitle,
        "slug": slug.current,
        stockNumber,
        vin,
        chassis,
        year,
        make,
        model,
        mileage,
        listingPrice,
        status,
        isLive,
        "signatureShotUrl": signatureShot.asset->url,
        "galleryImages": gallery[].asset->url
      }
    `)

    if (includeImages) {
      // Export as ZIP with images
      await exportWithImages(res, vehicles)
    } else {
      // Export as CSV only
      await exportCSV(res, vehicles)
    }
  } catch (error) {
    console.error('Error exporting vehicles:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to export vehicles' })
  }
})

// Export as CSV
async function exportCSV(res: Response, vehicles: any[]) {
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `vehicles-export-${timestamp}.csv`

  // Build CSV content
  const headers = [
    'Listing Title',
    'Slug',
    'Stock Number',
    'VIN',
    'Chassis',
    'Year',
    'Make',
    'Model',
    'Mileage',
    'Listing Price',
    'Status',
    'Is Live',
    'Signature Shot URL',
    'Gallery Image URLs',
  ]

  const rows = vehicles.map((v) => [
    escapeCSV(v.listingTitle || ''),
    escapeCSV(v.slug || ''),
    escapeCSV(v.stockNumber || ''),
    escapeCSV(v.vin || ''),
    escapeCSV(v.chassis || ''),
    escapeCSV(v.year || ''),
    escapeCSV(v.make || ''),
    escapeCSV(v.model || ''),
    v.mileage || 0,
    v.listingPrice || 0,
    escapeCSV(v.status || 'current'),
    v.isLive ? 'Yes' : 'No',
    escapeCSV(v.signatureShotUrl || ''),
    escapeCSV((v.galleryImages || []).join(' | ')),
  ])

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(csv)
}

// Export as ZIP with images
async function exportWithImages(res: Response, vehicles: any[]) {
  const timestamp = new Date().toISOString().split('T')[0]
  const filename = `vehicles-export-${timestamp}.zip`

  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

  const archive = archiver('zip', {
    zlib: { level: 9 },
  })

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(res)

  // Add CSV file
  const headers = [
    'Listing Title',
    'Slug',
    'Stock Number',
    'VIN',
    'Chassis',
    'Year',
    'Make',
    'Model',
    'Mileage',
    'Listing Price',
    'Status',
    'Is Live',
    'Signature Shot',
    'Gallery Images',
  ]

  const rows = vehicles.map((v) => [
    escapeCSV(v.listingTitle || ''),
    escapeCSV(v.slug || ''),
    escapeCSV(v.stockNumber || ''),
    escapeCSV(v.vin || ''),
    escapeCSV(v.chassis || ''),
    escapeCSV(v.year || ''),
    escapeCSV(v.make || ''),
    escapeCSV(v.model || ''),
    v.mileage || 0,
    v.listingPrice || 0,
    escapeCSV(v.status || 'current'),
    v.isLive ? 'Yes' : 'No',
    v.signatureShotUrl ? `images/${v.slug}/signature.jpg` : '',
    (v.galleryImages || []).length > 0
      ? (v.galleryImages || []).map((_: any, i: number) => `images/${v.slug}/gallery-${i + 1}.jpg`).join(' | ')
      : '',
  ])

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
  archive.append(csv, { name: 'vehicles.csv' })

  // Download and add images
  for (const vehicle of vehicles) {
    const slug = vehicle.slug

    // Add signature shot
    if (vehicle.signatureShotUrl) {
      try {
        const imageBuffer = await downloadImage(vehicle.signatureShotUrl)
        archive.append(imageBuffer, { name: `images/${slug}/signature.jpg` })
      } catch (error) {
        console.error(`Failed to download signature shot for ${slug}:`, error)
      }
    }

    // Add gallery images
    if (vehicle.galleryImages && vehicle.galleryImages.length > 0) {
      for (let i = 0; i < vehicle.galleryImages.length; i++) {
        try {
          const imageBuffer = await downloadImage(vehicle.galleryImages[i])
          archive.append(imageBuffer, { name: `images/${slug}/gallery-${i + 1}.jpg` })
        } catch (error) {
          console.error(`Failed to download gallery image ${i + 1} for ${slug}:`, error)
        }
      }
    }
  }

  await archive.finalize()
}

// Download image from URL
async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// Escape CSV values
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export default router
