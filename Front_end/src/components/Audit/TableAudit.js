import React, { useState, useEffect } from "react";
import { FaEdit, FaSearch, FaInfoCircle} from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/modal.css";
import EditModel from "../Models/EditModel";

const API_BASE_URL = "http://localhost:5000/api"; // 🔁 À adapter selon ton backend

export default function TableAudit({ refreshTrigger }) {
  const auditTypes = [
    { id: "Audit interne", label: "Audit interne" },
    { id: "Audit de certification", label: "Audit de certification" },
    { id: "Audit de surveillance", label: "Audit de surveillance" },
    { id: "Audit de tierce partie", label: "Audit de tierce partie" },
  ];

  const [selectedAuditType, setSelectedAuditType] = useState(auditTypes[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [editingEcartId, setEditingEcartId] = useState(null);
  const [editedEcartValue, setEditedEcartValue] = useState("");

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    department: "",
    auditor: "",
    category: " ",
    startDate: "",
    endDate: "",
    methodology: "",
    participants: "",
    scope: "",
    objectives: "",
    status: "",
    valeurAttendue: "",
    valeurConstatee: "",
    ecartPercentage: "",
  });

  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/audits`);
      setAudits(response.data);
    } catch (error) {
      console.error("Erreur API:", error);
      setError("Erreur lors de la récupération des audits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  useEffect(() => {
    const handleAuditAdded = () => {
      fetchAudits();
    };

    window.addEventListener("auditAdded", handleAuditAdded);

    return () => {
      window.removeEventListener("auditAdded", handleAuditAdded);
    };
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      fetchAudits();

      // 🔒 Ajout : évite le re-render à chaque frappe
      setTimeout(() => {
        const event = new CustomEvent("resetTrigger");
        window.dispatchEvent(event);
      }, 200);
    }
  }, [refreshTrigger]);

  const filteredAudits = audits.filter(
    (audit) =>
      audit.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      audit.type === selectedAuditType
  );

  const handleAuditTypeChange = (e) => setSelectedAuditType(e.target.value);

  const getStatusColor = (status) => {
    switch (status) {
      case "Terminé":
        return "bg-emerald-200 text-emerald-700";
      case "En cours":
        return "bg-orange-200 text-orange-700";
      default:
        return "bg-red-200 text-red-700";
    }
  };

  const getEcartColor = (percentage) => {
    if (percentage === null) return "text-gray-500";
    if (percentage <= 5) return "text-emerald-500";
    if (percentage <= 15) return "text-orange-500";
    return "text-red-500";
  };

  const renderEcart = (audit) => {
    console.log("🟢 audit dans renderEcart:", audit);
    if (!audit.ecartPercentage) return "-";

    if (editingEcartId === audit._id) {
      return (
        <div className="flex items-center">
          <input
            type="number"
            min="0"
            max="100"
            value={editedEcartValue}
            onChange={(e) => setEditedEcartValue(e.target.value)}
            className="w-16 border border-gray-300 rounded px-1 py-0.5 text-sm"
          />
          <button
            onClick={() => handleSaveEcart(audit._id)}
            className="ml-2 text-blue-500 hover:text-blue-700"
            title="Enregistrer"
          >
            💾
          </button>
        </div>
      );
    }

    return (
      <div
        className={`cursor-pointer ${getEcartColor(audit.ecartPercentage)}`}
        onClick={() => {
          setEditingEcartId(audit._id);
          setEditedEcartValue(audit.ecartPercentage || "");
        }}
        title="Cliquer pour modifier"
      >
        {audit.ecartPercentage !== null && audit.ecartPercentage !== undefined
          ? `${audit.ecartPercentage}%`
          : "-"}
      </div>
    );
  };

  const handleEdit = (audit) => {
    const clonedAudit = { ...audit };

    setEditFormData({
      name: clonedAudit.name || "",
      description: clonedAudit.description || "",
      department: clonedAudit.department || "",
      auditor: clonedAudit.auditor || "",
      category: clonedAudit.category || "",
      startDate: clonedAudit.startDate || "",
      endDate: clonedAudit.endDate || "",
      methodology: clonedAudit.methodology || "",
      participants: clonedAudit.participants || "",
      scope: clonedAudit.scope || "",
      objectives: clonedAudit.objectives || "",
      status: clonedAudit.status || "",
      valeurAttendue: clonedAudit.valeurAttendue || "",
      valeurConstatee: clonedAudit.valeurConstatee || "",
      ecartPercentage: clonedAudit.ecartPercentage || "",
    });

    setSelectedAudit(clonedAudit); // ✅ stocke la copie, pas l’objet vivant
    setShowEditModal(true);
  };

  const calculerEcart = (attendue, constatee) => {
    if (!attendue || !constatee) return "";
    const ecart = Math.abs(constatee - attendue);
    return ((ecart / attendue) * 100).toFixed(2);
  };

  const handleEditFormChange = (e) => {
    const { name, value, type } = e.target;

    const parsedValue = type === "number" ? parseFloat(value) || "" : value;

    setEditFormData((prev) => {
      const updated = {
        ...prev,
        [name]: parsedValue,
      };

      if (
        updated.valeurAttendue !== "" &&
        updated.valeurConstatee !== "" &&
        !isNaN(updated.valeurAttendue) &&
        !isNaN(updated.valeurConstatee)
      ) {
        updated.ecartPercentage = calculerEcart(
          updated.valeurAttendue,
          updated.valeurConstatee
        );
      }

      return updated;
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_BASE_URL}/audits/${selectedAudit._id}`,
        editFormData
      );
      fetchAudits();
      setShowEditModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleDelete = async (audit) => {
    console.log("🗑️ Tentative de suppression de :", audit);

    // Récupère l'ID de manière fiable
    const auditId = audit._id || audit.id;

    // Vérifie que l'ID est bien défini
    if (!auditId) {
      alert("❌ ID de l'audit non défini. Suppression annulée.");
      return;
    }

    // Demande de confirmation utilisateur
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet audit ?"
    );
    if (!confirmed) return;

    try {
      // Requête DELETE vers le backend
      const response = await axios.delete(`${API_BASE_URL}/audits/${auditId}`);

      if (response.status === 200) {
        alert("✅ Audit supprimé avec succès.");
        fetchAudits(); // Recharge les audits depuis le backend
      } else {
        alert("❌ Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      alert("❌ Une erreur est survenue pendant la suppression.");
    }
  };

  const handleDetails = (audit) => {
    setSelectedAudit(audit);
    setShowModal(true);
  };

  const handleExport = async () => {
    try {
      if (!selectedAudit || !selectedAudit._id) {
        console.error("⚠️ Aucun audit sélectionné pour l’export.");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/audits/${selectedAudit._id}/export`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `audit_${selectedAudit._id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const handleImport = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(`${API_BASE_URL}/audits/import`, formData);
      fetchAudits();
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
    }
  };

  
  const handleSaveEcart = async (auditId) => {
    try {
      const response = await fetch(`/api/audits/${auditId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ecartPercentage: editedEcartValue }),
      });

      if (response.ok) {
        const updatedAudit = await response.json();
        console.log("✅ Audit mis à jour :", updatedAudit);
        setAudits((prev) =>
          prev.map((a) => (a._id === auditId ? updatedAudit : a))
        );
        setEditingEcartId(null);
        setEditedEcartValue("");
      } else {
        console.error("Erreur de mise à jour");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };


  // Modal de détails
  const DetailsModal = () => {
    if (!showModal || !selectedAudit) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content modal-container">
          {/* En-tête du modal */}
          <div className="modal-header">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Détails de l'audit
              </h3>
            </div>
          </div>

          {/* Corps du modal */}
          <div className="modal-body">
            <div className="grid grid-cols-2 gap-6">
              {/* Informations générales */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">
                  Informations générales
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Nom:</span>{" "}
                    {selectedAudit.name}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {selectedAudit.description}
                  </p>
                  <p>
                    <span className="font-medium">Statut:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                        selectedAudit.status
                      )}`}
                    >
                      {selectedAudit.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Département:</span>{" "}
                    {selectedAudit.department}
                  </p>
                  <p>
                    <span className="font-medium">Auditeur:</span>{" "}
                    {selectedAudit.auditor}
                  </p>
                  <p>
                    <span className="font-medium">categorie:</span>{" "}
                    {selectedAudit.category}
                  </p>
                </div>
              </div>

              {/* Dates et participants */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Planification</h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Date de début:</span>{" "}
                    {selectedAudit.startDate}
                  </p>
                  <p>
                    <span className="font-medium">Date de fin:</span>{" "}
                    {selectedAudit.endDate}
                  </p>
                  <p>
                    <span className="font-medium">Méthodologie:</span>{" "}
                    {selectedAudit.methodology}
                  </p>
                  <p>
                    <span className="font-medium">Participants:</span>
                  </p>
                  <ul className="list-disc ml-5">
                    {selectedAudit.participants?.map((participant, index) => (
                      <li key={index}>{participant}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Objectifs et périmètre */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">
                  Objectifs et périmètre
                </h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Périmètre:</span>{" "}
                    {selectedAudit.scope}
                  </p>
                  <p>
                    <span className="font-medium">Objectifs:</span>
                  </p>
                  <ul className="list-disc ml-5">
                    {selectedAudit.objectives?.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Résultats */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Résultats</h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Écart:</span>
                    <span
                      className={`ml-2 ${getEcartColor(
                        selectedAudit.ecartPercentage
                      )}`}
                    >
                      {selectedAudit.ecartPercentage
                        ? `${selectedAudit.ecartPercentage}%`
                        : "-"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Constatations:</span>
                  </p>
                  {selectedAudit.findings?.length > 0 ? (
                    <ul className="list-disc ml-5">
                      {selectedAudit.findings.map((finding, index) => (
                        <li key={index}>{finding}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 ml-5">Aucune constatation</p>
                  )}
                  <p>
                    <span className="font-medium">Recommandations:</span>
                  </p>
                  {selectedAudit.recommendations?.length > 0 ? (
                    <ul className="list-disc ml-5">
                      {selectedAudit.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 ml-5">Aucune recommandation</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pied du modal */}
          <div className="modal-footer bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="bg-emerald-500 text-white active:bg-emerald-600 
                text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg hover:bg-gray-50outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Exporter
              </button>
              <label className="bg-emerald-500 text-white active:bg-emerald-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg hover:bg-emerald-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Importer
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleImport}
                />
              </label>
            </div>
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedAudit(null);
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="orange-glow-container rounded-lg p-1">
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white page-fade-in">
      {/* En-tête */}
      <div className="rounded-t mb-0 px-4 py-3 border-0 ">
        <div className="flex flex-wrap items-center justify-between ">
          <div className="relative flex items-center">
            <h3 className="font-semibold text-lg text-blueGray-700 mr-4">
              Liste des audits
            </h3>
            <div className="relative flex w-64">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch className="text-blueGray-300" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un audit..."
                className="border border-blueGray-300 pl-10 pr-4 py-2 rounded-lg text-sm w-full focus:outline-none focus:border-indigo-500 slide-in-title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <select
              id="auditType"
              value={selectedAuditType}
              onChange={handleAuditTypeChange}
              className="border border-blueGray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64 fade-in-title"
            >
              {auditTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Link
              to="/FormAddAudit"
              className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded"
            >
              Planifier un audit
            </Link>
          </div>
        </div>
      </div>

      {/* Corps du tableau */}
      <div className="block w-full overflow-x-auto">
        {filteredAudits.length === 0 ? (
          <div className="text-center py-4 text-blueGray-500">
            {searchTerm ? "Aucun audit trouvé" : "Aucun audit disponible"}
          </div>
        ) : (
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Nom de l'audit
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Date
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Statut
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Auditeur
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  % Écart
                </th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map((audit) => (
                <tr key={audit._id} className="hover:bg-blueGray-50">
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {audit.name}
                  </td>
                  {/* ✅ Affichage de la date de début */}
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {audit.startDate
                      ? new Date(audit.startDate).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <span
                      className={`px-2 py-1 rounded-full font-bold ${getStatusColor(
                        audit.status
                      )}`}
                    >
                      {audit.status}
                    </span>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {audit.auditor}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {renderEcart(audit)}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleDetails(audit)}
                        className="p-2"
                        title="Voir les détails"
                      >
                        <FaInfoCircle className="text-lg text-blue-500 hover:text-blue-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(audit)}
                        className="p-2"
                        title="Modifier"
                      >
                        <FaEdit className="text-lg text-emerald-500 hover:text-emerald-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(audit)}
                        className="p-2"
                        title="Supprimer"
                      >
                        <RiDeleteBin5Fill className="text-lg text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>

      {/* Ajout du modal d'édition */}
      <EditModel
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        formData={editFormData}
        onChange={handleEditFormChange}
      />

      {/* Modal de détails existant */}
      <DetailsModal />
    </div>
  );
}
