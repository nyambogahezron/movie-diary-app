import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { MediaEntry, WatchStatus } from '../types';
import { mockGetEntries } from '../utils/mockData';

interface EntryContextProps {
  entries: MediaEntry[];
  watchlist: MediaEntry[];
  recentlyWatched: MediaEntry[];
  addEntry: (entry: MediaEntry) => void;
  updateEntry: (id: string, updatedEntry: Partial<MediaEntry>) => void;
  removeEntry: (id: string) => void;
}

const EntryContext = createContext<EntryContextProps | undefined>(undefined);

export const useEntryContext = () => {
  const context = useContext(EntryContext);
  if (!context) {
    throw new Error('useEntryContext must be used within an EntryProvider');
  }
  return context;
};

interface EntryProviderProps {
  children: ReactNode;
}

export const EntryProvider: React.FC<EntryProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<MediaEntry[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchedEntries = mockGetEntries();
    setEntries(fetchedEntries);
  }, []);

  const watchlist = entries.filter(entry => 
    entry.status === WatchStatus.PLANNING || entry.status === WatchStatus.PAUSED
  );

  const recentlyWatched = entries
    .filter(entry => entry.dateWatched)
    .sort((a, b) => new Date(b.dateWatched!).getTime() - new Date(a.dateWatched!).getTime())
    .slice(0, 6);

  const addEntry = (entry: MediaEntry) => {
    setEntries(prevEntries => [...prevEntries, entry]);
  };

  const updateEntry = (id: string, updatedEntry: Partial<MediaEntry>) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      )
    );
  };

  const removeEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  const value = {
    entries,
    watchlist,
    recentlyWatched,
    addEntry,
    updateEntry,
    removeEntry
  };

  return (
    <EntryContext.Provider value={value}>
      {children}
    </EntryContext.Provider>
  );
};