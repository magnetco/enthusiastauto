'use client';

import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search vehicles and parts...',
  isLoading = false,
  className = '',
  autoFocus = false,
}: SearchBarProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClear();
      }
    },
    [onSubmit, onClear]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search vehicles and parts"
          aria-describedby="search-description"
          className="h-10 w-full pl-10 pr-10"
          autoComplete="off"
          role="searchbox"
        />
        {isLoading && (
          <Loader2
            className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-label="Loading suggestions"
          />
        )}
        {value && !isLoading && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <span id="search-description" className="sr-only">
        Search for BMW vehicles and parts. Press Enter to search, Escape to
        clear.
      </span>
    </div>
  );
}
