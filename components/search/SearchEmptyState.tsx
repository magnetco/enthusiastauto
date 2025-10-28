'use client';

import Link from 'next/link';
import { Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export interface SearchEmptyStateProps {
  query: string;
}

const popularSearchTerms = [
  { term: 'BMW M3', href: '/search?q=BMW+M3' },
  { term: 'E46', href: '/search?q=E46' },
  { term: 'E92 M3', href: '/search?q=E92+M3' },
  { term: 'Performance Parts', href: '/search?q=Performance+Parts' },
  { term: 'M Parts', href: '/search?q=M+Parts' },
  { term: 'Carbon Fiber', href: '/search?q=Carbon+Fiber' },
];

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No results found</AlertTitle>
          <AlertDescription>
            We couldn&apos;t find any vehicles or parts matching{' '}
            <span className="font-semibold">&quot;{query}&quot;</span>
          </AlertDescription>
        </Alert>

        <div className="text-center mb-8">
          <Search
            className="mx-auto h-16 w-16 text-muted-foreground mb-4"
            aria-hidden="true"
          />
          <h2 className="text-2xl font-bold mb-4">Try these suggestions:</h2>
          <ul className="text-left space-y-2 text-muted-foreground">
            <li>• Check your spelling</li>
            <li>• Try different keywords</li>
            <li>• Use more general search terms</li>
            <li>• Browse our categories below</li>
          </ul>
        </div>

        {/* Browse Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/vehicles">
            <Button variant="outline" size="lg" className="h-auto py-4 w-full">
              <div className="text-center w-full">
                <div className="font-semibold">Browse All Vehicles</div>
                <div className="text-sm text-muted-foreground">
                  Explore our BMW inventory
                </div>
              </div>
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg" className="h-auto py-4 w-full">
              <div className="text-center w-full">
                <div className="font-semibold">Shop All Parts</div>
                <div className="text-sm text-muted-foreground">
                  Browse our parts catalog
                </div>
              </div>
            </Button>
          </Link>
        </div>

        {/* Popular Searches */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Popular Searches:</h3>
          <div className="flex flex-wrap gap-2">
            {popularSearchTerms.map(({ term, href }) => (
              <Link key={term} href={href}>
                <Button variant="secondary" size="sm" className="rounded-full">
                  {term}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
