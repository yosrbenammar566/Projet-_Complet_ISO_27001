import React, { useState } from "react";
import { FaEdit, FaSearch } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import "../../styles/modal.css";
import { useEffect } from "react";
import AddModalUser from "../Models/AddModalUser"; // adapte le chemin si besoin
import EditUser from "../Models/EditUser"; // adapte le chemin si besoin

const privilegeModules = {
  Rapports: ["Consulter", "Modifier", "Supprimer", "Ajouter"],
  Audits: ["Consulter", "Modifier", "Supprimer", "Ajouter"],
  "Non Conformités": ["Consulter", "Modifier", "Supprimer", "Ajouter"],
  "Plan d'Action": ["Consulter", "Modifier", "Supprimer", "Ajouter"],
  Checklist: ["Consulter", "Modifier", "Supprimer", "Ajouter"],
};

export default function TableUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    privileges: {},
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des utilisateurs");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erreur API :", error);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrivilegeChange = (module, action) => {
    setFormData((prev) => {
      const modulePrivileges = prev.privileges[module] || {};
      return {
        ...prev,
        privileges: {
          ...prev.privileges,
          [module]: {
            ...modulePrivileges,
            [action]: !modulePrivileges[action],
          },
        },
      };
    });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    const userPrivileges =
      user.privileges && Object.keys(user.privileges).length > 0
        ? user.privileges
        : {};
    setFormData({
      name: user.username,
      email: user.email,
      role: user.role,
      privileges: userPrivileges,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.name,
            email: formData.email,
            role: formData.role,
          }),
        }
      );
      if (!response.ok) throw new Error("Échec de la mise à jour");
      const updated = await response.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === updated._id ? updated : u))
      );
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Erreur MAJ :", error);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
    });
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: "password123", // temporaire ou champ à ajouter
          role: formData.role,
        }),
      });
      if (!response.ok) throw new Error("Erreur lors de l'ajout");
      const added = await response.json();
      setUsers((prev) => [...prev, added.user || added]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Erreur ajout :", error);
    }
  };

  const handleDelete = async (user) => {
    if (
      window.confirm(
        `Voulez-vous vraiment supprimer l'utilisateur ${user.username} ?`
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${user._id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Erreur lors de la suppression");
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };

  return (
    <div className="blue-glow-container rounded-lg p-1">
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white page-fade-in">
        <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-blueGray-700">
            Liste des utilisateurs
          </h3>
          <button
            onClick={handleAdd}
            className="bg-indigo-500 py-2 px-4 rounded text-white text-xs font-bold uppercase hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ajouter un utilisateur
          </button>
        </div>

        <div className="px-4 py-3 border-b border-gray-200 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
            aria-label="Rechercher un utilisateur"
          />
        </div>

        <div className="block w-full overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-4 text-blueGray-500">
              {searchTerm
                ? "Aucun utilisateur trouvé"
                : "Aucun utilisateur disponible"}
            </div>
          ) : (
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Nom
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Email
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Rôle
                  </th>
                  <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-blueGray-50">
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:underline font-bold"
                      >
                        {user.username}
                      </button>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {user.email}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {(() => {
                        const getRoleColor = (role) => {
                          switch (role) {
                            case "admin":
                              return "bg-emerald-200 text-emerald-700";
                            case "auditeur":
                              return "bg-orange-200 text-orange-700";
                            case "consultant":
                              return "bg-red-200 text-red-700";
                            case "responsable de direction":
                              return "bg-blue-200 text-blue-700";
                            case "user":
                              return "bg-gray-200 text-gray-700";
                            default:
                              return "bg-gray-200 text-gray-700";
                          }
                        };
                        const roleKey = user.role?.toLowerCase() || "user";
                        const colorClass = getRoleColor(roleKey);
                        return (
                          <span
                            className={`px-2 py-1 rounded-full font-bold ${colorClass}`}
                          >
                            {user.role}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2"
                          title="Modifier"
                        >
                          <FaEdit className="text-lg text-blue-600 hover:text-blue-800" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
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

      <EditUser
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        formData={formData}
        handleFormChange={handleFormChange}
        handleEditSubmit={handleEditSubmit}
        privilegeModules={privilegeModules}
        handlePrivilegeChange={handlePrivilegeChange}
      />

      <AddModalUser
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        formData={formData}
        handleFormChange={handleFormChange}
        handleAddSubmit={handleAddSubmit}
      />
    </div>
  );
}
