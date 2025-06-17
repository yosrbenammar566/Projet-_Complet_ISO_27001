import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NonConformities() {
  const [nonConformities, setNonConformities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNonConformity, setNewNonConformity] = useState({
    title: "",
    description: "",
    control: "",
    severity: "minor",
    status: "open",
    discoveredDate: "",
    dueDate: "",
    responsible: "",
    correctiveAction: "",
    verificationMethod: "",
    verificationDate: "",
    notes: ""
  });

  const apiUrl = "http://localhost:5000/api/non-conformities";

  useEffect(() => {
    fetchNonConformities();
  }, []);

  const fetchNonConformities = async () => {
    try {
      const res = await axios.get(apiUrl);
      setNonConformities(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNonConformity({ ...newNonConformity, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(apiUrl, newNonConformity);
      setNonConformities([...nonConformities, res.data]);
      setShowAddForm(false);
      setNewNonConformity({
        title: "",
        description: "",
        control: "",
        severity: "minor",
        status: "open",
        discoveredDate: "",
        dueDate: "",
        responsible: "",
        correctiveAction: "",
        verificationMethod: "",
        verificationDate: "",
        notes: ""
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setNonConformities(nonConformities.filter(nc => nc._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.patch(`${apiUrl}/${id}`, { status: newStatus });
      setNonConformities(
        nonConformities.map(nc => (nc._id === id ? res.data : nc))
      );
    } catch (error) {
      console.error("Erreur de mise à jour du statut :", error);
    }
  };

  const isoControls = [
    { id: "A.5.1", name: "Politiques de sécurité de l'information" },
    { id: "A.5.2", name: "Rôles et responsabilités" },
    { id: "A.6.1", name: "Organisation interne" },
    { id: "A.6.2", name: "Télébureau et télétravail" },
    { id: "A.7.1", name: "Sélection" },
    { id: "A.7.2", name: "Formation et sensibilisation" },
    { id: "A.7.3", name: "Processus disciplinaire" },
    { id: "A.8.1", name: "Responsabilité des actifs" },
    { id: "A.8.2", name: "Classification de l'information" },
    { id: "A.8.3", name: "Médias sur support amovible" },
    { id: "A.9.1", name: "Contrôles d'accès aux locaux" },
    { id: "A.9.2", name: "Contrôles d'accès aux systèmes" },
    { id: "A.9.3", name: "Gestion des droits d'accès" },
    { id: "A.9.4", name: "Gestion des secrets d'authentification" },
    { id: "A.10.1", name: "Contrôles contre les codes malveillants" },
    { id: "A.10.2", name: "Sauvegarde" },
    { id: "A.11.1", name: "Contrôles physiques" },
    { id: "A.11.2", name: "Contrôles techniques" },
    { id: "A.12.1", name: "Contrôles opérationnels" },
    { id: "A.12.2", name: "Protection contre les logiciels malveillants" },
    { id: "A.12.3", name: "Sauvegarde" },
    { id: "A.12.4", name: "Journalisation et surveillance" },
    { id: "A.12.5", name: "Contrôle des logiciels d'exploitation" },
    { id: "A.12.6", name: "Gestion de la vulnérabilité technique" },
    { id: "A.12.7", name: "Considérations relatives à la sécurité des SI" },
    { id: "A.13.1", name: "Contrôles de sécurité réseau" },
    { id: "A.13.2", name: "Sécurité des services réseau" },
    { id: "A.14.1", name: "Sécurité des systèmes d'information" },
    { id: "A.14.2", name: "Sécurité dans les cycles de développement" },
    { id: "A.15.1", name: "Relations fournisseurs" },
    { id: "A.15.2", name: "Fourniture de services" },
    { id: "A.16.1", name: "Événements de sécurité" },
    { id: "A.16.2", name: "Failles de sécurité" },
    { id: "A.17.1", name: "Continuité de l'activité" },
    { id: "A.17.2", name: "Redondance" },
    { id: "A.18.1", name: "Conformité légale et contractuelle" },
    { id: "A.18.2", name: "Revue de conformité" }
  ];

  return (
    <section className="relative block py-24 lg:pt-0 bg-blueGray-800 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
          <div className="w-full lg:w-10/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 mt-50">
              <div className="flex-auto p-5 lg:p-10">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-2xl font-semibold text-blueGray-800">Gestion des non-conformités</h4>
                  <button
                    className="bg-blueGray-800 text-white text-sm font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    {showAddForm ? "Annuler" : "Ajouter une non-conformité"}
                  </button>
                </div>

                {showAddForm && (
                  <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input className="p-2 border rounded" name="title" placeholder="Titre" required value={newNonConformity.title} onChange={handleInputChange} />
                      <input className="p-2 border rounded" name="description" placeholder="Description" value={newNonConformity.description} onChange={handleInputChange} />
                      <select name="control" className="p-2 border rounded" required value={newNonConformity.control} onChange={handleInputChange}>
                        <option value="">-- Contrôle ISO 27001 --</option>
                        {isoControls.map(c => <option key={c.id} value={c.id}>{c.id} - {c.name}</option>)}
                      </select>
                      <select name="severity" className="p-2 border rounded" value={newNonConformity.severity} onChange={handleInputChange}>
                        <option value="minor">Mineure</option>
                        <option value="major">Majeure</option>
                      </select>
                      <input type="date" className="p-2 border rounded" name="discoveredDate" value={newNonConformity.discoveredDate} onChange={handleInputChange} />
                      <input type="date" className="p-2 border rounded" name="dueDate" value={newNonConformity.dueDate} onChange={handleInputChange} />
                      <input className="p-2 border rounded" name="responsible" placeholder="Responsable" value={newNonConformity.responsible} onChange={handleInputChange} />
                      <input className="p-2 border rounded" name="correctiveAction" placeholder="Action corrective" value={newNonConformity.correctiveAction} onChange={handleInputChange} />
                      <input className="p-2 border rounded" name="verificationMethod" placeholder="Méthode de vérification" value={newNonConformity.verificationMethod} onChange={handleInputChange} />
                      <input type="date" className="p-2 border rounded" name="verificationDate" value={newNonConformity.verificationDate} onChange={handleInputChange} />
                      <textarea className="p-2 border rounded col-span-2" name="notes" placeholder="Remarques" value={newNonConformity.notes} onChange={handleInputChange}></textarea>
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Enregistrer</button>
                  </form>
                )}

                {/* Table des non-conformités */}
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left bg-white shadow rounded">
                    <thead>
                      <tr className="bg-blueGray-100 text-blueGray-600 uppercase text-xs">
                        <th className="px-4 py-2">Titre</th>
                        <th className="px-4 py-2">Contrôle</th>
                        <th className="px-4 py-2">Sévérité</th>
                        <th className="px-4 py-2">Statut</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nonConformities.map((nc) => (
                        <tr key={nc._id} className="border-t">
                          <td className="px-4 py-2">{nc.title}</td>
                          <td className="px-4 py-2">{nc.control}</td>
                          <td className="px-4 py-2 capitalize">{nc.severity}</td>
                          <td className="px-4 py-2">
                            <select
                              value={nc.status}
                              onChange={(e) => handleStatusChange(nc._id, e.target.value)}
                              className="p-1 border rounded"
                            >
                              <option value="open">Ouvert</option>
                              <option value="in-progress">En cours</option>
                              <option value="closed">Fermé</option>
                              <option value="verified">Vérifié</option>
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDelete(nc._id)}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                      {nonConformities.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-gray-500">
                            Aucune non-conformité enregistrée.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
