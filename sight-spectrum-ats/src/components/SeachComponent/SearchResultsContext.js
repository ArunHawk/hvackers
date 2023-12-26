// SearchResultsContext.js
import React, { createContext, useContext, useState } from 'react';

const SearchResultsContext = createContext();

export const useSearchResults = () => {
  return useContext(SearchResultsContext); 
};

export const SearchResultsProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <SearchResultsContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchResultsContext.Provider>
  );
};
