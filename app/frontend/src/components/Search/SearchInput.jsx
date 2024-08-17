import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ value, onChange, fetchData }) => {
  return (
    <div className="search-field w-full h-full flex items-center justify-center">
      <input
        className="w-[85%] text-lg h-full outline-none rounded-s-md bg-transparent border-2 border-primary px-3 py-2"
        placeholder="Enter something you want to search"
        type="text"
        value={value}
        onChange={onChange}
      />
      <FaSearch onClick={fetchData} className="w-[15%] h-full p-3 rounded-e-md cursor-pointer text-white bg-primary" />
    </div>
  );
};

export default SearchInput;
