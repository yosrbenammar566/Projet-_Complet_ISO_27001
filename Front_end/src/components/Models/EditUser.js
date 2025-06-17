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

export default function EditUser({
  showEditModal,
  setShowEditModal,
  formData,
  handleFormChange,
  handleEditSubmit,
  privilegeModules,
  handlePrivilegeChange,
}) {
  if (!showEditModal) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Modifier l'utilisateur
          </h3>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Fermer"
          >
            <FaTimes className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={handleEditSubmit} className="space-y-6">
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

          <div>
            <h4 className="text-lg font-semibold mb-2">Privilèges</h4>
            {Object.entries(privilegeModules).map(([module, actions]) => (
              <div key={module} className="mb-4 border p-3 rounded bg-gray-50">
                <h5 className="font-semibold mb-2">{module}</h5>
                <div className="flex flex-wrap gap-3">
                  {actions.map((action) => (
                    <label
                      key={action}
                      className="inline-flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.privileges[module]?.[action] || false}
                        onChange={() =>
                          handlePrivilegeChange(module, action)
                        }
                        className="form-checkbox h-5 w-5 text-indigo-600"
                      />
                      <span>{action}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-emerald-500 text-white py-2 px-6 rounded-lg hover:bg-emerald-600"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
