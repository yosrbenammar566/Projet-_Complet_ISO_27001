import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function CardPageVisits() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);

  const audits = [
    {
      auditor: "Jean Dupont",
      nonConformities: [
        { id: 1, description: "Non-conformité 1", action: "Action 1", status: "Ouverte" },
        { id: 2, description: "Non-conformité 2", action: "Action 2", status: "Fermée" },
        { id: 3, description: "Non-conformité 3", action: "Action 3", status: "Ouverte" },
      ],
    },
    {
      auditor: "Marie Curie",
      nonConformities: [
        { id: 4, description: "Non-conformité 4", action: "Action 4", status: "Fermée" },
        { id: 5, description: "Non-conformité 5", action: "Action 5", status: "Ouverte" },
      ],
    },
    {
      auditor: "Paul Martin",
      nonConformities: [
        { id: 6, description: "Non-conformité 6", action: "Action 6", status: "Ouverte" },
        { id: 7, description: "Non-conformité 7", action: "Action 7", status: "Fermée" },
      ],
    },
  ];

  const openPopup = (audit) => {
    setSelectedAudit(audit);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAudit(null);
  };

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

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Les audits récents
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Audits table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Nom de l'auditeur
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Nombre de non-conformités
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Détails
                </th>
              </tr>
            </thead>
            <tbody>
              {audits.map((audit, index) => (
                <tr key={index}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {audit.auditor}
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {audit.nonConformities.length}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <button
                      onClick={() => openPopup(audit)}
                      className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && selectedAudit && (
        <div style={modalOverlayStyle} onClick={closePopup}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Non-conformités pour {selectedAudit.auditor}
              </h3>
              <button
                onClick={closePopup}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Close modal"
              >
                <FaTimes className="h-7 w-7" />
              </button>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {selectedAudit.nonConformities.map((nc) => (
                  <tr key={nc.id}>
                    <td className="border border-gray-300 px-4 py-2">{nc.description}</td>
                    <td className="border border-gray-300 px-4 py-2">{nc.action}</td>
                    <td className="border border-gray-300 px-4 py-2">{nc.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
// </create_file>
