'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Car, Package, Loader2 } from 'lucide-react';
import { SearchResultCard } from './SearchResultCard';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchPagination } from './SearchPagination';
import type { SearchResult, SearchResponse } from '@/types/search';
import { cn } from '@/lib/utils';

export interface SearchResultsProps {
  query: string;
  type: 'vehicles' | 'parts' | 'all';
  page: number;
}

const RESULTS_PER_PAGE = 20;

export function SearchResults({ query, type, page }: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [partsCount, setPartsCount] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.length < 2) {
        setResults([]);
        setTotalResults(0);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=${type}&limit=${RESULTS_PER_PAGE}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data: SearchResponse = await response.json();
        setResults(data.results || []);
        setTotalResults(data.totalResults || 0);

        const vehicles = data.results.filter((r) => r.type === 'vehicle');
        const parts = data.results.filter((r) => r.type === 'product');
        setVehicleCount(vehicles.length);
        setPartsCount(parts.length);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load search results. Please try again.');
        setResults([]);
        setTotalResults(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, type, page]);

  const handleTypeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', query);
    params.set('type', newType);
    params.delete('page');
    router.push(`/search?${params.toString()}`);
  };

  // Show message for empty or too short query
  if (!query || query.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Start Your Search</h2>
        <p className="text-muted-foreground max-w-md">
          Enter at least 2 characters to search our inventory of BMW vehicles and parts.
        </p>
      </div>
    );
  }

  // Filter buttons component
  const FilterButtons = () => (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => handleTypeChange('all')}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
          type === 'all'
            ? "bg-foreground text-background border-foreground"
            : "bg-background text-foreground border-border hover:bg-muted"
        )}
      >
        All
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          type === 'all' ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
        )}>
          {vehicleCount + partsCount}
        </span>
      </button>
      <button
        onClick={() => handleTypeChange('vehicles')}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
          type === 'vehicles'
            ? "bg-foreground text-background border-foreground"
            : "bg-background text-foreground border-border hover:bg-muted"
        )}
      >
        <Car className="w-4 h-4" />
        Vehicles
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          type === 'vehicles' ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
        )}>
          {vehicleCount}
        </span>
      </button>
      <button
        onClick={() => handleTypeChange('parts')}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
          type === 'parts'
            ? "bg-foreground text-background border-foreground"
            : "bg-background text-foreground border-border hover:bg-muted"
        )}
      >
        <Package className="w-4 h-4" />
        Parts
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          type === 'parts' ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
        )}>
          {partsCount}
        </span>
      </button>
    </div>
  );

  // Show loading skeleton
  if (isLoading) {
    return (
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Searching for &ldquo;{query}&rdquo;
            </h1>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading results...</span>
          </div>
        </div>

        {/* Skeleton filter buttons */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-24 bg-muted rounded-full animate-pulse" />
          ))}
        </div>

        {/* Skeleton results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border rounded-xl p-4 bg-card animate-pulse">
              <div className="flex gap-4">
                <div className="h-24 w-24 bg-muted rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-1/4 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show empty state
  if (results.length === 0) {
    return <SearchEmptyState query={query} />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Results for &ldquo;{query}&rdquo;
          </h1>
        </div>
        <p className="text-muted-foreground">
          Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-8">
        <FilterButtons />
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {results.map((result, index) => {
          const isVehicle = result.type === 'vehicle';
          const key = isVehicle && 'slug' in result.item
            ? `vehicle-${result.item.slug}-${index}`
            : 'handle' in result.item
            ? `product-${result.item.handle}-${index}`
            : `item-${index}`;

          return <SearchResultCard key={key} result={result} query={query} />;
        })}
      </div>

      {/* Pagination */}
      {totalResults > RESULTS_PER_PAGE && (
        <SearchPagination
          currentPage={page}
          totalResults={totalResults}
          resultsPerPage={RESULTS_PER_PAGE}
          query={query}
          type={type}
        />
      )}
    </div>
  );
}
