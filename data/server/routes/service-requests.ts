import { Router, Request, Response } from 'express'
import { sql } from '../db.js'
import { logVersion } from './versions.js'

const router = Router()

// Get all service requests
router.get('/', async (_req: Request, res: Response) => {
  try {
    const requests = await sql`
      SELECT id, "serviceType", name, email, phone,
             "vehicleYear", "vehicleMake", "vehicleModel", vin,
             description, "existingCustomer", status,
             "createdAt", "updatedAt"
      FROM "ServiceRequest"
      ORDER BY "createdAt" DESC
    `
    res.json(requests)
  } catch (error) {
    console.error('Error fetching service requests:', error)
    res.status(500).json({ error: 'Failed to fetch service requests' })
  }
})

// Get single service request
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const requests = await sql`
      SELECT * FROM "ServiceRequest" WHERE id = ${id}
    `
    if (requests.length === 0) {
      return res.status(404).json({ error: 'Service request not found' })
    }
    res.json(requests[0])
  } catch (error) {
    console.error('Error fetching service request:', error)
    res.status(500).json({ error: 'Failed to fetch service request' })
  }
})

// Update service request field
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { field, value } = req.body

    // Get old value for version tracking
    const oldRecord = await sql`
      SELECT ${sql(field)} as old_value FROM "ServiceRequest" WHERE id = ${id}
    `
    const oldValue = oldRecord[0]?.old_value

    // Update the field based on field name
    const validFields = [
      'serviceType', 'name', 'email', 'phone',
      'vehicleYear', 'vehicleMake', 'vehicleModel', 'vin',
      'description', 'status'
    ]

    if (!validFields.includes(field)) {
      return res.status(400).json({ error: 'Invalid field' })
    }

    // Dynamic field update
    if (field === 'serviceType') {
      await sql`UPDATE "ServiceRequest" SET "serviceType" = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'name') {
      await sql`UPDATE "ServiceRequest" SET name = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'email') {
      await sql`UPDATE "ServiceRequest" SET email = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'phone') {
      await sql`UPDATE "ServiceRequest" SET phone = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'vehicleYear') {
      await sql`UPDATE "ServiceRequest" SET "vehicleYear" = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'vehicleMake') {
      await sql`UPDATE "ServiceRequest" SET "vehicleMake" = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'vehicleModel') {
      await sql`UPDATE "ServiceRequest" SET "vehicleModel" = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'vin') {
      await sql`UPDATE "ServiceRequest" SET vin = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'description') {
      await sql`UPDATE "ServiceRequest" SET description = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'status') {
      await sql`UPDATE "ServiceRequest" SET status = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    }

    // Log version change
    await logVersion('ServiceRequest', id, field, String(oldValue ?? ''), String(value ?? ''))

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating service request:', error)
    res.status(500).json({ error: 'Failed to update service request' })
  }
})

// Delete service request
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await sql`DELETE FROM "ServiceRequest" WHERE id = ${id}`
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting service request:', error)
    res.status(500).json({ error: 'Failed to delete service request' })
  }
})

export default router

