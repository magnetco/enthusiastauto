'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Car, Package, ArrowUpRight } from 'lucide-react';
import { Highlight } from './Highlight';
import { highlightQueryTerms, extractSnippet } from '@/lib/search/highlight';
import type { SearchResult } from '@/types/search';
import { cn } from '@/lib/utils';

export interface SearchResultCardProps {
  result: SearchResult;
  query: string;
}

export function SearchResultCard({ result, query }: SearchResultCardProps) {
  const isVehicle = result.type === 'vehicle';
  const item = result.item;

  // Extract data based on type with proper type guards
  let imageUrl: string | undefined;
  let title: string;
  let url: string;
  let price: string;
  let description: string;
  let additionalInfo: {
    mileage?: number;
    transmission?: string;
    exteriorColor?: string;
    vendor?: string;
  } = {};

  if (isVehicle && 'slug' in item) {
    if ('images' in item && Array.isArray(item.images)) {
      const firstImage = item.images[0];
      imageUrl = typeof firstImage === 'string'
        ? firstImage
        : (firstImage && typeof firstImage === 'object' && 'url' in firstImage)
          ? firstImage.url
          : undefined;
    }
    title =
      'year' in item && 'make' in item && 'model' in item
        ? `${item.year} ${item.make} ${item.model}`
        : 'listingTitle' in item
        ? item.listingTitle || ''
        : '';
    url = `/vehicles/${item.slug}`;
    if ('price' in item && typeof item.price === 'number') {
      price = `$${item.price.toLocaleString()}`;
    } else if ('listingPrice' in item && typeof item.listingPrice === 'number') {
      price = `$${item.listingPrice.toLocaleString()}`;
    } else {
      price = '';
    }
    if ('description' in item && typeof item.description === 'string') {
      description = item.description;
    } else if ('trim' in item && 'transmission' in item) {
      const trim = typeof item.trim === 'string' ? item.trim : '';
      const transmission = typeof item.transmission === 'string' ? item.transmission : '';
      description = `${trim} ${transmission}`.trim();
    } else {
      description = '';
    }
    additionalInfo = {
      mileage: 'mileage' in item && typeof item.mileage === 'number' ? item.mileage : undefined,
      transmission: 'transmission' in item && typeof item.transmission === 'string' ? item.transmission : undefined,
      exteriorColor: 'exteriorColor' in item && typeof item.exteriorColor === 'string' ? item.exteriorColor : undefined,
    };
  } else if ('handle' in item) {
    if ('images' in item && Array.isArray(item.images)) {
      const firstImage = item.images[0];
      imageUrl = firstImage && typeof firstImage === 'object' && 'url' in firstImage ? firstImage.url : undefined;
    }
    title = 'title' in item && typeof item.title === 'string' ? item.title : '';
    url = `/product/${item.handle}`;
    if ('price' in item) {
      if (typeof item.price === 'number') {
        price = `$${item.price.toLocaleString()}`;
      } else {
        price = String(item.price);
      }
    } else {
      price = '';
    }
    description = 'description' in item && typeof item.description === 'string' ? item.description : '';
    additionalInfo = {
      vendor: 'vendor' in item && typeof item.vendor === 'string' ? item.vendor : undefined,
    };
  } else {
    imageUrl = undefined;
    title = '';
    url = '#';
    price = '';
    description = '';
  }

  const snippet = extractSnippet(description, query, 80);
  const highlightedTitle = highlightQueryTerms(title, query);
  const highlightedSnippet = highlightQueryTerms(snippet, query);

  return (
    <Link 
      href={url} 
      className="group block rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-foreground/20 hover:shadow-lg"
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="96px"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isVehicle ? (
                <Car className="w-8 h-8 text-muted-foreground" />
              ) : (
                <Package className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Type Badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn(
              "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
              isVehicle 
                ? "bg-primary/10 text-primary"
                : "bg-accent/10 text-accent"
            )}>
              {isVehicle ? (
                <>
                  <Car className="w-3 h-3" />
                  Vehicle
                </>
              ) : (
                <>
                  <Package className="w-3 h-3" />
                  Part
                </>
              )}
            </span>
            {!isVehicle && additionalInfo.vendor && (
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {additionalInfo.vendor}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            <Highlight text={highlightedTitle} />
          </h3>

          {/* Price or Vehicle Info */}
          <div className="flex items-center gap-2 text-sm">
            {price && (
              <span className="font-bold text-foreground">{price}</span>
            )}
            {isVehicle && additionalInfo.mileage && (
              <>
                {price && <span className="text-muted-foreground">•</span>}
                <span className="text-muted-foreground">
                  {additionalInfo.mileage.toLocaleString()} mi
                </span>
              </>
            )}
          </div>

          {/* Snippet */}
          {snippet && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
              <Highlight text={highlightedSnippet} />
            </p>
          )}
        </div>

        {/* Arrow indicator */}
        <div className="flex items-center self-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}
