'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchResultCard } from './SearchResultCard';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchPagination } from './SearchPagination';
import type { SearchResult, SearchResponse } from '@/types/search';

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

        // Calculate counts by type for tabs
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
    params.delete('page'); // Reset to page 1 when changing filter
    router.push(`/search?${params.toString()}`);
  };

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-muted rounded mb-2" />
        <div className="h-4 w-32 bg-muted rounded mb-6" />
        <div className="flex gap-2 mb-6">
          <div className="h-10 w-24 bg-muted rounded" />
          <div className="h-10 w-24 bg-muted rounded" />
          <div className="h-10 w-24 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex gap-4">
                <div className="h-[150px] w-[150px] bg-muted rounded" />
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-full bg-muted rounded" />
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Show message for empty or too short query
  if (!query || query.length < 2) {
    return (
      <Alert>
        <AlertDescription>
          Please enter at least 2 characters to search.
        </AlertDescription>
      </Alert>
    );
  }

  // Show empty state
  if (results.length === 0) {
    return <SearchEmptyState query={query} />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground">
          Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* Type Filter Tabs */}
      <Tabs value={type} onValueChange={handleTypeChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">
            All ({vehicleCount + partsCount})
          </TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles ({vehicleCount})</TabsTrigger>
          <TabsTrigger value="parts">Parts ({partsCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-4 mb-8">
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
