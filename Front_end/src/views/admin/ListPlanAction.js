import React, { useState, useContext } from "react";
import { FaEdit, FaInfoCircle } from "react-icons/fa";
import { PlanActionContext } from "../../contexts/PlanActionContext";

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  animation: "fadeIn 0.3s ease-in-out",
};

const modalContentStyle = {
  backgroundColor: "#f9fafb",
  borderRadius: "1rem",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  maxWidth: "40rem",
  width: "100%",
  padding: "2rem",
  overflow: "auto",
  maxHeight: "80vh",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

export default function ListPlanAction() {
  const { savedPlans } = useContext(PlanActionContext);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editAction, setEditAction] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailPlan, setDetailPlan] = useState(null);
  const [detailAction, setDetailAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  

  const handleEditClick = (action) => {
    setEditAction({ ...action });
    setIsEditing(true);
  };

  <h3 className="text-xl font-semibold mb-4">Liste des Plans d'action</h3>;
  {
    !selectedPlan && (
      <>
        <input
          type="text"
          placeholder="Rechercher par nom de plan d'action"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ul className="list-disc pl-5 mb-4 max-h-96 overflow-auto">
          {savedPlans
            .filter((plan) =>
              plan.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((plan) => (
              <li
                key={plan.id}
                className="flex items-center justify-between mb-1"
              >
                <span
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handlePlanClick(plan)}
                >
                  {plan.name}
                </span>
                <button
                  onClick={() => openDetailModal(plan)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Détails"
                >
                  <FaInfoCircle />
                </button>
              </li>
            ))}
        </ul>
      </>
    );
  }

  <h3 className="text-xl font-semibold mb-4">Liste des Plans d'action</h3>;
  {
    !selectedPlan && (
      <ul className="list-disc pl-5 mb-4">
        {savedPlans.map((plan) => (
          <li key={plan.id} className="flex items-center justify-between mb-1">
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => handlePlanClick(plan)}
            >
              {plan.name}
            </span>
            <button
              onClick={() => openDetailModal(plan)}
              className="text-blue-600 hover:text-blue-800"
              title="Détails"
            >
              <FaInfoCircle />
            </button>
          </li>
        ))}
      </ul>
    );
  }

  <h3 className="text-xl font-semibold mb-4">Liste des Plans d'action</h3>;
  {
    !selectedPlan && (
      <>
        <input
          type="text"
          placeholder="Rechercher par nom de plan d'action"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ul className="list-disc pl-5 mb-4 max-h-96 overflow-auto">
          {savedPlans
            .filter((plan) =>
              plan.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((plan) => (
              <li
                key={plan.id}
                className="flex items-center justify-between mb-1"
              >
                <span
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handlePlanClick(plan)}
                >
                  {plan.name}
                </span>
                <button
                  onClick={() => openDetailModal(plan)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Détails"
                >
                  <FaInfoCircle />
                </button>
              </li>
            ))}
        </ul>
      </>
    );
  }

  const handleEditChange = (field, value) => {
    setEditAction({ ...editAction, [field]: value });
  };

  const handleSaveEdit = () => {
    if (!selectedPlan) return;
    const updatedActions = selectedPlan.actions.map((action) =>
      action.id === editAction.id ? editAction : action
    );
    const updatedPlan = { ...selectedPlan, actions: updatedActions };

    const updatedPlans = savedPlans.map((plan) =>
      plan.id === updatedPlan.id ? updatedPlan : plan
    );
    localStorage.setItem("savedPlans", JSON.stringify(updatedPlans));
    // Ideally update context or reload to reflect changes
    setIsEditing(false);
    setEditAction(null);
    setSelectedPlan(updatedPlan);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditAction(null);
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
  };

  const openActionDetailModal = (action) => {
    setDetailAction(action);
    setShowDetailModal(true);
  };

  const closeActionDetailModal = () => {
    setDetailAction(null);
    setShowDetailModal(false);
  };

  const openDetailModal = (plan) => {
    setDetailPlan(plan);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setDetailPlan(null);
  };

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded p-4">
            <h3 className="text-xl font-semibold mb-4">
              Liste des Plans d'action
            </h3>
            {!selectedPlan && (
              <>
                <input
                  type="text"
                  placeholder="Rechercher par nom de plan d'action"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ul className="list-disc pl-5 mb-4 max-h-96 overflow-auto">
                  {savedPlans
                    .filter((plan) =>
                      plan.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((plan) => (
                      <li
                        key={plan.id}
                        className="flex items-center justify-between mb-1"
                      >
                        <span
                          className="cursor-pointer text-blue-600 hover:underline"
                          onClick={() => handlePlanClick(plan)}
                        >
                          {plan.name}
                        </span>
                        <button
                          onClick={() => openDetailModal(plan)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Détails"
                        >
                          <FaInfoCircle />
                        </button>
                      </li>
                    ))}
                </ul>
              </>
            )}

            {selectedPlan && (
              <>
                <button
                  className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={handleBackToList}
                >
                  Retour à la liste
                </button>

                <table className="min-w-full table-auto border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Action
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Responsable
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Statut
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Description
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Date prévue
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPlan.actions.map((action) => (
                      <tr key={action.id} className="border border-gray-300">
                        <td className="border border-gray-300 px-4 py-2">
                          {action.action}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {action.responsible}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {action.status}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {action.description}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {action.plannedDate || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            className="text-emerald-600 hover:text-emerald-800 mr-4"
                            onClick={() => handleEditClick(action)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {isEditing && editAction && (
              <div style={modalOverlayStyle}>
                <div style={modalContentStyle}>
                  <h4 className="text-xl font-semibold mb-4">
                    Modifier l'action: {editAction.action}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Statut
                      </label>
                      <select
                        className="border-0 px-2 py-1 text-sm rounded focus:outline-none focus:ring"
                        value={editAction.status}
                        onChange={(e) =>
                          handleEditChange("status", e.target.value)
                        }
                      >
                        <option value="En cours">En cours</option>
                        <option value="Terminé">Terminé</option>
                        <option value="À faire">À faire</option>
                        <option value="En attente">En attente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Description
                      </label>
                      <textarea
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        value={editAction.description || ""}
                        onChange={(e) =>
                          handleEditChange("description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-4">
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      onClick={handleCancelEdit}
                    >
                      Annuler
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={handleSaveEdit}
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showDetailModal && detailPlan && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                onClick={closeDetailModal}
              >
                <div
                  className="bg-white rounded-lg p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Détails du plan
                  </h3>
                  <p>
                    <strong>Nom:</strong> {detailPlan.name}
                  </p>
                  <p>
                    <strong>Nombre d'actions:</strong>{" "}
                    {detailPlan.actions.length}
                  </p>
                  <button
                    className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    onClick={closeDetailModal}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
