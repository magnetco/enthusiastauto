export type VehicleSelection = {
  model: string;
  year: number;
};

export type FilterState = {
  vendors: string[];
  categories: string[];
  vehicle: VehicleSelection | null;
  searchTerm: string;
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
  setVehicle: (model: string, year: number) => void;
  clearVehicle: () => void;
  setSearchTerm: (term: string) => void;
  clearSearchTerm: () => void;
};
