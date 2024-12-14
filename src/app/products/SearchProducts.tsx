'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import { Search } from 'react-bootstrap-icons'; // Import the Search icon from react-bootstrap-icons

const SearchProducts: React.FC = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const query = searchParams.get('query') ?? ''; // Use nullish coalescing for safer fallback

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    const newSearch = searchQuery ? `?query=${searchQuery}` : ''; // Safely construct query string
    replace(`${window.location.pathname}${newSearch}`); // Update the URL
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  return (
    <form
      className="relative flex items-center w-full max-w-sm"
      onSubmit={handleSubmit}
    >
      <label htmlFor="search" className="sr-only">
        Search products
      </label>
      <input
        id="search"
        className="
          peer
          block
          w-full
          rounded-l-md
          border
          border-gray-200
          py-[9px]
          pl-10
          text-sm outline-2
          placeholder:text-gray-500
        "
        placeholder="Search products"
        value={query}
        onChange={handleSearch}
        aria-label="Search products"
      />
      <button
        type="submit"
        className="absolute right-0 top-1/2 -translate-y-1/2 pr-3"
        aria-label="Search"
      >
        <Search className="text-gray-500 text-xl" />
      </button>
    </form>
  );
};

export default SearchProducts;
