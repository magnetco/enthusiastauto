#!/bin/bash

# Script to download remaining chassis icons using curl
# Run with: bash scripts/download-remaining-icons.sh

OUTPUT_DIR="website/public/chassis-icons"
BASE_URL="https://cdn.prod.website-files.com/666907ba2d61a178d13d1f63"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Downloading chassis icons..."
echo ""

# Function to download with proper headers
download_icon() {
  local chassis=$1
  local file_id=$2
  local output_file="$OUTPUT_DIR/${chassis}.avif"
  
  # Skip if file already exists and is not empty
  if [ -s "$output_file" ]; then
    echo "✓ Skipping $chassis (already exists)"
    return
  fi
  
  local url="${BASE_URL}/${file_id}_${chassis}_light.avif"
  
  curl -s -o "$output_file" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
    -H "Accept: image/avif,image/webp,image/*,*/*;q=0.8" \
    -H "Referer: https://www.enthusiastauto.com/" \
    "$url"
  
  # Check if download was successful (file size > 0)
  if [ -s "$output_file" ]; then
    echo "✓ Downloaded: ${chassis}.avif"
  else
    echo "✗ Failed: ${chassis}.avif"
    rm -f "$output_file"
  fi
  
  # Small delay to avoid rate limiting
  sleep 0.2
}

# Download each icon (you'll need to find the correct file IDs from the website)
# The file IDs are the long alphanumeric strings before the chassis code in the URL

# Already downloaded:
# e24: 67608c7070c6a5a8f3896dd4
# e26: 6760879dd69be3dfbe296b7a

# These are guesses based on the pattern - you may need to inspect the actual page
download_icon "e28" "676089e7e1f1c0d8b1c0f7e1"
download_icon "e30" "676089e7e1f1c0d8b1c0f7e2"
download_icon "e31" "676089e7e1f1c0d8b1c0f7e3"
download_icon "e34" "676089e7e1f1c0d8b1c0f7e4"
download_icon "e36" "676089e7e1f1c0d8b1c0f7e5"
download_icon "e39" "676089e7e1f1c0d8b1c0f7e6"
download_icon "e46" "676089e7e1f1c0d8b1c0f7e7"
download_icon "e60" "676089e7e1f1c0d8b1c0f7e8"
download_icon "e82" "676089e7e1f1c0d8b1c0f7e9"
download_icon "e9x" "676089e7e1f1c0d8b1c0f7ea"
download_icon "f8x" "676089e7e1f1c0d8b1c0f7eb"
download_icon "f87" "676089e7e1f1c0d8b1c0f7ec"
download_icon "g8x" "676089e7e1f1c0d8b1c0f7ed"
download_icon "z3" "676089e7e1f1c0d8b1c0f7ee"
download_icon "z4" "676089e7e1f1c0d8b1c0f7ef"
download_icon "z8" "676089e7e1f1c0d8b1c0f7f0"
download_icon "sav" "676089e7e1f1c0d8b1c0f7f1"
download_icon "other" "676089e7e1f1c0d8b1c0f7f2"

echo ""
echo "✓ Download complete!"
echo ""
echo "To find the correct file IDs:"
echo "1. Open https://www.enthusiastauto.com/inventory in your browser"
echo "2. Open DevTools (F12) and go to Network tab"
echo "3. Filter by 'avif'"
echo "4. Scroll to the chassis filter section"
echo "5. Look at the image URLs in the Network tab"
echo "6. Update the file IDs in this script"
