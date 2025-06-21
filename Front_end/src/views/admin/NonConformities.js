import React, { useState, useContext } from "react";
import { useEffect } from "react";

import { PlanActionContext } from "../../contexts/PlanActionContext";

export default function NonConformities() {
 const [showAddForm, setShowAddForm] = useState(false);
  // Données d'exemple avec auditType ajouté
  const [nonConformities, setNonConformities] = useState([
    {
      id: "nc-1681234567890",

      title: "Politique non documentée",
      description: "La politique de sécurité n'est pas formalisée et approuvée",
      control: "A.5.1",
      severity: "major",
      status: "open",
      discoveredDate: "2023-05-15",
      dueDate: "2023-06-15",
      responsible: "Jean Dupont",
      correctiveAction: "Rédiger la politique et la faire approuver",
      verificationMethod: "Revue documentaire",
      verificationDate: "",
      notes: "Priorité haute - à traiter avant l'audit de certification",
    },
    {
      id: "nc-1681234567891",

      title: "Contrôles d'accès manquants",
      description:
        "Absence de système d'authentification forte pour les accès admin",
      control: "A.9.2",
      severity: "minor",
      status: "in-progress",
      discoveredDate: "2023-05-10",
      dueDate: "2023-05-30",
      responsible: "Marie Martin",
      correctiveAction: "Mettre en place une authentification à 2 facteurs",
      verificationMethod: "Test technique",
      verificationDate: "",
      notes: "En attente de la livraison par l'équipe IT",
    },
  ]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // ou "error"

  useEffect(() => {
    fetch("http://localhost:5000/api/nonconformities")
      .then((res) => res.json())
      .then((data) => {
        setNonConformities(data); // ✅ On charge juste la liste
        console.log("✅ Non-conformités chargées :", data);
      })
      .catch((err) => console.error("❌ Erreur de chargement :", err));
  }, []);

  const { addActionFromNonConformity } = useContext(PlanActionContext);

  const handleAddNonConformity = async (newNC) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/nonconformities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newNC,
          }),
        }
      );

      const saved = await response.json();
      console.log("🧪 Non-conformité enregistrée :", saved);
      addActionFromNonConformity({
        nonConformity: saved._id, // ✅ UN SEUL ID à lier
        responsible: saved.responsible || "À désigner",
        correctionDate: saved.dueDate || new Date(),
        recommendation: saved.correctiveAction || "Corriger l'écart identifié",
        actionTitle: `Corriger: ${saved.title}`,
        plannedDate: saved.dueDate,
        status: "À faire",
      });

      setMessage("✅ Non-conformité ajoutée et action générée !");
      setMessageType("success");
    } catch (err) {
      console.error("❌ Erreur ajout :", err);
      setMessage("❌ Erreur lors de l'ajout de la non-conformité.");
      setMessageType("error");
    }
  };

  const [editingNonConformity, setEditingNonConformity] = useState(null);
  const [selectedNonConformityId, setSelectedNonConformityId] = useState(null);

  const [originalNonConformity, setOriginalNonConformity] = useState(null);

  const isoControls = [
    { id: "A.5.1", name: "Politiques de sécurité de l'information" },
    { id: "A.5.2", name: "Rôles et responsabilités" },
    { id: "A.9.2", name: "Contrôles d'accès aux systèmes" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingNonConformity({
      ...editingNonConformity,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      // 1. Envoie la mise à jour de la non-conformité au backend
      const response = await fetch(
        `http://localhost:5000/api/nonconformities/${
          editingNonConformity._id || editingNonConformity.id
        }`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingNonConformity),
        }
      );

      const updated = await response.json();

      // 2. Mets à jour la liste locale des non-conformités dans le state
      setNonConformities(
        nonConformities.map((item) =>
          (item._id || item.id) === (updated._id || updated.id) ? updated : item
        )
      );

      // 3. **Ici** : juste après la mise à jour locale,
      // crée l’action correspondante dans PlanAction
      await addActionFromNonConformity({
        nonConformity: updated._id || updated.id,
        responsible: updated.responsible || "À désigner",
        correctionDate: updated.dueDate,
        recommendation: updated.correctiveAction,
        actionTitle: `Corriger: ${updated.title}`,
        plannedDate: updated.dueDate,
        status: "À faire",
      });

      // 4. Nettoyage : ferme le formulaire d’édition, affiche message succès
      setEditingNonConformity(null);
      setMessage("✅ Non-conformité mise à jour et action générée !");
      setMessageType("success");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error);
      setMessage("❌ Échec de la sauvegarde de la non-conformité.");
      setMessageType("error");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/nonconformities/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Erreur mise à jour statut");
      const updated = await res.json();
      setNonConformities(
        nonConformities.map((item) =>
          (item._id || item.id) === id ? updated : item
        )
      );
    } catch (error) {
      console.error(error);
      setMessage("❌ Échec mise à jour statut");
      setMessageType("error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/nonconformities/${id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setNonConformities(
          nonConformities.filter((item) => (item._id || item.id) !== id)
        );
      } else {
        console.error("Échec suppression");
      }
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  console.log("Liste complète des non-conformités :", nonConformities);
  const filteredNonConformities = nonConformities;

  console.log("Liste filtrée des non-conformités :", filteredNonConformities);
  return (
    <div className="page-fade-in">
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white mt-50 red-glow-container">
        <div className="flex-auto p-5 lg:p-10">
          <h4 className="text-2xl font-semibold text-blueGray-800 mb-6">
            Gestion des non-conformités
          </h4>

          <div className="bg-white rounded shadow-md p-4">
            <h5 className="text-lg font-semibold text-blueGray-700 mb-4">
              Liste des non-conformités
            </h5>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                      Contrôle
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                      Sévérité
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                      Date limite
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNonConformities.map((item) => {
                    console.log("Item dans map:", item);
                    return item?.title ? (
                      <React.Fragment key={item._id || item.id}>
                        <tr className="border-t border-blueGray-200">
                          <td className="py-3 px-4 text-sm text-blueGray-700">
                            {item.title}
                          </td>
                          <td className="py-3 px-4 text-sm text-blueGray-700">
                            {isoControls.find((c) => c.id === item.control)
                              ?.name || item.control}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                item.severity === "major"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {item.severity === "major"
                                ? "Majeure"
                                : "Mineure"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <select
                              className="border-0 px-2 py-1 text-sm rounded focus:outline-none focus:ring"
                              value={item.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  item._id || item.id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="open">Ouverte</option>
                              <option value="in-progress">En cours</option>
                              <option value="closed">Fermée</option>
                              <option value="verified">Vérifiée</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-sm text-blueGray-700">
                            {item.dueDate}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <button
                              className="text-blue-500 hover:text-blue-700 mr-2"
                              onClick={() => setEditingNonConformity(item)}
                            >
                              Compléter
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(item._id || item.id)}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>

                        {editingNonConformity &&
                          (editingNonConformity._id ||
                            editingNonConformity.id) ===
                            (item._id || item.id) && (
                            <tr className="bg-blueGray-100">
                              <td colSpan="6" className="py-4 px-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="relative w-full">
                                    <label
                                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                      htmlFor="description"
                                    >
                                      Description détaillée
                                    </label>
                                    <textarea
                                      id="description"
                                      name="description"
                                      value={
                                        editingNonConformity?.description || ""
                                      }
                                      onChange={handleInputChange}
                                      rows="3"
                                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                    />
                                  </div>

                                  <div className="relative w-full">
                                    <label
                                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                      htmlFor="correctiveAction"
                                    >
                                      Action corrective
                                    </label>
                                    <textarea
                                      id="correctiveAction"
                                      name="correctiveAction"
                                      value={
                                        editingNonConformity?.correctiveAction ||
                                        ""
                                      }
                                      onChange={handleInputChange}
                                      rows="3"
                                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                    />
                                  </div>

                                  <div className="relative w-full">
                                    <label
                                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                      htmlFor="responsible"
                                    >
                                      Responsable
                                    </label>
                                    <input
                                      type="text"
                                      id="responsible"
                                      name="responsible"
                                      value={
                                        editingNonConformity?.responsible || ""
                                      }
                                      onChange={handleInputChange}
                                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    />
                                  </div>

                                  <div className="relative w-full">
                                    <label
                                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                      htmlFor="dueDate"
                                    >
                                      Date limite de correction
                                    </label>
                                    <input
                                      type="date"
                                      id="dueDate"
                                      name="dueDate"
                                      value={
                                        editingNonConformity?.dueDate?.slice(
                                          0,
                                          10
                                        ) || ""
                                      }
                                      onChange={handleInputChange}
                                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    />
                                  </div>

                                  <div className="relative w-full">
                                    <label
                                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                      htmlFor="severity"
                                    >
                                      Sévérité
                                    </label>
                                    <select
                                      id="severity"
                                      name="severity"
                                      value={
                                        editingNonConformity?.severity ||
                                        "minor"
                                      }
                                      onChange={handleInputChange}
                                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    >
                                      <option value="major">Majeure</option>
                                      <option value="minor">Mineure</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <button
                                    className="mr-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500mr-2 mb-1"
                                    type="button"
                                    onClick={() => {
                                      setEditingNonConformity(null);
                                      setOriginalNonConformity(null);
                                    }}
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    className="welcome-button welcome-button-primary mr-1 mb-1"
                                    type="button"
                                    onClick={handleSave}
                                  >
                                    Enregistrer
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                      </React.Fragment>
                    ) : null;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
