#!/bin/bash

# Test script for unified search API
# Run: bash test-search.sh

BASE_URL="http://localhost:3000/api/search"

echo "🔍 Testing Unified Search API"
echo "=============================="
echo ""

echo "1️⃣ Search everything for 'BMW':"
curl -s "$BASE_URL?q=BMW" | jq '{totalResults, searchTime, types: [.results[].type] | unique}'
echo ""

echo "2️⃣ Search only vehicles for 'E46':"
curl -s "$BASE_URL?q=E46&type=vehicles" | jq '{totalResults, results: .results[] | {type, title: .item.listingTitle}}'
echo ""

echo "3️⃣ Search only parts for 'brake':"
curl -s "$BASE_URL?q=brake&type=parts" | jq '{totalResults, results: .results[] | {type, title: .item.title}}'
echo ""

echo "4️⃣ Search with limit of 3:"
curl -s "$BASE_URL?q=BMW&limit=3" | jq '{totalResults, returned: (.results | length), results: .results[] | {type}}'
echo ""

echo "5️⃣ Performance test (search time):"
curl -s "$BASE_URL?q=M3" | jq '{searchTime, target: "300ms"}'
echo ""

echo "✅ Test complete!"
