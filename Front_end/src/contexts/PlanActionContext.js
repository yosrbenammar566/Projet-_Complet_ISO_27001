import React, { createContext, useState, useEffect } from "react";

export const PlanActionContext = createContext();

export const PlanActionProvider = ({ children }) => {
  const [actions, setActions] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);

  // Load saved plans from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedPlans");
    if (saved) {
      setSavedPlans(JSON.parse(saved));
    }
  }, []);

  // Save plans to localStorage when savedPlans changes
  useEffect(() => {
    localStorage.setItem("savedPlans", JSON.stringify(savedPlans));
  }, [savedPlans]);

  const addAction = (newAction) => {
    setActions((prevActions) => [...prevActions, newAction]);
  };

  // New function to add action from non-conformity data
const addActionFromNonConformity = async ({
  nonConformity,
  responsible,
  correctionDate,
  recommendation,
  actionTitle = "Action liée à une non-conformité",
  plannedDate = "",
  status = "À faire",
  auditType = "",
}) => {
  try {
    const newAction = {
      action: actionTitle,
      responsible,
      plannedDate: plannedDate || new Date(),
      status,
      auditType,
      nonConformities: [nonConformity], // Lien avec la NC
    };

    const response = await fetch("http://localhost:5000/api/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAction),
    });

  const saved = await response.json();
console.log("✅ Action automatiquement générée :", saved);

// ⚠️ Recharge les données depuis le backend
const all = await fetch("http://localhost:5000/api/actions").then((r) => r.json());
setActions(all);

  } catch (error) {
    console.error("❌ Erreur génération action :", error);
  }
};

  const updateAction = (updatedAction) => {
    setActions((prevActions) =>
      prevActions.map((action) =>
        action.id === updatedAction.id ? updatedAction : action
      )
    );
  };

  const deleteAction = (actionId) => {
    setActions((prevActions) =>
      prevActions.filter((action) => action.id !== actionId)
    );
  };

  // Function to save current plan to savedPlans
  const saveCurrentPlan = (planName) => {
    if (!planName) {
      planName = `Plan d'action ${new Date().toLocaleString()}`;
    }
    const newPlan = {
      id: savedPlans.length + 1,
      name: planName,
      actions: [...actions],
      savedAt: new Date().toISOString(),
    };
    setSavedPlans((prevPlans) => [...prevPlans, newPlan]);
  };

  return (
    <PlanActionContext.Provider
      value={{
        actions,
        addAction,
        addActionFromNonConformity,
        updateAction,
        deleteAction,
        savedPlans,
        saveCurrentPlan,
        currentPlan,
        setCurrentPlan,
      }}
    >
      {children}
    </PlanActionContext.Provider>
  );
};
