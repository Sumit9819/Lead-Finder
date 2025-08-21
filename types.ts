export interface Company {
  companyName: string;
  website: string;
  phone: string;
  email: string;
  location: string;
}

export interface SearchCriteria {
  country: string;
  niche: string;
  year: string;
}

export interface Source {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface SearchHistoryItem {
  id: string;
  criteria: SearchCriteria;
  timestamp: Date;
  results: Company[];
  sources: Source[] | null;
}

export type View = 'search' | 'history';