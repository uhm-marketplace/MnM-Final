'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const SearchProducts: React.FC = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [query, setQuery] = useState(searchParams.get('query') ?? ''); // Manage query state

  // Handle input change directly without debounce for faster response
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery); // Update the query
    const newSearch = searchQuery ? `?query=${searchQuery}` : '';
    replace(`${window.location.pathname}${newSearch}`);
  };

  // Ensure that searchParams updates in real-time if query changes in the URL
  useEffect(() => {
    const currentQuery = searchParams.get('query') ?? '';
    setQuery(currentQuery);
  }, [searchParams]);

  return (
    <div className="min-h-screen px-4 flex items-center justify-start">
      <form
        className="relative flex items-center w-full max-w-2xl lg:max-w-xl mt-6"
        onSubmit={(e) => e.preventDefault()} // Prevent form submission
      >
        <input
          id="search"
          className="
            peer
            block
            w-full
            max-w-2xl
            rounded-full
            border
            border-gray-300
            pl-10
            pr-1
            py-2
            text-sm
            outline-none
            placeholder:text-gray-500
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            shadow-md
            transition-all
            duration-200
            ease-in-out
            ml-16
          "
          value={query}
          onChange={handleSearch} // Directly update the query
          aria-label="Search products"
        />
      </form>
    </div>
  );
};

export default SearchProducts;
