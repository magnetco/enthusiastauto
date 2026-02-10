#!/usr/bin/env python3
"""
Scrape vehicle inventory data from the live EnthusiastAuto.com (Webflow) site

This script fetches all vehicle data including images, specifications, descriptions,
and metadata from the live Webflow site and saves it to a structured JSON file.

Usage:
    python3 scripts/scrape_inventory.py [--limit N] [--status current|sold|all]
"""

import os
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from pathlib import Path
import time
from datetime import datetime
import re
import argparse
from typing import Optional, Dict, List, Any

# Configuration
BASE_URL = "https://www.enthusiastauto.com"
INVENTORY_URL = f"{BASE_URL}/inventory"
OUTPUT_DIR = Path(__file__).parent / "vehicle-images"
OUTPUT_JSON = Path(__file__).parent / "inventory_data.json"

# Create output directory
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Request headers
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}


def download_image(image_url: str, filename: str) -> Optional[str]:
    """Download an image and save it to the output directory"""
    try:
        response = requests.get(image_url, headers=HEADERS, timeout=30, stream=True)
        response.raise_for_status()
        
        filepath = OUTPUT_DIR / filename
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"    ✓ Downloaded: {filename}")
        return str(filepath)
    except Exception as e:
        print(f"    ✗ Failed to download {image_url}: {e}")
        return None


def extract_year_from_title(title: str) -> Optional[int]:
    """Extract year from vehicle title"""
    match = re.search(r'\b(19|20)\d{2}\b', title)
    if match:
        return int(match.group(0))
    return None


def extract_chassis_from_title(title: str) -> Optional[str]:
    """Extract chassis code from title (e.g., E92, F80, G82)"""
    # Common BMW chassis codes
    chassis_patterns = [
        r'\bE\d{2,3}\b',  # E30, E36, E39, E46, E90, E92, etc.
        r'\bF\d{2,3}\b',  # F80, F82, F87, etc.
        r'\bG\d{2,3}\b',  # G80, G82, etc.
        r'\bX\d\b',       # X3, X5, X6
    ]
    
    for pattern in chassis_patterns:
        match = re.search(pattern, title, re.IGNORECASE)
        if match:
            return match.group(0).upper()
    return None


def extract_model_from_title(title: str) -> Optional[str]:
    """Extract model from title (e.g., M3, M5, Z8)"""
    # Common BMW M models
    model_patterns = [
        r'\bM\d\b',           # M3, M5, M6, etc.
        r'\bM\d\s+\w+\b',     # M3 CSL, M5 Competition
        r'\bZ\d\b',           # Z3, Z4, Z8
        r'\b\d+i\b',          # 330i, 540i
    ]
    
    for pattern in model_patterns:
        match = re.search(pattern, title, re.IGNORECASE)
        if match:
            return match.group(0).strip()
    return None


def parse_price(price_text: str) -> tuple[Optional[int], bool]:
    """Parse price text and return (price, show_call_for_price)"""
    if not price_text:
        return None, True
    
    # Check for "Call for price" or similar
    if 'call' in price_text.lower():
        return None, True
    
    # Extract numeric price
    price_match = re.search(r'\$?([\d,]+)', price_text)
    if price_match:
        price = int(price_match.group(1).replace(',', ''))
        return price, False
    
    return None, True


def parse_mileage(mileage_text: str) -> Optional[int]:
    """Parse mileage text and return integer"""
    if not mileage_text:
        return None
    
    # Extract numeric mileage
    mileage_match = re.search(r'([\d,]+)', mileage_text)
    if mileage_match:
        return int(mileage_match.group(1).replace(',', ''))
    
    return None


def extract_badges(soup: BeautifulSoup) -> List[str]:
    """Extract status badges from vehicle page"""
    badges = []
    
    # Look for common badge classes/elements
    badge_selectors = [
        '.badge', '.tag', '.label', '.status-badge',
        '[class*="badge"]', '[class*="tag"]'
    ]
    
    for selector in badge_selectors:
        elements = soup.select(selector)
        for elem in elements:
            text = elem.get_text(strip=True)
            if text and text not in badges:
                badges.append(text)
    
    return badges


def extract_specifications(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract vehicle specifications from the page"""
    specs = {}
    
    # Look for specification sections
    spec_sections = soup.find_all(['div', 'section'], class_=lambda x: x and ('spec' in x.lower() or 'detail' in x.lower()))
    
    for section in spec_sections:
        # Find label-value pairs
        labels = section.find_all(['dt', 'label', 'div'], class_=lambda x: x and 'label' in x.lower())
        
        for label in labels:
            label_text = label.get_text(strip=True).lower()
            
            # Find corresponding value
            value_elem = label.find_next_sibling()
            if not value_elem:
                value_elem = label.find_next(['dd', 'span', 'div'])
            
            if value_elem:
                value = value_elem.get_text(strip=True)
                
                # Map common fields
                if 'vin' in label_text:
                    specs['vin'] = value
                elif 'stock' in label_text:
                    specs['stockNumber'] = value
                elif 'mileage' in label_text or 'miles' in label_text:
                    specs['mileage'] = parse_mileage(value)
                elif 'transmission' in label_text:
                    specs['transmission'] = value
                elif 'engine' in label_text and 'code' in label_text:
                    specs['engineCode'] = value
                elif 'engine' in label_text and 'size' in label_text:
                    specs['engineSize'] = value
                elif 'exterior' in label_text and 'color' in label_text:
                    specs['exteriorColor'] = value
                elif 'interior' in label_text and 'color' in label_text:
                    specs['interiorColor'] = value
    
    return specs


def extract_content_sections(soup: BeautifulSoup) -> Dict[str, str]:
    """Extract content sections like highlights, overview, history"""
    content = {}
    
    # Look for common section headings
    sections = {
        'highlights': ['highlights', 'features', 'key features'],
        'overview': ['overview', 'description', 'about'],
        'history': ['history', 'service history', 'ownership'],
        'eagImpressions': ['eag impressions', 'impressions', 'our take']
    }
    
    for key, keywords in sections.items():
        for keyword in keywords:
            # Find heading with keyword
            heading = soup.find(['h2', 'h3', 'h4'], string=re.compile(keyword, re.IGNORECASE))
            
            if heading:
                # Get content after heading
                content_parts = []
                
                # Get all siblings until next heading
                for sibling in heading.find_next_siblings():
                    if sibling.name in ['h2', 'h3', 'h4']:
                        break
                    
                    if sibling.name == 'ul':
                        # Extract list items for highlights
                        items = [li.get_text(strip=True) for li in sibling.find_all('li')]
                        content_parts.extend(items)
                    elif sibling.name == 'p':
                        text = sibling.get_text(strip=True)
                        if text:
                            content_parts.append(text)
                
                if content_parts:
                    if key == 'highlights':
                        content[key] = content_parts  # Keep as list
                    else:
                        content[key] = '\n\n'.join(content_parts)
                    break
    
    return content


def extract_gallery_images(soup: BeautifulSoup, slug: str) -> List[Dict[str, str]]:
    """Extract gallery images from the page"""
    gallery = []
    seen_urls = set()  # Track unique image URLs
    
    # Look for gallery sections
    gallery_sections = soup.find_all(['div', 'section'], class_=lambda x: x and 'gallery' in x.lower())
    
    for section in gallery_sections:
        # Find all images in gallery
        images = section.find_all('img')
        
        for idx, img in enumerate(images):
            # Stop at 20 images
            if len(gallery) >= 20:
                break
            img_url = img.get('src') or img.get('data-src') or img.get('srcset', '').split(',')[0].split()[0]
            
            if img_url:
                img_url = urljoin(BASE_URL, img_url)
                
                # Skip duplicates
                if img_url in seen_urls:
                    continue
                seen_urls.add(img_url)
                
                # Determine category from parent elements or classes
                category = 'misc'
                parent_text = str(section).lower()
                
                if 'exterior' in parent_text:
                    category = 'exterior'
                elif 'interior' in parent_text:
                    category = 'interior'
                elif 'engine' in parent_text:
                    category = 'engine'
                
                # Download image
                ext = os.path.splitext(urlparse(img_url).path)[1] or '.jpg'
                filename = f"{slug}-gallery-{len(gallery)}{ext}"
                local_path = download_image(img_url, filename)
                
                gallery.append({
                    'url': img_url,
                    'local_path': local_path,
                    'category': category
                })
                
                time.sleep(0.3)  # Rate limiting
        
        # Stop if we have enough images
        if len(gallery) >= 20:
            break
    
    return gallery


def scrape_vehicle_detail(vehicle_url: str, slug: str) -> Optional[Dict[str, Any]]:
    """Scrape detailed vehicle information from a vehicle page"""
    print(f"\n→ Scraping: {slug}")
    print(f"  URL: {vehicle_url}")
    
    try:
        response = requests.get(vehicle_url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract title
        title = None
        title_elem = soup.find('h1')
        if title_elem:
            title = title_elem.get_text(strip=True)
        
        if not title:
            # Try meta title
            meta_title = soup.find('meta', property='og:title')
            if meta_title:
                title = meta_title.get('content', '').strip()
        
        print(f"  Title: {title}")
        
        # Extract year, chassis, model from title
        year = extract_year_from_title(title) if title else None
        chassis = extract_chassis_from_title(title) if title else None
        model = extract_model_from_title(title) if title else None
        
        # Extract price
        price_elem = soup.find(['div', 'span'], class_=lambda x: x and 'price' in x.lower())
        price_text = price_elem.get_text(strip=True) if price_elem else None
        list_price, show_call_for_price = parse_price(price_text)
        
        print(f"  Price: ${list_price:,}" if list_price else "  Price: Call for price")
        
        # Extract specifications
        specs = extract_specifications(soup)
        print(f"  VIN: {specs.get('vin', 'N/A')}")
        print(f"  Mileage: {specs.get('mileage', 'N/A')}")
        
        # Extract badges
        badges = extract_badges(soup)
        
        # Determine status
        status = 'current'
        badge_text = ' '.join(badges).lower()
        if 'sold' in badge_text:
            status = 'sold'
        elif 'pending' in badge_text or 'sale pending' in badge_text:
            status = 'sale-pending'
        
        # Extract content sections
        content = extract_content_sections(soup)
        
        # Extract signature shot (main image)
        signature_shot = None
        og_image = soup.find('meta', property='og:image')
        if og_image:
            img_url = og_image.get('content', '')
            if img_url:
                img_url = urljoin(BASE_URL, img_url)
                ext = os.path.splitext(urlparse(img_url).path)[1] or '.jpg'
                filename = f"{slug}-signature{ext}"
                local_path = download_image(img_url, filename)
                
                signature_shot = {
                    'url': img_url,
                    'local_path': local_path
                }
                time.sleep(0.3)
        
        # Extract gallery images
        print("  Extracting gallery images...")
        gallery_images = extract_gallery_images(soup, slug)
        print(f"  ✓ Found {len(gallery_images)} gallery images")
        
        # Build vehicle data
        vehicle = {
            'slug': slug,
            'listingTitle': title,
            'year': year,
            'chassis': chassis,
            'model': model,
            'vin': specs.get('vin'),
            'stockNumber': specs.get('stockNumber'),
            'listingPrice': list_price,
            'showCallForPrice': show_call_for_price,
            'mileage': specs.get('mileage'),
            'transmission': specs.get('transmission'),
            'engineCode': specs.get('engineCode'),
            'engineSize': specs.get('engineSize'),
            'exteriorColor': specs.get('exteriorColor'),
            'interiorColor': specs.get('interiorColor'),
            'status': status,
            'badges': badges,
            'highlights': content.get('highlights', []),
            'overview': content.get('overview', ''),
            'history': content.get('history', ''),
            'eagImpressions': content.get('eagImpressions', ''),
            'url': vehicle_url,
            'images': {
                'signatureShot': signature_shot,
                'gallery': gallery_images
            }
        }
        
        print(f"  ✓ Successfully scraped {slug}")
        return vehicle
        
    except Exception as e:
        print(f"  ✗ Error scraping {vehicle_url}: {e}")
        return None


def get_vehicle_urls(status_filter: Optional[str] = None) -> List[tuple[str, str]]:
    """Get all vehicle URLs from the inventory page"""
    print(f"Fetching inventory page: {INVENTORY_URL}\n", flush=True)
    
    # Build URL with status filter
    url = INVENTORY_URL
    if status_filter and status_filter != 'all':
        url = f"{INVENTORY_URL}?status={status_filter.title()}%20Inventory"
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching inventory page: {e}")
        return []
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find all vehicle links
    vehicle_urls = []
    
    for link in soup.find_all('a', href=True):
        href = link.get('href', '')
        
        # Look for inventory detail pages
        if '/inventory/' in href and href != '/inventory' and href != '/inventory/':
            full_url = urljoin(BASE_URL, href)
            
            # Extract slug from URL
            slug = href.rstrip('/').split('/')[-1]
            
            if (full_url, slug) not in vehicle_urls:
                vehicle_urls.append((full_url, slug))
    
    # Remove duplicates
    vehicle_urls = list(dict.fromkeys(vehicle_urls))
    
    print(f"Found {len(vehicle_urls)} unique vehicles\n")
    return vehicle_urls


def main():
    parser = argparse.ArgumentParser(
        description='Scrape vehicle inventory from EnthusiastAuto.com'
    )
    parser.add_argument(
        '--limit',
        type=int,
        help='Limit number of vehicles to scrape (for testing)'
    )
    parser.add_argument(
        '--status',
        choices=['current', 'sold', 'all'],
        default='all',
        help='Filter by vehicle status'
    )
    
    args = parser.parse_args()
    
    print("=" * 70, flush=True)
    print("Enthusiast Auto Group - Vehicle Inventory Scraper", flush=True)
    print("=" * 70, flush=True)
    print(flush=True)
    
    # Get all vehicle URLs
    vehicle_urls = get_vehicle_urls(args.status)
    
    if not vehicle_urls:
        print("\n⚠ No vehicle URLs found!")
        return
    
    # Apply limit if specified
    if args.limit:
        vehicle_urls = vehicle_urls[:args.limit]
        print(f"Limiting to first {args.limit} vehicles\n")
    
    # Scrape each vehicle
    vehicles = []
    
    for idx, (vehicle_url, slug) in enumerate(vehicle_urls, 1):
        vehicle = scrape_vehicle_detail(vehicle_url, slug)
        
        if vehicle:
            vehicles.append(vehicle)
        
        print(f"  Progress: {idx}/{len(vehicle_urls)}")
        time.sleep(1.5)  # Rate limiting between vehicles
    
    print(f"\n{'=' * 70}")
    print(f"Successfully scraped {len(vehicles)} vehicles")
    print(f"{'=' * 70}\n")
    
    # Save to JSON
    output_data = {
        'scraped_at': datetime.now().isoformat(),
        'source_url': INVENTORY_URL,
        'total_vehicles': len(vehicles),
        'vehicles': vehicles
    }
    
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Saved vehicle data to: {OUTPUT_JSON}")
    print(f"✓ Images saved to: {OUTPUT_DIR}")
    print()
    
    # Print summary
    print("Summary:")
    print(f"  Total vehicles: {len(vehicles)}")
    print(f"  Current inventory: {sum(1 for v in vehicles if v['status'] == 'current')}")
    print(f"  Sold vehicles: {sum(1 for v in vehicles if v['status'] == 'sold')}")
    print(f"  Vehicles with images: {sum(1 for v in vehicles if v['images']['signatureShot'])}")
    print(f"  Total gallery images: {sum(len(v['images']['gallery']) for v in vehicles)}")
    print()


if __name__ == "__main__":
    main()
