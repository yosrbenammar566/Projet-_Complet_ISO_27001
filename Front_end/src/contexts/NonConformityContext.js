import React, { createContext, useState, useEffect } from 'react';

export const NonConformityContext = createContext();

export function NonConformityProvider({ children }) {
  const [nonConformities, setNonConformities] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/nonconformities')
      .then(res => res.json())
      .then(data => setNonConformities(data))
      .catch(err => console.error(err));
  }, []);

  const addNonConformity = (newNC) => {
    setNonConformities(prev => [...prev, newNC]);
    // ici tu peux aussi faire un POST vers backend si tu veux
  };

  const updateNonConformity = (updatedNC) => {
    setNonConformities(prev => prev.map(nc => nc.id === updatedNC.id ? updatedNC : nc));
  };

  const deleteNonConformity = (id) => {
    setNonConformities(prev => prev.filter(nc => nc.id !== id));
  };

  return (
    <NonConformityContext.Provider value={{ nonConformities, addNonConformity, updateNonConformity, deleteNonConformity }}>
      {children}
    </NonConformityContext.Provider>
  );
}
