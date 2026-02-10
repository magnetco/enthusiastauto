#!/usr/bin/env python3
import sys
import requests
from bs4 import BeautifulSoup

print("Starting test scrape...", flush=True)

url = "https://www.enthusiastauto.com/inventory"
headers = {'User-Agent': 'Mozilla/5.0'}

print(f"Fetching {url}...", flush=True)
response = requests.get(url, headers=headers, timeout=30)
print(f"Got response: {response.status_code}", flush=True)

soup = BeautifulSoup(response.content, 'html.parser')
links = []

for a in soup.find_all('a', href=True):
    href = a.get('href')
    if '/inventory/' in href and href != '/inventory' and href != '/inventory/':
        links.append(href)

unique_links = list(set(links))
print(f"Found {len(unique_links)} vehicles", flush=True)

if unique_links:
    first_link = unique_links[0]
    full_url = f"https://www.enthusiastauto.com{first_link}"
    print(f"\nFetching first vehicle: {full_url}", flush=True)
    
    vehicle_response = requests.get(full_url, headers=headers, timeout=30)
    print(f"Got vehicle page: {vehicle_response.status_code}", flush=True)
    print(f"Content length: {len(vehicle_response.content)} bytes", flush=True)
    
    vehicle_soup = BeautifulSoup(vehicle_response.content, 'html.parser')
    title = vehicle_soup.find('h1')
    if title:
        print(f"Title: {title.get_text(strip=True)}", flush=True)
    else:
        print("No title found", flush=True)

print("\nTest complete!", flush=True)
