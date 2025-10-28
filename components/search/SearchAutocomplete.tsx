'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Package, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { SearchResult } from '@/types/search';

export interface SearchAutocompleteProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
}

export function SearchAutocomplete({
  query,
  isOpen,
  onClose,
  onSelect,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Debounced fetch with 300ms delay
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=5`,
          { signal: controller.signal }
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        }
      } catch (error: unknown) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Autocomplete fetch error:', error);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex === results.length) {
            // "View all results" selected
            router.push(`/search?q=${encodeURIComponent(query)}`);
          } else if (selectedIndex >= 0 && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, results, selectedIndex, query, router, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current[selectedIndex]) {
      resultsRef.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      onSelect(result);
      onClose();

      // Navigate to detail page
      if (result.type === 'vehicle') {
        const slug = 'slug' in result.item ? result.item.slug : '';
        router.push(`/vehicles/${slug}`);
      } else {
        const handle = 'handle' in result.item ? result.item.handle : '';
        router.push(`/product/${handle}`);
      }
    },
    [onSelect, onClose, router]
  );

  const handleViewAll = useCallback(() => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  }, [query, router, onClose]);

  if (!isOpen || !query || query.length < 2) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover shadow-lg"
      role="listbox"
      aria-label="Search suggestions"
    >
      {isLoading ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          Loading suggestions...
        </div>
      ) : results.length === 0 ? (
        <div className="p-4 text-center text-sm text-muted-foreground">
          No suggestions found
        </div>
      ) : (
        <>
          <div className="max-h-96 overflow-y-auto">
            {results.map((result, index) => {
              const item = result.item;
              const isVehicle = result.type === 'vehicle';

              let imageUrl: string | undefined;
              let title: string = '';
              let price: number | string = '';

              if (isVehicle && 'images' in item) {
                imageUrl = typeof item.images?.[0] === 'string' ? item.images[0] : item.images?.[0]?.url;
                if ('year' in item && 'make' in item && 'model' in item) {
                  title = `${item.year} ${item.make} ${item.model}`;
                } else if ('listingTitle' in item && typeof item.listingTitle === 'string') {
                  title = item.listingTitle;
                }
                if ('price' in item && typeof item.price === 'number') {
                  price = item.price;
                } else {
                  price = 0;
                }
              } else if ('images' in item) {
                const firstImage = item.images?.[0];
                imageUrl = typeof firstImage === 'string'
                  ? firstImage
                  : (firstImage && typeof firstImage === 'object' && 'url' in firstImage)
                    ? firstImage.url
                    : undefined;
                title = 'title' in item && typeof item.title === 'string' ? item.title : '';
                if ('price' in item) {
                  price = typeof item.price === 'string' || typeof item.price === 'number' ? item.price : '';
                } else {
                  price = '';
                }
              } else {
                imageUrl = undefined;
                title = '';
                price = '';
              }

              const key = isVehicle && 'slug' in item
                ? `vehicle-${item.slug}`
                : 'handle' in item
                ? `product-${item.handle}`
                : `result-${index}`;

              return (
                <button
                  key={key}
                  ref={(el) => {
                    resultsRef.current[index] = el;
                  }}
                  className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-accent ${
                    selectedIndex === index ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleSelect(result)}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  {imageUrl && (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isVehicle ? (
                        <Car className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <Package className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {title}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {typeof price === 'number'
                        ? `$${price.toLocaleString()}`
                        : price}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
          <button
            ref={(el) => {
              resultsRef.current[results.length] = el;
            }}
            className={`w-full border-t px-4 py-3 text-center text-sm font-medium text-primary transition-colors hover:bg-accent ${
              selectedIndex === results.length ? 'bg-accent' : ''
            }`}
            onClick={handleViewAll}
            role="option"
            aria-selected={selectedIndex === results.length}
          >
            View all results for &quot;{query}&quot;
          </button>
        </>
      )}
    </div>
  );
}
