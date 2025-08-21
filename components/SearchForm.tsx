import React from 'react';
import { SearchCriteria } from '../types';
import SearchIcon from './icons/SearchIcon';

interface SearchFormProps {
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  onSearch: () => void;
  isLoading: boolean;
}

const countries = [
    'USA', 'Canada', 'UK', 'Germany', 'France', 'Australia', 'Japan', 'India', 'Singapore', 'China',
    'Brazil', 'Russia', 'South Korea', 'Netherlands', 'Sweden', 'Switzerland', 'Spain', 'Italy', 'Ireland',
    'Israel', 'New Zealand', 'South Africa', 'Mexico', 'Argentina', 'Chile', 'Norway', 'Denmark', 'Finland'
];
const niches = [
    'SaaS for project management', 'AI in healthcare', 'Fintech solutions for small business',
    'E-commerce platforms', 'Cybersecurity services', 'Renewable energy technology',
    'EdTech and online learning', 'Logistics and supply chain optimization', 'Gaming and entertainment',
    'Digital Marketing', 'HR Technology', 'Real Estate Tech (PropTech)', 'Food & Beverage Tech',
    'Travel Technology', 'Biotechnology', 'Agricultural Technology (AgriTech)',
    'Automotive Technology', 'Cloud Computing Services', 'Internet of Things (IoT)',
    'Robotics and Automation', 'Virtual & Augmented Reality', '3D Printing', 'Blockchain Technology'
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 35 }, (_, i) => (currentYear - i).toString());


const SearchForm: React.FC<SearchFormProps> = ({ criteria, setCriteria, onSearch, isLoading }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCriteria(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={criteria.country}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          >
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="niche" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Niche / Industry
          </label>
          <select
            id="niche"
            name="niche"
            value={criteria.niche}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          >
            {niches.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Established Year
          </label>
          <select
            id="year"
            name="year"
            value={criteria.year}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-wait transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <SearchIcon />
              Search
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;