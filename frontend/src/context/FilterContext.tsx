
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type FilterState = {
  month: string;
  district?: string;
};

type FilterContextType = {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
};

//  1 context create kiya aur export kiya
export const FilterContext = createContext<FilterContextType | undefined>(undefined);

//  2provider export kiya
export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>({ month: '2025-08' });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

// 3 hook export (yahan tumhara missing export define ho raha hai)
export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};