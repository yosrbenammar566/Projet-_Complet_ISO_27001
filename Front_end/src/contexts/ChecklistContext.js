import React, { createContext, useState, useEffect } from "react";

export const ChecklistContext = createContext();

export const ChecklistProvider = ({ children }) => {
  const [checklists, setChecklists] = useState([]);
  const [savedChecklists, setSavedChecklists] = useState([]);

  // Load saved checklists from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedChecklists");
    if (saved) {
      setSavedChecklists(JSON.parse(saved));
    }
  }, []);

  // Save checklists to localStorage when savedChecklists changes
  useEffect(() => {
    localStorage.setItem("savedChecklists", JSON.stringify(savedChecklists));
  }, [savedChecklists]);

  const addChecklist = (newChecklist) => {
    setChecklists((prevChecklists) => [...prevChecklists, newChecklist]);
  };

  const updateChecklist = (updatedChecklist) => {
    setChecklists((prevChecklists) =>
      prevChecklists.map((checklist) =>
        checklist.id === updatedChecklist.id ? updatedChecklist : checklist
      )
    );
  };

  const deleteChecklist = (checklistId) => {
    setChecklists((prevChecklists) =>
      prevChecklists.filter((checklist) => checklist.id !== checklistId)
    );
  };

  // Function to save current checklist to savedChecklists with user-defined name
  const saveCurrentChecklist = (checklistName, currentChecklist) => {
    if (!checklistName) {
      checklistName = `Checklist ${new Date().toLocaleString()}`;
    }
    const newSavedChecklist = {
      id: savedChecklists.length + 1,
      name: checklistName,
      items: [...currentChecklist],
      savedAt: new Date().toISOString(),
    };
    setSavedChecklists((prevSaved) => [...prevSaved, newSavedChecklist]);
  };

  return (
    <ChecklistContext.Provider
      value={{
        checklists,
        addChecklist,
        updateChecklist,
        deleteChecklist,
        savedChecklists,
        saveCurrentChecklist,
      }}
    >
      {children}
    </ChecklistContext.Provider>
  );
};
