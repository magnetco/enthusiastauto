#!/bin/bash
# Check inventory sync progress

echo "==================================================================="
echo "INVENTORY SYNC PROGRESS"
echo "==================================================================="
echo ""

# Check if scraper is running
if pgrep -f "scrape_inventory.py" > /dev/null; then
    echo "✅ Scraper is RUNNING"
    echo ""
    
    # Show last 20 lines of log
    echo "Recent activity:"
    echo "-------------------------------------------------------------------"
    tail -20 /Users/gavin/Projects/enthusiastauto/scripts/scrape.log
    echo "-------------------------------------------------------------------"
    echo ""
    
    # Count completed vehicles
    completed=$(grep -c "Successfully scraped" /Users/gavin/Projects/enthusiastauto/scripts/scrape.log 2>/dev/null || echo "0")
    echo "Vehicles scraped: $completed / 100"
    echo ""
    echo "💡 Monitor live: tail -f /Users/gavin/Projects/enthusiastauto/scripts/scrape.log"
else
    echo "⏸️  Scraper is NOT running"
    echo ""
    
    # Check if it completed
    if grep -q "Successfully scraped" /Users/gavin/Projects/enthusiastauto/scripts/scrape.log 2>/dev/null; then
        completed=$(grep -c "Successfully scraped" /Users/gavin/Projects/enthusiastauto/scripts/scrape.log)
        echo "✅ Scraping completed: $completed vehicles"
        echo ""
        
        # Check if JSON exists
        if [ -f "/Users/gavin/Projects/enthusiastauto/scripts/inventory_data.json" ]; then
            echo "✅ Data file created: inventory_data.json"
            echo ""
            echo "Next step: Run the sync to Sanity"
            echo "  cd /Users/gavin/Projects/enthusiastauto/scripts"
            echo "  python3 sync_to_sanity.py --dry-run  # Preview"
            echo "  python3 sync_to_sanity.py             # Apply"
        fi
    else
        echo "❌ Scraper may have failed. Check the log:"
        echo "  tail -50 /Users/gavin/Projects/enthusiastauto/scripts/scrape.log"
    fi
fi

echo ""
echo "==================================================================="
