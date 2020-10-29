import React, { createContext, useContext, useState } from 'react';
import moment from 'moment';

const FilterContext = createContext({});

const useFilterProvider = () => {
  const [year, setYear] = useState(moment().format('YYYY'));
  const [filterType, setFilterType] = useState('all');
  return { state: { year, filterType }, setYear, setFilterType };
};

export function FilterProvider({ children }) {
  const filters = useFilterProvider();
  return (
    <FilterContext.Provider value={filters}>{children}</FilterContext.Provider>
  );
}

export const useFilter = () => {
  return useContext(FilterContext);
};

export default useFilter;
