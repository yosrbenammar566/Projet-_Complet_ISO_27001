
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
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

export default function AddModalUser({
  showAddModal,
  setShowAddModal,
  formData,
  handleFormChange,
  handleAddSubmit,
}) {
  if (!showAddModal) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Ajouter un utilisateur
          </h3>
          <button
            onClick={() => setShowAddModal(false)}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Fermer"
          >
            <FaTimes className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={handleAddSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 rounded-lg py-3 px-4"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 rounded-lg py-3 px-4"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Rôle
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              required
              className="w-full border border-gray-300 rounded-lg py-3 px-4"
            />
          </div>
           <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                  />
                </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-emerald-500 text-white py-2 px-6 rounded-lg hover:bg-emerald-600"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

