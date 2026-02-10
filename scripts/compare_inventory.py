#!/usr/bin/env python3
"""
Compare vehicle inventory between live site and Sanity CMS

This script generates a detailed diff report showing differences between
the scraped live site data and what's currently in Sanity CMS.

Usage:
    python3 scripts/compare_inventory.py [--format console|json|html]
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime
import argparse
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
INPUT_JSON = Path(__file__).parent / "inventory_data.json"
OUTPUT_JSON = Path(__file__).parent / "inventory_comparison.json"
OUTPUT_HTML = Path(__file__).parent / "inventory_comparison.html"

SANITY_PROJECT_ID = os.getenv('SANITY_PROJECT_ID')
SANITY_DATASET = os.getenv('SANITY_DATASET', 'production')
SANITY_API_TOKEN = os.getenv('SANITY_API_TOKEN')
SANITY_API_VERSION = os.getenv('SANITY_API_VERSION', '2021-06-07')

SANITY_QUERY_URL = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/query/{SANITY_DATASET}"


def fetch_sanity_vehicles() -> List[Dict[str, Any]]:
    """Fetch all vehicles from Sanity CMS"""
    try:
        query = '''
        *[_type == "vehicle"] {
            _id,
            listingTitle,
            "slug": slug.current,
            vin,
            stockNumber,
            chassis,
            mileage,
            listingPrice,
            showCallForPrice,
            transmission,
            exteriorColor,
            interiorColor,
            status,
            isLive,
            "signatureShot": signatureShot.asset->url,
            "galleryCount": count(galleryExterior) + count(galleryInterior) + count(galleryEngine) + count(galleryMisc)
        }
        '''
        
        response = requests.get(
            SANITY_QUERY_URL,
            headers={'Authorization': f'Bearer {SANITY_API_TOKEN}'},
            params={'query': query},
            timeout=30
        )
        response.raise_for_status()
        
        result = response.json()
        return result.get('result', [])
        
    except Exception as e:
        print(f"✗ Error fetching Sanity vehicles: {e}")
        return []


def load_scraped_data() -> List[Dict[str, Any]]:
    """Load scraped vehicle data from JSON"""
    if not INPUT_JSON.exists():
        raise FileNotFoundError(f"Input file not found: {INPUT_JSON}")
    
    with open(INPUT_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
        return data.get('vehicles', [])


def compare_field(live_value: Any, sanity_value: Any, field_name: str) -> Optional[Dict[str, Any]]:
    """Compare a single field and return diff if different"""
    # Normalize values for comparison
    live_norm = live_value
    sanity_norm = sanity_value
    
    # Handle None/empty comparisons
    if live_value in (None, '', []) and sanity_value in (None, '', []):
        return None
    
    # Handle numeric comparisons with tolerance
    if isinstance(live_value, (int, float)) and isinstance(sanity_value, (int, float)):
        if abs(live_value - sanity_value) < 0.01:  # Tolerance for floating point
            return None
    
    # Handle list comparisons
    if isinstance(live_value, list) and isinstance(sanity_value, list):
        if set(live_value) == set(sanity_value):
            return None
    
    # Check if different
    if live_norm != sanity_norm:
        return {
            'field': field_name,
            'live': live_value,
            'sanity': sanity_value
        }
    
    return None


def compare_vehicles(live_vehicle: Dict[str, Any], sanity_vehicle: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Compare two vehicles and return list of differences"""
    differences = []
    
    # Fields to compare
    fields_to_compare = [
        'listingTitle',
        'vin',
        'stockNumber',
        'chassis',
        'mileage',
        'listingPrice',
        'showCallForPrice',
        'transmission',
        'exteriorColor',
        'interiorColor',
        'status'
    ]
    
    for field in fields_to_compare:
        live_value = live_vehicle.get(field)
        sanity_value = sanity_vehicle.get(field)
        
        diff = compare_field(live_value, sanity_value, field)
        if diff:
            differences.append(diff)
    
    # Compare image presence
    live_has_signature = bool(live_vehicle.get('images', {}).get('signatureShot'))
    sanity_has_signature = bool(sanity_vehicle.get('signatureShot'))
    
    if live_has_signature != sanity_has_signature:
        differences.append({
            'field': 'signatureShot',
            'live': 'Present' if live_has_signature else 'Missing',
            'sanity': 'Present' if sanity_has_signature else 'Missing'
        })
    
    # Compare gallery image counts
    live_gallery_count = len(live_vehicle.get('images', {}).get('gallery', []))
    sanity_gallery_count = sanity_vehicle.get('galleryCount', 0)
    
    if abs(live_gallery_count - sanity_gallery_count) > 2:  # Allow small variance
        differences.append({
            'field': 'galleryImages',
            'live': f'{live_gallery_count} images',
            'sanity': f'{sanity_gallery_count} images'
        })
    
    return differences


def generate_comparison_report(live_vehicles: List[Dict], sanity_vehicles: List[Dict]) -> Dict[str, Any]:
    """Generate comprehensive comparison report"""
    
    # Index vehicles by slug
    live_by_slug = {v['slug']: v for v in live_vehicles}
    sanity_by_slug = {v['slug']: v for v in sanity_vehicles}
    
    # Find missing vehicles
    live_slugs = set(live_by_slug.keys())
    sanity_slugs = set(sanity_by_slug.keys())
    
    missing_in_sanity = live_slugs - sanity_slugs
    missing_on_live = sanity_slugs - live_slugs
    common_slugs = live_slugs & sanity_slugs
    
    # Compare common vehicles
    mismatched_vehicles = []
    
    for slug in common_slugs:
        live_vehicle = live_by_slug[slug]
        sanity_vehicle = sanity_by_slug[slug]
        
        differences = compare_vehicles(live_vehicle, sanity_vehicle)
        
        if differences:
            mismatched_vehicles.append({
                'slug': slug,
                'title': live_vehicle.get('listingTitle'),
                'differences': differences
            })
    
    # Build report
    report = {
        'generated_at': datetime.now().isoformat(),
        'summary': {
            'live_site_total': len(live_vehicles),
            'sanity_total': len(sanity_vehicles),
            'missing_in_sanity': len(missing_in_sanity),
            'missing_on_live': len(missing_on_live),
            'mismatched': len(mismatched_vehicles)
        },
        'missing_in_sanity': [
            {
                'slug': slug,
                'title': live_by_slug[slug].get('listingTitle'),
                'price': live_by_slug[slug].get('listingPrice'),
                'status': live_by_slug[slug].get('status'),
                'vin': live_by_slug[slug].get('vin')
            }
            for slug in sorted(missing_in_sanity)
        ],
        'missing_on_live': [
            {
                'slug': slug,
                'title': sanity_by_slug[slug].get('listingTitle'),
                'price': sanity_by_slug[slug].get('listingPrice'),
                'status': sanity_by_slug[slug].get('status')
            }
            for slug in sorted(missing_on_live)
        ],
        'mismatched': mismatched_vehicles
    }
    
    return report


def print_console_report(report: Dict[str, Any]):
    """Print report to console"""
    print("\n" + "=" * 70)
    print("INVENTORY COMPARISON REPORT")
    print("=" * 70)
    print(f"\nGenerated: {report['generated_at']}")
    
    summary = report['summary']
    print("\nSUMMARY:")
    print(f"  Live Site: {summary['live_site_total']} vehicles")
    print(f"  Sanity CMS: {summary['sanity_total']} vehicles")
    print(f"  Missing in Sanity: {summary['missing_in_sanity']} vehicles")
    print(f"  Missing on Live: {summary['missing_on_live']} vehicles (likely sold)")
    print(f"  Mismatched Data: {summary['mismatched']} vehicles")
    
    # Missing in Sanity
    if report['missing_in_sanity']:
        print("\n" + "-" * 70)
        print("MISSING IN SANITY:")
        print("-" * 70)
        
        for idx, vehicle in enumerate(report['missing_in_sanity'], 1):
            print(f"\n  {idx}. {vehicle['title']}")
            if vehicle.get('price'):
                print(f"     Price: ${vehicle['price']:,}")
            print(f"     Slug: {vehicle['slug']}")
            if vehicle.get('vin'):
                print(f"     VIN: {vehicle['vin']}")
            print(f"     Status: {vehicle['status']}")
    
    # Missing on Live
    if report['missing_on_live']:
        print("\n" + "-" * 70)
        print("MISSING ON LIVE SITE (Likely Sold):")
        print("-" * 70)
        
        for idx, vehicle in enumerate(report['missing_on_live'], 1):
            print(f"\n  {idx}. {vehicle['title']}")
            if vehicle.get('price'):
                print(f"     Price: ${vehicle['price']:,}")
            print(f"     Slug: {vehicle['slug']}")
    
    # Mismatched data
    if report['mismatched']:
        print("\n" + "-" * 70)
        print("MISMATCHED DATA:")
        print("-" * 70)
        
        for idx, vehicle in enumerate(report['mismatched'], 1):
            print(f"\n  {idx}. {vehicle['title']}")
            print(f"     Slug: {vehicle['slug']}")
            
            for diff in vehicle['differences']:
                field = diff['field']
                live_val = diff['live']
                sanity_val = diff['sanity']
                
                print(f"     • {field}:")
                print(f"       Live:   {live_val}")
                print(f"       Sanity: {sanity_val}")
    
    print("\n" + "=" * 70)


def save_json_report(report: Dict[str, Any]):
    """Save report as JSON"""
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ JSON report saved to: {OUTPUT_JSON}")


def save_html_report(report: Dict[str, Any]):
    """Save report as HTML"""
    summary = report['summary']
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Comparison Report</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }}
        .header {{
            background: #0a0c10;
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
        }}
        .header h1 {{
            margin: 0 0 10px 0;
        }}
        .summary {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }}
        .stat-card {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .stat-card h3 {{
            margin: 0 0 10px 0;
            color: #666;
            font-size: 14px;
            text-transform: uppercase;
        }}
        .stat-card .value {{
            font-size: 32px;
            font-weight: bold;
            color: #0a0c10;
        }}
        .section {{
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .section h2 {{
            margin: 0 0 20px 0;
            color: #0a0c10;
            border-bottom: 2px solid #F90020;
            padding-bottom: 10px;
        }}
        .vehicle {{
            padding: 15px;
            border-left: 3px solid #2E90FA;
            margin-bottom: 15px;
            background: #f9f9f9;
        }}
        .vehicle h3 {{
            margin: 0 0 10px 0;
            color: #0a0c10;
        }}
        .vehicle-meta {{
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
        }}
        .diff {{
            margin: 10px 0;
            padding: 10px;
            background: white;
            border-radius: 4px;
        }}
        .diff-field {{
            font-weight: bold;
            color: #F90020;
        }}
        .diff-values {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 5px;
        }}
        .diff-value {{
            padding: 5px;
            border-radius: 4px;
            font-size: 14px;
        }}
        .diff-value.live {{
            background: #e8f5e9;
            border-left: 3px solid #4caf50;
        }}
        .diff-value.sanity {{
            background: #fff3e0;
            border-left: 3px solid #ff9800;
        }}
        .label {{
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 3px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Inventory Comparison Report</h1>
        <p>Generated: {report['generated_at']}</p>
    </div>
    
    <div class="summary">
        <div class="stat-card">
            <h3>Live Site</h3>
            <div class="value">{summary['live_site_total']}</div>
        </div>
        <div class="stat-card">
            <h3>Sanity CMS</h3>
            <div class="value">{summary['sanity_total']}</div>
        </div>
        <div class="stat-card">
            <h3>Missing in Sanity</h3>
            <div class="value">{summary['missing_in_sanity']}</div>
        </div>
        <div class="stat-card">
            <h3>Mismatched</h3>
            <div class="value">{summary['mismatched']}</div>
        </div>
    </div>
"""
    
    # Missing in Sanity
    if report['missing_in_sanity']:
        html += """
    <div class="section">
        <h2>Missing in Sanity</h2>
"""
        for vehicle in report['missing_in_sanity']:
            price_str = f"${vehicle['price']:,}" if vehicle.get('price') else "Call for price"
            html += f"""
        <div class="vehicle">
            <h3>{vehicle['title']}</h3>
            <div class="vehicle-meta">Price: {price_str}</div>
            <div class="vehicle-meta">Slug: {vehicle['slug']}</div>
            <div class="vehicle-meta">Status: {vehicle['status']}</div>
        </div>
"""
        html += "    </div>\n"
    
    # Mismatched data
    if report['mismatched']:
        html += """
    <div class="section">
        <h2>Mismatched Data</h2>
"""
        for vehicle in report['mismatched']:
            html += f"""
        <div class="vehicle">
            <h3>{vehicle['title']}</h3>
            <div class="vehicle-meta">Slug: {vehicle['slug']}</div>
"""
            for diff in vehicle['differences']:
                html += f"""
            <div class="diff">
                <div class="diff-field">{diff['field']}</div>
                <div class="diff-values">
                    <div class="diff-value live">
                        <div class="label">Live Site</div>
                        {diff['live']}
                    </div>
                    <div class="diff-value sanity">
                        <div class="label">Sanity CMS</div>
                        {diff['sanity']}
                    </div>
                </div>
            </div>
"""
            html += "        </div>\n"
        html += "    </div>\n"
    
    html += """
</body>
</html>
"""
    
    with open(OUTPUT_HTML, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✓ HTML report saved to: {OUTPUT_HTML}")


def main():
    parser = argparse.ArgumentParser(
        description='Compare vehicle inventory between live site and Sanity CMS'
    )
    parser.add_argument(
        '--format',
        choices=['console', 'json', 'html', 'all'],
        default='console',
        help='Output format for the report'
    )
    
    args = parser.parse_args()
    
    print("=" * 70)
    print("Enthusiast Auto Group - Inventory Comparison")
    print("=" * 70)
    print()
    
    # Validate configuration
    if not SANITY_PROJECT_ID or not SANITY_API_TOKEN:
        print("✗ Missing Sanity configuration")
        print("\nPlease set SANITY_PROJECT_ID and SANITY_API_TOKEN in your environment.")
        return
    
    # Load data
    print("Loading scraped data...")
    try:
        live_vehicles = load_scraped_data()
        print(f"✓ Loaded {len(live_vehicles)} vehicles from live site scrape")
    except FileNotFoundError as e:
        print(f"✗ {e}")
        print("\nPlease run scrape_inventory.py first.")
        return
    
    print("\nFetching Sanity data...")
    sanity_vehicles = fetch_sanity_vehicles()
    print(f"✓ Loaded {len(sanity_vehicles)} vehicles from Sanity CMS")
    
    # Generate report
    print("\nGenerating comparison report...")
    report = generate_comparison_report(live_vehicles, sanity_vehicles)
    
    # Output report
    if args.format in ('console', 'all'):
        print_console_report(report)
    
    if args.format in ('json', 'all'):
        save_json_report(report)
    
    if args.format in ('html', 'all'):
        save_html_report(report)
    
    print()


if __name__ == "__main__":
    main()
