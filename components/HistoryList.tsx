
import React from 'react';
import { SearchHistoryItem } from '../types';

interface HistoryListProps {
  history: SearchHistoryItem[];
  onSelect: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No Search History</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your past searches will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="w-full text-left p-5 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg hover:ring-2 hover:ring-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-lg text-sky-600 dark:text-sky-400">{item.criteria.niche}</p>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                <span><strong>Country:</strong> {item.criteria.country}</span>
                <span><strong>Year:</strong> {item.criteria.year}</span>
                <span><strong>Results:</strong> {item.results.length}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 ml-4">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default HistoryList;
