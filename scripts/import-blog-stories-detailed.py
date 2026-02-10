#!/usr/bin/env python3
"""
Import blog stories and images from enthusiastauto.com with detailed extraction
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

# Configuration
BASE_URL = "https://www.enthusiastauto.com"
BLOG_URL = f"{BASE_URL}/under-the-hood"
OUTPUT_DIR = Path(__file__).parent.parent / "website" / "public" / "blog-images"
OUTPUT_JSON = Path(__file__).parent / "blog-stories-detailed.json"

# Create output directory if it doesn't exist
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def download_image(image_url, filename):
    """Download an image and save it to the output directory"""
    try:
        response = requests.get(image_url, timeout=30)
        response.raise_for_status()
        
        filepath = OUTPUT_DIR / filename
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"  ✓ Downloaded: {filename}")
        return str(filepath.relative_to(Path(__file__).parent.parent / "website" / "public"))
    except Exception as e:
        print(f"  ✗ Failed to download {image_url}: {e}")
        return None

def extract_date_from_text(text):
    """Extract date from text using regex patterns"""
    # Pattern: "February 20, 2025" or "Jan 30, 2025"
    patterns = [
        r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}',
        r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0)
    
    return None

def fetch_story_details(story_url, slug):
    """Fetch full story details from individual story page"""
    print(f"\n→ Fetching: {slug}")
    
    try:
        response = requests.get(story_url, timeout=30)
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
        
        # Extract date
        date_str = None
        
        # Try time element
        time_elem = soup.find('time')
        if time_elem:
            date_str = time_elem.get_text(strip=True) or time_elem.get('datetime', '')
        
        # Try to find date in text
        if not date_str:
            page_text = soup.get_text()
            date_str = extract_date_from_text(page_text)
        
        # Extract excerpt/description
        excerpt = None
        
        # Try meta description
        meta_desc = soup.find('meta', {'name': 'description'}) or soup.find('meta', property='og:description')
        if meta_desc:
            excerpt = meta_desc.get('content', '').strip()
        
        # Try first paragraph
        if not excerpt:
            content_area = soup.find('article') or soup.find(class_=['content', 'post-content', 'entry-content'])
            if content_area:
                first_p = content_area.find('p')
                if first_p:
                    excerpt = first_p.get_text(strip=True)
        
        # Extract featured image
        image_url = None
        
        # Try og:image meta tag
        og_image = soup.find('meta', property='og:image')
        if og_image:
            image_url = og_image.get('content', '')
        
        # Try first image in article
        if not image_url:
            content_area = soup.find('article') or soup.find(class_=['content', 'post-content', 'entry-content'])
            if content_area:
                img = content_area.find('img')
                if img:
                    image_url = img.get('src') or img.get('data-src')
        
        # Try any image on the page
        if not image_url:
            img = soup.find('img')
            if img:
                image_url = img.get('src') or img.get('data-src')
        
        if image_url:
            image_url = urljoin(BASE_URL, image_url)
        
        # Extract full content
        content = None
        content_area = soup.find('article') or soup.find(class_=['content', 'post-content', 'entry-content'])
        if content_area:
            # Get all paragraphs
            paragraphs = content_area.find_all('p')
            content = '\n\n'.join([p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)])
        
        # Extract category/tags
        category = None
        category_elem = soup.find(class_=['category', 'tag', 'post-category'])
        if category_elem:
            category = category_elem.get_text(strip=True)
        
        print(f"  ✓ Title: {title}")
        print(f"  ✓ Date: {date_str}")
        print(f"  ✓ Excerpt: {excerpt[:100] if excerpt else 'None'}...")
        print(f"  ✓ Image: {image_url}")
        
        return {
            'title': title,
            'date': date_str,
            'excerpt': excerpt,
            'content': content,
            'image_url': image_url,
            'category': category
        }
        
    except Exception as e:
        print(f"  ✗ Error fetching story details: {e}")
        return None

def get_story_urls():
    """Get all story URLs from the blog page"""
    print(f"Fetching blog page: {BLOG_URL}\n")
    
    try:
        response = requests.get(BLOG_URL, timeout=30)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching blog page: {e}")
        return []
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find all blog post links
    story_urls = []
    
    # Look for links to blog posts
    for link in soup.find_all('a', href=True):
        href = link.get('href', '')
        if '/under-the-hood/' in href and href not in story_urls:
            full_url = urljoin(BASE_URL, href)
            if full_url != BLOG_URL and full_url not in story_urls:
                story_urls.append(full_url)
    
    print(f"Found {len(story_urls)} unique story URLs\n")
    return story_urls

def main():
    print("=" * 70)
    print("Enthusiast Auto Group - Detailed Blog Story Import")
    print("=" * 70)
    print()
    
    # Get all story URLs
    story_urls = get_story_urls()
    
    if not story_urls:
        print("\n⚠ No story URLs found!")
        return
    
    # Fetch details for each story
    stories = []
    
    for idx, story_url in enumerate(story_urls[:10], 1):  # Limit to first 10
        slug = story_url.split('/')[-1]
        
        # Fetch story details
        details = fetch_story_details(story_url, slug)
        
        if not details:
            continue
        
        # Download image if available
        local_image_path = None
        if details.get('image_url'):
            parsed = urlparse(details['image_url'])
            ext = os.path.splitext(parsed.path)[1] or '.jpg'
            filename = f"{slug}{ext}"
            
            local_image_path = download_image(details['image_url'], filename)
            time.sleep(0.5)  # Be nice to the server
        
        story = {
            'title': details.get('title') or slug.replace('-', ' ').title(),
            'slug': slug,
            'excerpt': details.get('excerpt', ''),
            'content': details.get('content', ''),
            'date': details.get('date', ''),
            'category': details.get('category', ''),
            'url': story_url,
            'image_url': details.get('image_url'),
            'local_image': local_image_path,
        }
        
        stories.append(story)
        
        # Progress indicator
        print(f"  Progress: {idx}/{min(len(story_urls), 10)}")
        time.sleep(1)  # Be nice to the server
    
    print(f"\n{'=' * 70}")
    print(f"Successfully extracted {len(stories)} stories")
    print(f"{'=' * 70}\n")
    
    # Save to JSON
    output_data = {
        'extracted_at': datetime.now().isoformat(),
        'source_url': BLOG_URL,
        'total_stories': len(stories),
        'stories': stories
    }
    
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Saved story data to: {OUTPUT_JSON}")
    print(f"✓ Images saved to: {OUTPUT_DIR}")
    print()
    
    # Print summary
    print("Summary:")
    print(f"  Total stories: {len(stories)}")
    print(f"  Stories with images: {sum(1 for s in stories if s.get('local_image'))}")
    print(f"  Stories with dates: {sum(1 for s in stories if s.get('date'))}")
    print()
    
    # Print story list
    print("Stories extracted:")
    for i, story in enumerate(stories, 1):
        print(f"\n  {i}. {story['title']}")
        if story.get('date'):
            print(f"     Date: {story['date']}")
        if story.get('category'):
            print(f"     Category: {story['category']}")
        if story.get('local_image'):
            print(f"     Image: {story['local_image']}")
        if story.get('excerpt'):
            print(f"     Excerpt: {story['excerpt'][:100]}...")

if __name__ == "__main__":
    main()
