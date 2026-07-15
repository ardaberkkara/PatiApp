import React, { createContext, useContext, useState } from 'react';
import { animals as initialAnimals } from '../data/mockData';

const AnimalContext = createContext();

export function AnimalProvider({ children }) {
  const [animals, setAnimals] = useState(initialAnimals);

  const addAnimal = (animal) => {
    const newAnimal = {
      id: Date.now().toString(),
      ...animal,
      postedAt: 'Az önce',
    };
    setAnimals(prev => [newAnimal, ...prev]);
    return newAnimal;
  };

  const getAdoptionAnimals = () => animals.filter(a => a.status === 'adoption');
  const getMyAnimals = () => animals.filter(a => a.status === 'myPet' || a.owner === 'me');

  return (
    <AnimalContext.Provider value={{ animals, addAnimal, getAdoptionAnimals, getMyAnimals }}>
      {children}
    </AnimalContext.Provider>
  );
}

export function useAnimals() {
  const context = useContext(AnimalContext);
  if (!context) {
    throw new Error('useAnimals must be used within an AnimalProvider');
  }
  return context;
}
