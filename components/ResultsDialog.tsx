import React from 'react';
import { SearchCriteria } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface ResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resultsCount: number;
  criteria: SearchCriteria;
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({ isOpen, onClose, resultsCount, criteria }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center transition-opacity duration-300" 
      aria-modal="true" 
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 m-4 max-w-sm w-full text-center transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up" 
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50">
          <CheckCircleIcon />
        </div>
        <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mt-4">Search Complete</h3>
        <div className="mt-2 px-4 py-2">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Found <strong>{resultsCount}</strong> companies for "<strong>{criteria.niche}</strong>" in <strong>{criteria.country}</strong>.
          </p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 sm:text-sm transition-colors"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ResultsDialog;
