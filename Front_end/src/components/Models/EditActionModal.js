import React from "react";
import { FaTimes } from "react-icons/fa";

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
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
};

export default function EditActionModal({
  show,
  onClose,
  onSubmit,
  formData,
  onChange,
  statusOptions,
}) {
  if (!show) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Modifier une action</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Fermer"
          >
            <FaTimes className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={onChange}
              required
              className="w-full border border-gray-300 rounded-lg py-3 px-4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description de l’action à réaliser *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg py-3 px-4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              required
              className="w-full border border-gray-300 rounded-lg py-3 px-4"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-600"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
