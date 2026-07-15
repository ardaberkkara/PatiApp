import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (animalId) => {
    setFavorites(prev => {
      if (prev.includes(animalId)) {
        return prev.filter(id => id !== animalId);
      }
      return [...prev, animalId];
    });
  };

  const isFavorite = (animalId) => favorites.includes(animalId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
