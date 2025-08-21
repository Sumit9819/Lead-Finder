import React from 'react';
import { Source } from '../types';

interface SourcesProps {
  sources: Source[] | null;
}

const Sources: React.FC<SourcesProps> = ({ sources }) => {
  const validSources = sources?.filter(s => s.web?.uri && s.web?.title);

  if (!validSources || validSources.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Data Sources</h3>
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
        <ul className="space-y-2">
          {validSources.map((source, index) => (
            <li key={index} className="flex items-start gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-1 text-sky-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              <a
                href={source.web!.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 dark:text-sky-400 hover:underline text-sm break-all"
              >
                {source.web!.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sources;
