# Vehicle Export Feature

A new vehicle export feature has been added to the Data Manager application, allowing you to export all vehicles from Sanity CMS.

## Features

### Export Options

1. **Data Only (CSV)**
   - Fast export with all vehicle data and image URLs
   - Perfect for backups, data analysis, or importing to other systems
   - Includes: listing title, slug, VIN, stock number, chassis, year, make, model, mileage, listing price, status, and image URLs

2. **With Images (ZIP)**
   - Complete export including all vehicle images
   - Takes longer but provides a full backup
   - Images are organized by vehicle slug in an `images/` folder
   - Each vehicle gets: signature shot + gallery images
   - Includes a CSV file with all data

### CSV Columns

- Listing Title
- Slug
- Stock Number
- VIN
- Chassis
- Year
- Make
- Model
- Mileage
- Listing Price
- Status (current/sold)
- Is Live (Yes/No)
- Signature Shot URL (or path in ZIP)
- Gallery Image URLs (or paths in ZIP)

### Statistics Dashboard

The export page displays:
- Total Vehicles
- Current Inventory count
- Sold vehicles count
- Vehicles with images count

## Files Created

### Frontend
- `data/src/routes/VehicleExportRoute.tsx` - Main export UI component
- Updated `data/src/router.tsx` - Added vehicle-export route
- Updated `data/src/components/Sidebar.tsx` - Added "Vehicle Export" menu item
- Updated `data/src/components/Icons.tsx` - Added Download icon

### Backend
- `data/server/routes/vehicle-export.ts` - Export API endpoints
- Updated `data/server/index.ts` - Registered vehicle-export routes

### Dependencies
- Added `archiver` (^7.0.1) - For creating ZIP archives
- Added `@types/archiver` (^6.0.4) - TypeScript types

## API Endpoints

### GET `/api/vehicle-export/config`
Returns Sanity configuration status

**Response:**
```json
{
  "configured": true,
  "projectId": "abcd...",
  "dataset": "production",
  "hasToken": true
}
```

### GET `/api/vehicle-export/stats`
Returns vehicle statistics

**Response:**
```json
{
  "total": 150,
  "current": 45,
  "sold": 105,
  "withImages": 140
}
```

### GET `/api/vehicle-export/export?includeImages=false`
Exports vehicles as CSV or ZIP

**Query Parameters:**
- `includeImages` (boolean) - If true, exports as ZIP with images; if false, exports as CSV only

**Response:**
- Content-Type: `text/csv` or `application/zip`
- Content-Disposition: `attachment; filename="vehicles-export-YYYY-MM-DD.csv"` or `.zip`

## Usage

1. Navigate to **Inventory → Vehicle Export** in the sidebar
2. View vehicle statistics
3. Toggle "Include Images" if you want a complete backup with images
4. Click "Export X Vehicles" button
5. The file will download automatically

## ZIP Archive Structure

When exporting with images, the ZIP contains:

```
vehicles-export-2026-02-11.zip
├── vehicles.csv                    # All vehicle data
└── images/
    ├── 1998-e36-m3-sedan/
    │   ├── signature.jpg
    │   ├── gallery-1.jpg
    │   ├── gallery-2.jpg
    │   └── ...
    ├── 2006-e46-m3-coupe/
    │   ├── signature.jpg
    │   └── ...
    └── ...
```

## Technical Details

### Image Download
- Images are fetched from Sanity CDN URLs
- Downloaded as buffers and added to the ZIP archive
- Organized by vehicle slug for easy identification
- Failed image downloads are logged but don't stop the export

### CSV Escaping
- Values containing commas, quotes, or newlines are properly escaped
- Follows RFC 4180 CSV standard
- Compatible with Excel, Google Sheets, and other CSV tools

### Performance
- CSV exports are fast (< 1 second for 100+ vehicles)
- ZIP exports with images take longer depending on:
  - Number of vehicles
  - Number of images per vehicle
  - Image sizes
  - Network speed to Sanity CDN

## Future Enhancements

Potential improvements:
- Filter by status (current/sold) before export
- Filter by chassis type
- Date range filtering
- Progress indicator for ZIP exports
- Scheduled automatic backups
- Export to other formats (JSON, Excel)
