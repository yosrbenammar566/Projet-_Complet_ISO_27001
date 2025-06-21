import React, { createContext, useState, useEffect } from "react";

export const PlanActionContext = createContext();

export const PlanActionProvider = ({ children }) => {
  const [actions, setActions] = useState([]);
  const [savedPlans, setSavedPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false); // 🔁 Rafraîchissement

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

  // ✅ Corrigé : plus de setActions ici, juste déclenche le refresh
  const addActionFromNonConformity = async ({
    nonConformity,
    responsible,
    correctionDate,
    recommendation,
    actionTitle = "Action liée à une non-conformité",
    status = "À faire",
    description = "",
    auditType = "",
  }) => {
    try {
      const newAction = {
        action: recommendation || actionTitle,
        description,
        responsible,
        plannedDate: correctionDate || new Date(),
        correctionDate,
        recommendation,
        status,
        auditType,
        nonConformities: [nonConformity],
      };

      const response = await fetch("http://localhost:5000/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAction),
      });

      const saved = await response.json();
      console.log("✅ Action automatiquement générée :", saved);

      // 🧠 Refetch avec populate
      await fetch(`http://localhost:5000/api/actions/${saved._id}`);
      setRefreshFlag((prev) => !prev); // ✅ SEUL déclencheur
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

  const pushActionToFront = (action) => {
    setActions((prev) => [...prev, action]);
  };

  return (
    <PlanActionContext.Provider
      value={{
        actions,
        addAction,
        addActionFromNonConformity,
        pushActionToFront,
        updateAction,
        deleteAction,
        savedPlans,
        saveCurrentPlan,
        currentPlan,
        setCurrentPlan,
        refreshFlag,
      }}
    >
      {children}
    </PlanActionContext.Provider>
  );
};
