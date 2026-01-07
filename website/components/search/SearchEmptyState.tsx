'use client';

import Link from 'next/link';
import { Search, Car, Package, ArrowRight } from 'lucide-react';

export interface SearchEmptyStateProps {
  query: string;
}

const popularSearchTerms = [
  { term: 'M3', href: '/search?q=M3' },
  { term: 'E46', href: '/search?q=E46' },
  { term: 'Coilovers', href: '/search?q=Coilovers' },
  { term: 'E92', href: '/search?q=E92' },
  { term: 'KW', href: '/search?q=KW' },
  { term: 'Bilstein', href: '/search?q=Bilstein' },
];

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-2xl text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-muted-foreground" />
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-foreground mb-3">No results found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We couldn&apos;t find any vehicles or parts matching{' '}
          <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>.
          Try adjusting your search or browse our catalog.
        </p>

        {/* Browse Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            href="/vehicles"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
          >
            <Car className="w-5 h-5" />
            Browse Vehicles
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/parts"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-background text-foreground font-medium hover:bg-muted transition-colors"
          >
            <Package className="w-5 h-5" />
            Shop Parts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Suggestions */}
        <div className="border-t border-border pt-8">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Try searching for
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {popularSearchTerms.map(({ term, href }) => (
              <Link
                key={term}
                href={href}
                className="px-4 py-2 rounded-full bg-muted text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
