'use client';

import { Fragment, useState, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SearchBar } from './SearchBar';
import { SearchAutocomplete } from './SearchAutocomplete';
import type { SearchResult } from '@/types/search';

export interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchModal({ isOpen, onClose }: MobileSearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setIsAutocompleteOpen(value.length >= 2);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsAutocompleteOpen(false);
      onClose();
    }
  }, [searchQuery, router, onClose]);

  const handleSearchClear = useCallback(() => {
    setSearchQuery('');
    setIsAutocompleteOpen(false);
  }, []);

  const handleAutocompleteSelect = useCallback(
    (result: SearchResult) => {
      setSearchQuery('');
      setIsAutocompleteOpen(false);
      onClose();
    },
    [onClose]
  );

  const handleClose = useCallback(() => {
    setSearchQuery('');
    setIsAutocompleteOpen(false);
    onClose();
  }, [onClose]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        </Transition.Child>

        {/* Full-screen container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="min-h-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full min-h-screen bg-background p-6 text-left transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-semibold">
                    Search
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={handleClose}
                    aria-label="Close search"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <SearchBar
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onSubmit={handleSearchSubmit}
                    onClear={handleSearchClear}
                    autoFocus
                    className="mb-4"
                  />
                  <SearchAutocomplete
                    query={searchQuery}
                    isOpen={isAutocompleteOpen}
                    onClose={() => setIsAutocompleteOpen(false)}
                    onSelect={handleAutocompleteSelect}
                  />
                </div>

                {/* Popular Searches */}
                {!searchQuery && (
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'BMW M3',
                        'E46',
                        'E92',
                        'Performance Parts',
                        'M Parts',
                        'Carbon Fiber',
                      ].map((term) => (
                        <button
                          key={term}
                          className="rounded-full border border-border px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => {
                            setSearchQuery(term);
                            setIsAutocompleteOpen(true);
                          }}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
