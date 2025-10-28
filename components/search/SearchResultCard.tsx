'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Car, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Highlight } from './Highlight';
import { highlightQueryTerms, extractSnippet } from '@/lib/search/highlight';
import type { SearchResult } from '@/types/search';

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
  } else {
    imageUrl = undefined;
    title = '';
    url = '#';
    price = '';
    description = '';
  }

  const snippet = extractSnippet(description, query, 120);

  // Highlight query terms in title and snippet
  const highlightedTitle = highlightQueryTerms(title, query);
  const highlightedSnippet = highlightQueryTerms(snippet, query);

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <Link href={url} className="block">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Thumbnail */}
            {imageUrl && (
              <div className="relative h-[150px] w-[150px] flex-shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  sizes="150px"
                  loading="lazy"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Type Badge */}
              <div className="flex items-center gap-2 mb-2">
                {isVehicle ? (
                  <Car className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Package
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  {isVehicle ? 'Vehicle' : 'Part'}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                <Highlight text={highlightedTitle} />
              </h3>

              {/* Price */}
              <p className="text-xl font-bold text-foreground mb-2">{price}</p>

              {/* Snippet */}
              {snippet && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  <Highlight text={highlightedSnippet} />
                </p>
              )}

              {/* Additional Info for Vehicles */}
              {isVehicle && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {additionalInfo.mileage && (
                    <span>{additionalInfo.mileage.toLocaleString()} miles</span>
                  )}
                  {additionalInfo.transmission && (
                    <>
                      <span>•</span>
                      <span>{additionalInfo.transmission}</span>
                    </>
                  )}
                  {additionalInfo.exteriorColor && (
                    <>
                      <span>•</span>
                      <span>{additionalInfo.exteriorColor}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
