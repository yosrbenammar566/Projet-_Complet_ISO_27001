import React, { useContext, useState } from "react";
import { FaEdit, FaTimes, FaInfoCircle } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { PlanActionContext } from "../../contexts/PlanActionContext";
import EditActionModal from "../Models/EditActionModal";
import AddActionModal from "../Models/AddActionModal";
const sampleActions = [
  {
    id: 1,
    action: "Mettre à jour la documentation",
    responsible: "Alice Dupont",
    plannedDate: "2024-05-10",
    status: "En cours",
  },
  {
    id: 2,
    action: "Former l'équipe sur la nouvelle procédure",
    responsible: "Bob Martin",
    plannedDate: "2024-05-15",
    status: "À faire",
  },
  {
    id: 3,
    action: "Vérifier la conformité des équipements",
    responsible: "Claire Bernard",
    plannedDate: "2024-05-20",
    status: "Terminé",
  },
];

// Fonction pour obtenir la couleur du statut
const getStatusColor = (status) => {
  switch (status) {
    case "Terminé":
      return "bg-emerald-200 text-emerald-700";
    case "En cours":
      return "bg-orange-200 text-orange-700";
    case "À faire":
      return "bg-red-200 text-red-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const statusOptions = ["En cours", "Terminé", "En attente", "À faire"];

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

export default function PlanActionTable({
  actions: propActions,
  addAction: propAddAction,
  updateAction: propUpdateAction,
  deleteAction: propDeleteAction,
  saveCurrentPlan: propSaveCurrentPlan,
}) {
  // Utiliser le contexte correctement
  const {
    actions: contextActions,
    addAction: contextAddAction,
    updateAction: contextUpdateAction,
    deleteAction: contextDeleteAction,
    saveCurrentPlan: contextSaveCurrentPlan,
  } = useContext(PlanActionContext);
  const { refreshFlag } = useContext(PlanActionContext);

  // Actions récupérées depuis le backend
  const [fetchedActions, setFetchedActions] = useState([]);
  const [availableNonConformities, setAvailableNonConformities] = useState([]);

  React.useEffect(() => {
    fetch("http://localhost:5000/api/nonconformities")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Non-conformités FETCHED:", data);
        setAvailableNonConformities(data);
      })
      .catch((err) =>
        console.error("Erreur chargement non-conformités :", err)
      );
  }, []);

  React.useEffect(() => {
    fetch("http://localhost:5000/api/actions")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Actions FETCHED:", data);
        setFetchedActions(data);
        console.log("✅ Actions rechargées :", data);
      })
      .catch((err) => console.error("Erreur chargement actions :", err));
  }, [refreshFlag]); // 👈 le tableau de dépendance contient refreshFlag

  const addAction = propAddAction || contextAddAction;
  const updateAction = propUpdateAction || contextUpdateAction;
  const deleteAction = propDeleteAction || contextDeleteAction;
  const saveCurrentPlan = propSaveCurrentPlan || contextSaveCurrentPlan;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [planName, setPlanName] = useState("");

  // New state for details modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedActionForDetails, setSelectedActionForDetails] =
    useState(null);

  // Form state for add/edit
  const initialFormState = {
    titre: "",
    description: "",
    responsible: "",
    startDate: "",
    dueDate: "",
    status: "En cours",
    proof: "",
    nonConformities: [],
    recommendation: "",
    correctionDate: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const openAddModal = () => {
    setFormData(initialFormState);
    setShowAddModal(true);
  };

  const openAddModalWithNonConformity = (nonConformity) => {
    setFormData({
      ...initialFormState,
      nonConformities: [nonConformity],
    });
    setShowAddModal(true);
  };
  const renderNonConformitiesNames = (items) => {
    if (!items || items.length === 0) return "-";
    return items.map((item) => item?.title || item?.name || "NC").join(", ");
  };
  const openEditModal = (action) => {
    setCurrentAction(action);
    setFormData({
      titre: action.action || "",
      description: action.nonConformities?.[0]?.description || "",

      responsible: action.responsible || "",
      startDate: action.startDate || "",
      dueDate: action.plannedDate || "",
      status: action.status || "En cours",
      proof: action.proof || "",
      nonConformities: action.nonConformities || [],
      recommendation: action.recommendation || "",
      correctionDate: action.correctionDate
        ? new Date(action.correctionDate).toISOString().split("T")[0]
        : "", // pour input type="date"
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setCurrentAction(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "proof" && files.length > 0) {
      setFormData({ ...formData, proof: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newAction = {
      action: formData.titre,
      description: formData.description,
      responsible: formData.responsible,
      startDate: formData.startDate,
      plannedDate: formData.dueDate,
      status: formData.status,
      proof: formData.proof,
      nonConformities: formData.nonConformities.map((nc) => nc._id || nc),
      recommendation: formData.recommendation,
      correctionDate: formData.correctionDate,
    };

    fetch("http://localhost:5000/api/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAction),
    })
      .then((res) => res.json())
      .then(() => {
        // ✅ Refetch actions avec populate
        fetch("http://localhost:5000/api/actions")
          .then((res) => res.json())
          .then((data) => {
            setFetchedActions(data);
            closeModals();
          });
      })
      .catch((err) => console.error("Erreur ajout :", err));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const updatedAction = {
      action: formData.titre,
      description: formData.description,
      responsible: formData.responsible,
      startDate: formData.startDate,
      plannedDate: formData.dueDate,
      correctionDate: formData.correctionDate,
      recommendation: formData.recommendation,
      status: formData.status,
      proof: formData.proof,
      nonConformities: formData.nonConformities.map((nc) => nc._id || nc),
    };

    const actionId = currentAction._id || currentAction.id;

    fetch(`http://localhost:5000/api/actions/${actionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAction),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur backend");
        return res.json();
      })
      .then((data) => {
        setFetchedActions((prev) =>
          prev.map((a) => (a._id === actionId ? data : a))
        );
        updateAction(data); // pour le contexte
        closeModals();
      })
      .catch((err) => {
        console.error("❌ Erreur modification :", err);
        alert("❌ Échec de la modification !");
      });
  };

  const handleDelete = (action) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette action ?")) {
      const idToDelete = action._id || action.id;

      fetch(`http://localhost:5000/api/actions/${idToDelete}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Erreur serveur");

          // 🔁 Refetch complet après suppression
          fetch("http://localhost:5000/api/actions")
            .then((res) => res.json())
            .then((data) => {
              setFetchedActions(data); // 🔄 Rafraîchir tableau
            });

          // ✅ Supprime côté contexte
          deleteAction(idToDelete);
        })
        .catch((err) => {
          console.error("Erreur suppression :", err);
          alert("Échec de suppression !");
        });
    }
  };

  // Handler to open details modal
  const openDetailsModal = (action) => {
    setSelectedActionForDetails(action);
    setShowDetailsModal(true);
  };

  // Handler to close details modal
  const closeDetailsModal = () => {
    setSelectedActionForDetails(null);
    setShowDetailsModal(false);
  };

  // Details modal component
  function DetailsModal() {
    if (!showDetailsModal || !selectedActionForDetails) return null;

    const action = selectedActionForDetails;

    return (
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Détails de l'action
            </h3>
            <button
              onClick={closeDetailsModal}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Close details modal"
            >
              <FaTimes className="h-7 w-7" />
            </button>
          </div>

          <div className="space-y-4 text-sm text-gray-800">
            <p>
              <strong>Nom de l'action :</strong> {action.action}
            </p>
            <p>
              <strong>Description :</strong>
              {action.nonConformities?.[0]?.description?.trim()
                ? action.nonConformities[0].description
                : "Non renseignée"}
            </p>

            <p>
              <strong>Recommandation :</strong>{" "}
              {action.recommendation || "Non spécifiée"}
            </p>
            <p>
              <strong>Date de correction :</strong>{" "}
              {action.correctionDate
                ? new Date(action.correctionDate).toLocaleDateString("fr-FR")
                : "Non précisée"}
            </p>
            <p>
              <strong>Responsable :</strong> {action.responsible}
            </p>
            <p>
              <strong>Statut :</strong> {action.status}
            </p>

            {action.nonConformities?.length > 0 && (
              <div>
                <strong>Non-conformité liée :</strong>
                <ul className="list-disc ml-5 mt-1">
                  {action.nonConformities.map((nc) => (
                    <li key={nc._id}>{nc.title}</li>
                  ))}
                
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white green-glow-container">
      {/* En-tête */}
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-lg text-blueGray-700 slide-in-title">
              Plan d'action
            </h3>
          </div>
          {/* Bouton d'ajout */}
          {/* <div className="text-right w-full px-4 max-w-full flex-grow flex-1">
            <button
              className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded"
              onClick={openAddModal}
            >
              Ajouter une action
            </button>
          </div> */}
        </div>
      </div>

      {/* Corps du tableau */}
      <div className="block w-full overflow-x-auto">
        {[...fetchedActions, ...contextActions].length === 0 ? (
          <div className="text-center py-4 text-blueGray-500">
            Aucun plan d'action disponible
          </div>
        ) : (
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Non conformités
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Recommandation
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Date de correction
                </th>

                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Action à faire
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Responsable
                </th>
                {/* Removed Date prévue column as per user request */}
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Statut
                </th>

                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {[...fetchedActions, ...contextActions].map(
                (action, indexAction) => {
                  console.log(
                    `Action ${indexAction} nonConformities:`,
                    action.nonConformities
                  );

                  return (
                    <tr
                      key={`action-${action._id || action.id || indexAction}`}
                      className="hover:bg-blueGray-50"
                    >
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-normal p-4">
                        {action.nonConformities &&
                        action.nonConformities.length > 0 ? (
                          <ul className="space-y-1 text-blue-700 font-medium">
                            {action.nonConformities.map((nc, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span>{nc.title}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-red-500">Aucune NC</span>
                        )}
                      </td>

                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {action.recommendation ? action.recommendation : "-"}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {action.correctionDate
                          ? new Date(action.correctionDate).toLocaleDateString(
                              "fr-FR"
                            )
                          : "-"}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {action.action}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {action.responsible}
                      </td>

                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <span
                          className={`px-2 py-1 rounded-full font-bold ${getStatusColor(
                            action.status
                          )}`}
                        >
                          {action.status}
                        </span>
                      </td>

                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex items-center space-x-2">
                          <button
                        onClick={() => openDetailsModal(action)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Détails"
                      >
                        <FaInfoCircle className="text-lg" />
                      </button>
                      <button
                        onClick={() => openEditModal(action)}
                        className="text-emerald-600 hover:text-emerald-800 p-2"
                        title="Modifier"
                      >
                        <FaEdit className="text-lg text-emerald-500 hover:text-emerald-700" />
                      </button>
                      <button
                        onClick={openAddModal}
                        className="text-pink-600 hover:text-pink-800 p-2 font-bold"
                        title="Ajouter une action"
                      >
                        <IoMdAdd className="text-2xl text-lightBlue-600 hover:text-lightBlue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(action)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Supprimer"
                      >
                        <RiDeleteBin5Fill className="text-lg text-red-500 hover:text-red-700" />
                      </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Save Plan d'action Button */}
      <div className="px-6 py-6 border-t border-blueGray-100 bg-blueGray-50 flex justify-center">
        <button
          onClick={() => {
            setShowSaveModal(true);
          }}
          className="welcome-button welcome-button-primary mr-1 mb-1 slide-in-title"
          style={{ minWidth: "250px", fontSize: "1.1rem" }}
        >
          Sauvegarder le plan d'action
        </button>
      </div>

      <AddActionModal
        show={showAddModal}
        onClose={closeModals}
        onSubmit={handleAddSubmit}
        formData={formData}
        onChange={handleInputChange}
        statusOptions={statusOptions}
      />

      <EditActionModal
        show={showEditModal}
        onClose={closeModals}
        onSubmit={handleEditSubmit}
        formData={formData}
        onChange={handleInputChange}
        statusOptions={statusOptions}
      />
      <DetailsModal />

      {showSaveModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 className="text-lg font-semibold mb-4">Nom du plan d'action</h3>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Entrez le nom du plan d'action"
              className="w-full border border-gray-300 rounded-lg py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setPlanName("");
                }}
                className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  saveCurrentPlan(planName);
                  setShowSaveModal(false);
                  setPlanName("");
                  alert("Plan d'action sauvegardé avec succès.");
                }}
                className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}
