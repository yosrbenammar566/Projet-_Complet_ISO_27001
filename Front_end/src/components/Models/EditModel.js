import React from "react";
import { FaTimes } from "react-icons/fa";

export default function EditModal({ show, onClose, onSubmit, formData, onChange }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: "1rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          maxWidth: "32rem",
          width: "100%",
          padding: "2rem",
          overflow: "hidden",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div className="modal-overlay">
          <div className="modal-content modal-container max-w-2xl">
            <div className="modal-header bg-gray-50 px-6 py-3 flex justify-between items-center border-b border-gray-200 flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Modifier l'audit</h3>
              <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                <FaTimes className="h-7 w-7" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6 overflow-y-auto max-h-[75vh] px-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'audit</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>

                <div className="col-span-2 mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ">Département</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Auditeur</label>
                  <input
                    type="text"
                    name="auditor"
                    value={formData.auditor}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Méthodologie</label>
                  <input
                    type="text"
                    name="methodology"
                    value={formData.methodology}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Statut</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  >
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                    <option value="En attente">En attente</option>
                  </select>
                </div>

                <div className="col-span-2 mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Périmètre</label>
                  <input
                    type="text"
                    name="scope"
                    value={formData.scope}
                    onChange={onChange}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 text-center mt-6">
                <button
                  type="submit"
                  className="bg-emerald-500 text-white active:bg-emerald-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg hover:bg-emerald-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
