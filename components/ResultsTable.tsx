
import React from 'react';
import { Company } from '../types';

interface ResultsTableProps {
  companies: Company[];
  isLoading: boolean;
}

const SkeletonRow: React.FC = () => (
    <tr className="animate-pulse">
        <td className="px-5 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div></td>
        <td className="px-5 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div></td>
        <td className="px-5 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div></td>
        <td className="px-5 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div></td>
        <td className="px-5 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div></td>
    </tr>
)

const ResultsTable: React.FC<ResultsTableProps> = ({ companies, isLoading }) => {
  if (isLoading) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-700">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Company Name</th>
                            <th className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Website</th>
                            <th className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Phone</th>
                            <th className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 10 }).map((_, index) => <SkeletonRow key={index} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No Results Found</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your criteria above and click search to find companies.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-700">
                    <tr>
                        <th scope="col" className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Company Name</th>
                        <th scope="col" className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Website</th>
                        <th scope="col" className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Location</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {companies.map((company, index) => (
                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">{company.companyName}</td>
                            <td className="px-5 py-4 whitespace-nowrap">
                                <a href={`//${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline">
                                    {company.website}
                                </a>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{company.phone}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{company.email}</td>
                            <td className="px-5 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{company.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ResultsTable;
