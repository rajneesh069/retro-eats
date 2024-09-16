'use client'
import React, { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filters: { country: string; cost: number; cuisine: string }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [country, setCountry] = useState<string>('');
  const [cost, setCost] = useState<number>(100);
  const [cuisine, setCuisine] = useState<string>('');

  const handleFilterChange = () => {
    onFilterChange({ country, cost, cuisine });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            onBlur={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Country</option>
            {/* Add more country options here */}
            <option value="1">India</option>
            <option value="14">Australia</option>
            <option value="216">United States</option>
            <option value="94">Indonesia</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">Average Cost for Two</label>
          <input
            type="range"
            min="100"
            max="10000"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            onBlur={handleFilterChange}
            className="w-full"
          />
          <div className="text-gray-700 text-right">${cost}</div>
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">Cuisine</label>
          <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            onBlur={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Enter cuisine"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
