/**
 * Browser Console Script to Extract Chassis Icon URLs
 * 
 * INSTRUCTIONS:
 * 1. Open https://www.enthusiastauto.com/inventory?status=Current%20Inventory
 * 2. Open DevTools (F12)
 * 3. Go to Console tab
 * 4. Copy and paste this entire script
 * 5. Press Enter
 * 6. Copy the output and use it to download icons
 */

(function() {
  console.log('🔍 Searching for chassis icons...\n');
  
  const icons = new Map();
  
  // Find all images that look like chassis icons
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    const src = img.src;
    const alt = img.alt || '';
    
    // Look for chassis icon patterns
    if (src.includes('_light.avif') || src.includes('chassis')) {
      const match = src.match(/([a-z0-9]+)_light\.avif/i);
      if (match) {
        const chassis = match[1].toLowerCase();
        icons.set(chassis, src);
      }
    }
  });
  
  if (icons.size === 0) {
    console.log('❌ No chassis icons found. Make sure you\'re on the inventory page.');
    return;
  }
  
  console.log(`✅ Found ${icons.size} chassis icons:\n`);
  
  // Display as a table
  const iconArray = Array.from(icons.entries()).map(([chassis, url]) => ({
    Chassis: chassis.toUpperCase(),
    URL: url
  }));
  
  console.table(iconArray);
  
  // Generate curl commands
  console.log('\n📥 Curl commands to download:\n');
  console.log('cd website/public/chassis-icons\n');
  
  icons.forEach((url, chassis) => {
    console.log(`curl -o ${chassis}.avif -H "User-Agent: Mozilla/5.0" -H "Referer: https://www.enthusiastauto.com/" "${url}"`);
  });
  
  // Generate wget commands (alternative)
  console.log('\n\n📥 Wget commands (alternative):\n');
  console.log('cd website/public/chassis-icons\n');
  
  icons.forEach((url, chassis) => {
    console.log(`wget -O ${chassis}.avif --header="User-Agent: Mozilla/5.0" --header="Referer: https://www.enthusiastauto.com/" "${url}"`);
  });
  
  // Generate Node.js fetch script
  console.log('\n\n📥 Node.js fetch code:\n');
  console.log('const icons = {');
  icons.forEach((url, chassis) => {
    console.log(`  ${chassis}: '${url}',`);
  });
  console.log('};\n');
  
  // Copy-friendly format
  console.log('\n📋 Copy this for the download script:\n');
  const scriptContent = Array.from(icons.entries())
    .map(([chassis, url]) => {
      const fileId = url.match(/\/([a-f0-9]+)_/)?.[1] || 'unknown';
      return `download_icon "${chassis}" "${fileId}"`;
    })
    .join('\n');
  
  console.log(scriptContent);
  
  console.log('\n✅ Done! Use any of the methods above to download the icons.');
})();
