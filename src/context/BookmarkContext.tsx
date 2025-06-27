import React, { createContext, useContext, useState, ReactNode } from 'react';

// Now represents a bookmarked package
export type BookmarkedPackage = {
  id: string;
  title: string;
  price: string;
  features?: string[];
  rating?: number;
  reviewCount?: string;
  duration?: string;
  oldPrice?: string;
  serviceName?: string;
  serviceId?: string; // for navigation
};

type BookmarkContextType = {
  bookmarks: BookmarkedPackage[];
  addBookmark: (pkg: BookmarkedPackage) => void;
  removeBookmark: (id: string) => void;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkedPackage[]>([]);

  const addBookmark = (pkg: BookmarkedPackage) => {
    setBookmarks((prev) =>
      prev.find((b) => b.id === pkg.id) ? prev : [...prev, pkg]
    );
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used within BookmarkProvider');
  return context;
}; 