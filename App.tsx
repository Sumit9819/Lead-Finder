import React, { useState, useCallback } from 'react';
import { Company, SearchCriteria, SearchHistoryItem, View, Source } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { findCompanies } from './services/geminiService';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import HistoryList from './components/HistoryList';
import Sources from './components/Sources';
import SearchIcon from './components/icons/SearchIcon';
import HistoryIcon from './components/icons/HistoryIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import ChevronLeftIcon from './components/icons/ChevronLeftIcon';
import ResultsDialog from './components/ResultsDialog';

const App: React.FC = () => {
  const [view, setView] = useState<View>('search');
  const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>('company-search-history', []);
  const [currentResults, setCurrentResults] = useState<Company[]>([]);
  const [sources, setSources] = useState<Source[] | null>(null);
  const [currentCriteria, setCurrentCriteria] = useState<SearchCriteria>({
    country: 'USA',
    niche: 'SaaS for project management',
    year: new Date().getFullYear().toString(),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lastSearchCount, setLastSearchCount] = useState(0);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSources(null);
    setCurrentResults([]); // Clear previous results on new search
    try {
      const { results, sources: newSources } = await findCompanies(currentCriteria);
      setCurrentResults(results);
      setSources(newSources);
      setLastSearchCount(results.length);
      setIsDialogOpen(true);
      
      if (results.length > 0) {
        const newHistoryItem: SearchHistoryItem = {
          id: new Date().toISOString(),
          criteria: { ...currentCriteria },
          timestamp: new Date(),
          results: results,
          sources: newSources,
        };
        setHistory(prevHistory => [newHistoryItem, ...prevHistory].slice(0, 50)); // Keep history to 50 items
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCriteria, setHistory]);

  const handleSelectHistory = (id: string) => {
    const selected = history.find(item => item.id === id);
    if (selected) {
      setCurrentCriteria(selected.criteria);
      setCurrentResults(selected.results);
      setSources(selected.sources);
      setError(null);
      setView('search');
    }
  };
  
  const handleDownloadCsv = () => {
    if (currentResults.length === 0) return;

    const headers = ['Company Name', 'Website', 'Mobile Phone', 'Email', 'Location'];
    const csvRows = [
      headers.join(','),
      ...currentResults.map(company =>
        [
          `"${company.companyName.replace(/"/g, '""')}"`,
          `"${company.website.replace(/"/g, '""')}"`,
          `"${company.phone.replace(/"/g, '""')}"`,
          `"${company.email.replace(/"/g, '""')}"`,
          `"${company.location.replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const filename = `${currentCriteria.niche.replace(/\s+/g, '_')}_${currentCriteria.country}_leads.csv`;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const NavButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors duration-200 ${
        active
          ? 'bg-sky-600 text-white shadow-md'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <>
      <div className="flex h-screen font-sans text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900">
        <aside className="w-64 bg-slate-800 text-white p-4 flex flex-col shrink-0">
          <div className="text-2xl font-bold text-white mb-10 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Company Finder</span>
          </div>
          <nav className="flex flex-col space-y-2">
            <NavButton active={view === 'search'} onClick={() => setView('search')}>
              <SearchIcon />
              <span>Search</span>
            </NavButton>
            <NavButton active={view === 'history'} onClick={() => setView('history')}>
              <HistoryIcon />
              <span>History</span>
            </NavButton>
          </nav>
          <div className="mt-auto text-xs text-slate-400">
            <p>Powered by Gemini AI</p>
            <p>&copy; {new Date().getFullYear()}</p>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          {view === 'search' && (
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Find Companies & Generate Leads</h1>
              <SearchForm
                criteria={currentCriteria}
                setCriteria={setCurrentCriteria}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Results</h2>
                  <button
                    onClick={handleDownloadCsv}
                    disabled={currentResults.length === 0 || isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <DownloadIcon />
                    <span>Download CSV</span>
                  </button>
                </div>
                {error ? (
                <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 rounded-md">
                  <p className="font-bold">An error occurred</p>
                  <p className="whitespace-pre-wrap">{error}</p>
                </div>
              ) : (
                <ResultsTable companies={currentResults} isLoading={isLoading} />
              )}
              </div>
              <Sources sources={sources} />
            </div>
          )}

          {view === 'history' && (
            <div>
              <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => setView('search')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <ChevronLeftIcon />
                  </button>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Search History</h1>
              </div>
              <HistoryList history={history} onSelect={handleSelectHistory} />
            </div>
          )}
        </main>
      </div>
      <ResultsDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        resultsCount={lastSearchCount}
        criteria={currentCriteria}
      />
    </>
  );
};

export default App;