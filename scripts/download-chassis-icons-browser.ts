#!/usr/bin/env ts-node

/**
 * Script to scrape chassis icons from the inventory page
 * This will be run manually with browser automation
 */

// Chassis codes to download
export const chassisCodes = [
  'e24', 'e26', 'e28', 'e30', 'e31',
  'e34', 'e36', 'e39', 'e46', 'e60',
  'e82', 'e9x', 'f8x', 'f87', 'g8x',
  'z3', 'z4', 'z8', 'sav', 'other'
];

console.log('Chassis codes to download:', chassisCodes);
console.log('\nTo download these icons:');
console.log('1. Open https://www.enthusiastauto.com/inventory?status=Current%20Inventory');
console.log('2. Right-click on each chassis icon');
console.log('3. Save as: {chassis-code}.avif to website/public/chassis-icons/');
