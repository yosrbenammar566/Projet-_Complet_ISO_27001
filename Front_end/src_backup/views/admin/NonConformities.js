import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

export default function NonConformites() {
  const [showForm, setShowForm] = useState(false);
  const [nonConformities, setNonConformities] = useState([]);
  const [isoControls, setIsoControls] = useState([]);

  const [newNonConformity, setNewNonConformity] = useState({
    title: "",
    control: "",
    severity: "minor",
    responsible: "",
    discoveredDate: "",
    dueDate: "",
    description: "",
    correctiveAction: "",
    verificationMethod: "",
    verificationDate: "",
    notes: "",
    status: "open",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNonConformity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchNonConformities = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/nonconformities");
      setNonConformities(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des non-conformités :", error);
    }
  };

  const fetchControls = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/controls");
      setIsoControls(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des contrôles :", error);
    }
  };

  useEffect(() => {
    fetchNonConformities();
    fetchControls();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/nonconformities", newNonConformity);
      setNonConformities(prev => [...prev, res.data]);
      setNewNonConformity({
        title: "",
        control: "",
        severity: "minor",
        responsible: "",
        discoveredDate: "",
        dueDate: "",
        description: "",
        correctiveAction: "",
        verificationMethod: "",
        verificationDate: "",
        notes: "",
        status: "open",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de l’ajout :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/nonconformities/${id}`);
      fetchNonConformities();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/nonconformities/${id}/status`, { status });
      fetchNonConformities();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  return (
    <section className="py-8 bg-blueGray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-2xl font-semibold text-blueGray-700">Non-conformités</h4>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blueGray-700 text-white text-sm font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md"
          >
            {showForm ? "Annuler" : "Ajouter une non-conformité"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleFormSubmit} className="bg-white rounded shadow-md p-4 mb-6">
            {/* Champs de formulaire (inchangés) */}
            {/* ... garder ici les champs que tu avais déjà (title, control, etc.) */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-blueGray-200">
            <thead>
              <tr className="bg-blueGray-100 text-blueGray-600 text-xs font-semibold uppercase text-left">
                <th className="px-4 py-2">Titre</th>
                <th className="px-4 py-2">Contrôle</th>
                <th className="px-4 py-2">Responsable</th>
                <th className="px-4 py-2">Sévérité</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {nonConformities.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.control}</td>
                  <td className="px-4 py-2">{item.responsible}</td>
                  <td className="px-4 py-2 capitalize">{item.severity}</td>
                  <td className="px-4 py-2 capitalize">{item.status}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleStatusChange(item._id, item.status === "open" ? "closed" : "open")}
                      className={`px-3 py-1 text-xs rounded shadow ${item.status === "open" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}`}
                    >
                      {item.status === "open" ? "Clôturer" : "Réouvrir"}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
