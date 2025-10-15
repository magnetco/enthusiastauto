export type FilterState = {
  vendors: string[];
  categories: string[];
};

export type FilterOption = {
  value: string;
  label: string;
  count: number;
};

export type FilterContextType = {
  filters: FilterState;
  updateFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  toggleVendor: (vendor: string) => void;
  toggleCategory: (category: string) => void;
};
