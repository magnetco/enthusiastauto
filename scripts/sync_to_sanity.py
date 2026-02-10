#!/usr/bin/env python3
"""
Sync scraped vehicle data to Sanity CMS

This script uploads vehicle data and images from the scraper output to Sanity CMS,
creating or updating vehicle documents as needed.

Usage:
    python3 scripts/sync_to_sanity.py [--dry-run] [--chassis E92] [--slugs slug1,slug2]
"""

import os
import json
import requests
from pathlib import Path
import time
from datetime import datetime
import argparse
from typing import Optional, Dict, List, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
INPUT_JSON = Path(__file__).parent / "inventory_data.json"
SANITY_PROJECT_ID = os.getenv('SANITY_PROJECT_ID')
SANITY_DATASET = os.getenv('SANITY_DATASET', 'production')
SANITY_API_TOKEN = os.getenv('SANITY_API_TOKEN')
SANITY_API_VERSION = os.getenv('SANITY_API_VERSION', '2021-06-07')

# Sanity API endpoints
SANITY_MUTATE_URL = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/mutate/{SANITY_DATASET}"
SANITY_QUERY_URL = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/query/{SANITY_DATASET}"
SANITY_ASSETS_URL = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/assets/images/{SANITY_DATASET}"


def validate_config():
    """Validate required environment variables"""
    if not SANITY_PROJECT_ID:
        raise ValueError("SANITY_PROJECT_ID not set in environment")
    if not SANITY_API_TOKEN:
        raise ValueError("SANITY_API_TOKEN not set in environment")
    
    print(f"✓ Sanity Project: {SANITY_PROJECT_ID}")
    print(f"✓ Dataset: {SANITY_DATASET}")
    print()


def upload_image_to_sanity(image_path: str, filename: str) -> Optional[str]:
    """Upload an image to Sanity and return the asset ID"""
    if not image_path or not Path(image_path).exists():
        return None
    
    try:
        with open(image_path, 'rb') as f:
            headers = {
                'Authorization': f'Bearer {SANITY_API_TOKEN}',
                'Content-Type': 'image/jpeg'  # Adjust based on file type
            }
            
            response = requests.post(
                SANITY_ASSETS_URL,
                headers=headers,
                data=f,
                timeout=60
            )
            response.raise_for_status()
            
            result = response.json()
            asset_id = result['document']['_id']
            
            print(f"    ✓ Uploaded image: {filename} -> {asset_id}")
            return asset_id
            
    except Exception as e:
        print(f"    ✗ Failed to upload {filename}: {e}")
        return None


def text_to_portable_text(text: str) -> List[Dict[str, Any]]:
    """Convert plain text to Sanity Portable Text format"""
    if not text:
        return []
    
    # Split into paragraphs
    paragraphs = text.split('\n\n')
    
    blocks = []
    for para in paragraphs:
        if para.strip():
            blocks.append({
                '_type': 'block',
                '_key': f'block-{hash(para) & 0xffffffff:08x}',
                'style': 'normal',
                'markDefs': [],
                'children': [
                    {
                        '_type': 'span',
                        '_key': f'span-{hash(para) & 0xffffffff:08x}',
                        'text': para.strip(),
                        'marks': []
                    }
                ]
            })
    
    return blocks


def list_to_portable_text(items: List[str]) -> List[Dict[str, Any]]:
    """Convert list of strings to Portable Text with bullet points"""
    if not items:
        return []
    
    blocks = []
    for item in items:
        if item.strip():
            blocks.append({
                '_type': 'block',
                '_key': f'block-{hash(item) & 0xffffffff:08x}',
                'style': 'normal',
                'listItem': 'bullet',
                'level': 1,
                'markDefs': [],
                'children': [
                    {
                        '_type': 'span',
                        '_key': f'span-{hash(item) & 0xffffffff:08x}',
                        'text': item.strip(),
                        'marks': []
                    }
                ]
            })
    
    return blocks


def get_existing_vehicle(slug: str) -> Optional[Dict[str, Any]]:
    """Check if vehicle already exists in Sanity"""
    try:
        query = f'*[_type == "vehicle" && slug.current == "{slug}"][0]'
        
        response = requests.get(
            SANITY_QUERY_URL,
            headers={'Authorization': f'Bearer {SANITY_API_TOKEN}'},
            params={'query': query},
            timeout=30
        )
        response.raise_for_status()
        
        result = response.json()
        return result.get('result')
        
    except Exception as e:
        print(f"    ✗ Error checking existing vehicle: {e}")
        return None


def build_sanity_vehicle(vehicle: Dict[str, Any], image_refs: Dict[str, str]) -> Dict[str, Any]:
    """Build Sanity vehicle document from scraped data"""
    
    # Build base document
    doc = {
        '_type': 'vehicle',
        '_id': f'vehicle-{vehicle["slug"]}',
        'listingTitle': vehicle['listingTitle'],
        'slug': {
            '_type': 'slug',
            'current': vehicle['slug']
        },
        'status': vehicle['status'],
        'isLive': True,
    }
    
    # Add optional fields if present
    if vehicle.get('vin'):
        doc['vin'] = vehicle['vin']
    
    if vehicle.get('stockNumber'):
        doc['stockNumber'] = vehicle['stockNumber']
    
    if vehicle.get('chassis'):
        doc['chassis'] = vehicle['chassis']
    
    if vehicle.get('mileage') is not None:
        doc['mileage'] = vehicle['mileage']
    
    if vehicle.get('listingPrice') is not None:
        doc['listingPrice'] = vehicle['listingPrice']
    
    if vehicle.get('showCallForPrice') is not None:
        doc['showCallForPrice'] = vehicle['showCallForPrice']
    
    if vehicle.get('transmission'):
        doc['transmission'] = vehicle['transmission']
    
    if vehicle.get('engineCode'):
        doc['engineCodes'] = [vehicle['engineCode']]
    
    if vehicle.get('engineSize'):
        doc['engineSize'] = vehicle['engineSize']
    
    if vehicle.get('exteriorColor'):
        doc['exteriorColor'] = vehicle['exteriorColor']
    
    if vehicle.get('interiorColor'):
        doc['interiorColor'] = vehicle['interiorColor']
    
    # Add signature shot if uploaded
    if image_refs.get('signatureShot'):
        doc['signatureShot'] = {
            '_type': 'image',
            'asset': {
                '_type': 'reference',
                '_ref': image_refs['signatureShot']
            }
        }
    
    # Add gallery images if uploaded
    gallery_refs = image_refs.get('gallery', [])
    if gallery_refs:
        # Map to appropriate gallery arrays based on category
        exterior_images = []
        interior_images = []
        engine_images = []
        misc_images = []
        
        for img_ref in gallery_refs:
            image_obj = {
                '_type': 'image',
                '_key': f'img-{hash(img_ref["asset_id"]) & 0xffffffff:08x}',
                'asset': {
                    '_type': 'reference',
                    '_ref': img_ref['asset_id']
                }
            }
            
            category = img_ref.get('category', 'misc')
            if category == 'exterior':
                exterior_images.append(image_obj)
            elif category == 'interior':
                interior_images.append(image_obj)
            elif category == 'engine':
                engine_images.append(image_obj)
            else:
                misc_images.append(image_obj)
        
        if exterior_images:
            doc['galleryExterior'] = exterior_images
        if interior_images:
            doc['galleryInterior'] = interior_images
        if engine_images:
            doc['galleryEngine'] = engine_images
        if misc_images:
            doc['galleryMisc'] = misc_images
    
    # Convert content to Portable Text
    if vehicle.get('highlights'):
        doc['highlights'] = list_to_portable_text(vehicle['highlights'])
    
    if vehicle.get('overview'):
        doc['overview'] = text_to_portable_text(vehicle['overview'])
    
    if vehicle.get('history'):
        doc['history'] = text_to_portable_text(vehicle['history'])
    
    # Add status tag from badges
    if vehicle.get('badges'):
        badge_text = ' '.join(vehicle['badges']).lower()
        if 'new arrival' in badge_text:
            doc['statusTag'] = 'New Arrival'
        elif 'reduced' in badge_text:
            doc['statusTag'] = 'Reduced Price'
        elif 'sold' in badge_text:
            doc['statusTag'] = 'Sold'
    
    return doc


def sync_vehicle(vehicle: Dict[str, Any], dry_run: bool = False) -> bool:
    """Sync a single vehicle to Sanity"""
    slug = vehicle['slug']
    print(f"\n→ Syncing: {slug}")
    print(f"  Title: {vehicle['listingTitle']}")
    
    # Check if vehicle exists
    existing = get_existing_vehicle(slug)
    if existing:
        print(f"  ℹ Vehicle already exists in Sanity")
        action = 'update'
    else:
        print(f"  ℹ New vehicle (will be created)")
        action = 'create'
    
    if dry_run:
        print(f"  [DRY RUN] Would {action} vehicle")
        return True
    
    # Upload images
    print("  Uploading images...")
    image_refs = {}
    
    # Upload signature shot
    signature_shot = vehicle.get('images', {}).get('signatureShot')
    if signature_shot and signature_shot.get('local_path'):
        asset_id = upload_image_to_sanity(
            signature_shot['local_path'],
            f"{slug}-signature"
        )
        if asset_id:
            image_refs['signatureShot'] = asset_id
        time.sleep(0.2)  # Rate limiting
    
    # Upload gallery images
    gallery = vehicle.get('images', {}).get('gallery', [])
    gallery_refs = []
    
    for idx, img in enumerate(gallery[:20]):  # Limit to 20 images
        if img.get('local_path'):
            asset_id = upload_image_to_sanity(
                img['local_path'],
                f"{slug}-gallery-{idx}"
            )
            if asset_id:
                gallery_refs.append({
                    'asset_id': asset_id,
                    'category': img.get('category', 'misc')
                })
            time.sleep(0.2)  # Rate limiting
    
    if gallery_refs:
        image_refs['gallery'] = gallery_refs
    
    print(f"  ✓ Uploaded {len(image_refs)} image(s)")
    
    # Build Sanity document
    sanity_doc = build_sanity_vehicle(vehicle, image_refs)
    
    # Create or update document
    try:
        mutations = []
        
        if action == 'create':
            mutations.append({
                'create': sanity_doc
            })
        else:
            mutations.append({
                'createOrReplace': sanity_doc
            })
        
        response = requests.post(
            SANITY_MUTATE_URL,
            headers={
                'Authorization': f'Bearer {SANITY_API_TOKEN}',
                'Content-Type': 'application/json'
            },
            json={'mutations': mutations},
            timeout=30
        )
        response.raise_for_status()
        
        print(f"  ✓ Successfully {action}d vehicle in Sanity")
        return True
        
    except Exception as e:
        print(f"  ✗ Error syncing vehicle: {e}")
        return False


def load_scraped_data() -> Dict[str, Any]:
    """Load scraped vehicle data from JSON"""
    if not INPUT_JSON.exists():
        raise FileNotFoundError(f"Input file not found: {INPUT_JSON}")
    
    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    parser = argparse.ArgumentParser(
        description='Sync scraped vehicle data to Sanity CMS'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Preview changes without applying them'
    )
    parser.add_argument(
        '--chassis',
        help='Only sync vehicles with this chassis code'
    )
    parser.add_argument(
        '--slugs',
        help='Only sync specific vehicles (comma-separated slugs)'
    )
    parser.add_argument(
        '--limit',
        type=int,
        help='Limit number of vehicles to sync'
    )
    
    args = parser.parse_args()
    
    print("=" * 70)
    print("Enthusiast Auto Group - Sanity CMS Sync")
    print("=" * 70)
    print()
    
    # Validate configuration
    try:
        validate_config()
    except ValueError as e:
        print(f"✗ Configuration error: {e}")
        print("\nPlease set the following environment variables:")
        print("  - SANITY_PROJECT_ID")
        print("  - SANITY_API_TOKEN")
        print("\nYou can create a .env file in the scripts directory.")
        return
    
    if args.dry_run:
        print("🔍 DRY RUN MODE - No changes will be made\n")
    
    # Load scraped data
    try:
        data = load_scraped_data()
    except FileNotFoundError as e:
        print(f"✗ {e}")
        print("\nPlease run scrape_inventory.py first to generate the data file.")
        return
    
    vehicles = data.get('vehicles', [])
    print(f"Loaded {len(vehicles)} vehicles from {INPUT_JSON}\n")
    
    # Apply filters
    if args.chassis:
        vehicles = [v for v in vehicles if v.get('chassis') == args.chassis]
        print(f"Filtered to {len(vehicles)} vehicles with chassis {args.chassis}\n")
    
    if args.slugs:
        slug_list = [s.strip() for s in args.slugs.split(',')]
        vehicles = [v for v in vehicles if v.get('slug') in slug_list]
        print(f"Filtered to {len(vehicles)} specific vehicles\n")
    
    if args.limit:
        vehicles = vehicles[:args.limit]
        print(f"Limited to first {args.limit} vehicles\n")
    
    if not vehicles:
        print("⚠ No vehicles to sync after filtering")
        return
    
    # Sync each vehicle
    success_count = 0
    fail_count = 0
    
    for idx, vehicle in enumerate(vehicles, 1):
        success = sync_vehicle(vehicle, dry_run=args.dry_run)
        
        if success:
            success_count += 1
        else:
            fail_count += 1
        
        print(f"  Progress: {idx}/{len(vehicles)}")
        
        # Rate limiting between vehicles
        if not args.dry_run:
            time.sleep(1)
    
    print(f"\n{'=' * 70}")
    print(f"Sync Complete")
    print(f"{'=' * 70}\n")
    
    print("Summary:")
    print(f"  Total vehicles: {len(vehicles)}")
    print(f"  Successful: {success_count}")
    print(f"  Failed: {fail_count}")
    
    if args.dry_run:
        print("\n💡 This was a dry run. Run without --dry-run to apply changes.")
    
    print()


if __name__ == "__main__":
    main()
