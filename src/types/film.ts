
export interface Film {
  id: string;
  title: string;
  director: string;
  idNumber: string;
  image?: string;
  year?: string;
  genre?: string[];
  actors?: string[];
  tags?: string[];
  producer?: string;
  createdAt: number;
}

export interface SearchHistory {
  id: string;
  term: string;
  timestamp: number;
  resultCount: number;
}

export type SortOption = 
  | "title" 
  | "director" 
  | "year" 
  | "idNumber";

export type FilterOption = 
  | "all"
  | "director" 
  | "actor" 
  | "producer" 
  | "idNumber" 
  | "genre" 
  | "year" 
  | "tags";
