import React, { useState, useRef } from "react";
import DocumentsTable from "../../components/Cards/DocumentsTable";
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaDownload,
  FaTrash,
} from "react-icons/fa";

const auditTypes = [
  { id: "type1", label: "Audit Type 1" },
  { id: "type2", label: "Audit Type 2" },
  { id: "type3", label: "Audit Type 3" },
];

const documentsData = {
  type1: [],
  type2: [],
  type3: [],
};

const statsData = {
  type1: { documents: 0, totalSize: "0 KB", lastActivity: "-" },
  type2: { documents: 0, totalSize: "0 KB", lastActivity: "-" },
  type3: { documents: 0, totalSize: "0 KB", lastActivity: "-" },
};

const Documents = () => {
  const [selectedAuditType, setSelectedAuditType] = useState(auditTypes[0].id);
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem("documentsData");
    return saved ? JSON.parse(saved) : documentsData;
  });
  const fileInputRef = useRef(null);

  const handleAuditTypeChange = (e) => {
    setSelectedAuditType(e.target.value);
  };

  const handleImport = (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const newDocs = Array.from(files).map((file, index) => {
      const ext = file.name.split(".").pop().toLowerCase();

      return {
        id: Date.now() + index,
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        date: new Date().toLocaleString(),
        type: ext,
      };
    });

    setDocuments((prevDocs) => {
      const updatedDocs = { ...prevDocs };
      updatedDocs[selectedAuditType] = [
        ...(updatedDocs[selectedAuditType] || []),
        ...newDocs,
      ];
      localStorage.setItem("documentsData", JSON.stringify(updatedDocs));
      return updatedDocs;
    });

    event.target.value = null;
  };

  // ✅ Suppression locale
  const handleDeleteLocal = (id) => {
    const updated = { ...documents };
    updated[selectedAuditType] = updated[selectedAuditType].filter((doc) => doc.id !== id);
    setDocuments(updated);
    localStorage.setItem("documentsData", JSON.stringify(updated));
  };

  // ✅ Simulation de téléchargement local
  const handleDownloadLocal = (doc) => {
    alert("Téléchargement simulé : " + doc.name);
    // Pour un vrai téléchargement, il faut un backend ou des fichiers Blob/File.
  };

  const currentDocuments = documents[selectedAuditType];

  const calculateStats = (docs) => {
    const totalSizeBytes = docs.reduce((acc, doc) => {
      const sizeParts = doc.size.split(" ");
      const sizeValue = parseFloat(sizeParts[0]);
      const sizeUnit = sizeParts[1];
      let sizeInBytes = sizeValue;
      if (sizeUnit === "KB") sizeInBytes = sizeValue * 1024;
      else if (sizeUnit === "MB") sizeInBytes = sizeValue * 1024 * 1024;
      return acc + sizeInBytes;
    }, 0);

    const totalSizeKB = totalSizeBytes / 1024;
    const formattedSize =
      totalSizeKB > 1024
        ? `${(totalSizeKB / 1024).toFixed(2)} MB`
        : `${totalSizeKB.toFixed(2)} KB`;

    return {
      documents: docs.length,
      totalSize: formattedSize,
      lastActivity:
        docs.length > 0 ? docs[docs.length - 1].date.split(" ")[0] : "-",
    };
  };

  const dynamicStats = calculateStats(currentDocuments);

  return (
    <section className="relative block py-24 lg:pt-0  mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center mt-10">
          <div className="w-full lg:w-10/12 px-4 page-fade-in">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg bg-white rounded-lg yellow-glow-container">
              <div className="flex-auto p-5 lg:p-10">
                <h4 className="text-2xl font-semibold text-blueGray-800 mb-6 fade-in-title">
                  📁 Gestion des Documents d'Audit
                </h4>

                <div className="mb-6">
                  <label
                    htmlFor="auditType"
                    className="block mb-2 text-blueGray-600 font-medium"
                  >
                    Sélectionnez le type d'audit
                  </label>
                  <select
                    id="auditType"
                    value={selectedAuditType}
                    onChange={handleAuditTypeChange}
                    className="border border-blueGray-400 rounded-lg p-2 w-full max-w-xs slide-in-title"
                  >
                    {auditTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="border-2 border-dashed border-blueGray-400 rounded-lg p-8 text-center mb-8 cursor-pointer transition-colors hover:border-blueGray-600 bg-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <p className="text-blueGray-600 font-medium">
                    <span className="text-indigo-600">Glissez-déposez</span> vos
                    fichiers ici
                    <br />
                    <span className="text-sm text-blueGray-500">
                      ou cliquez pour sélectionner
                    </span>
                  </p>
                  <p className="text-sm text-blueGray-400 mt-2">
                    Formats acceptés: PDF, DOC, DOCX, PNG, JPG
                    <br />
                    <span className="text-xs">(Taille maximale: 50MB)</span>
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleImport}
                />

                {/* Tableau amélioré */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-blueGray-200">
                    <thead className="bg-blueGray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                          Fichier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                          Taille
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                          Date d'upload
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blueGray-200">
                      {currentDocuments.map((doc) => (
                        <tr
                          key={doc.id}
                          className="hover:bg-blueGray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {doc.type === "pdf" && (
                                <FaFilePdf className="text-red-500 mr-2" />
                              )}
                              {(doc.type === "doc" ||
                                doc.type === "docx") && (
                                <FaFileWord className="text-blue-500 mr-2" />
                              )}
                              {["jpg", "jpeg", "png"].includes(doc.type) && (
                                <FaFileImage className="text-green-500 mr-2" />
                              )}
                              <span className="text-blueGray-700">
                                {doc.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-blueGray-500">
                            {doc.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-blueGray-500">
                            {doc.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-3">
                              <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => handleDownloadLocal(doc)}
                              >
                                <FaDownload className="w-5 h-5" />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteLocal(doc.id)}
                              >
                                <FaTrash className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Statistiques améliorées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <div className="text-blueGray-500 text-sm mb-1">
                      Documents
                    </div>
                    <div className="text-2xl font-bold text-blueGray-800">
                      {dynamicStats.documents}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <div className="text-blueGray-500 text-sm mb-1">
                      Taille totale
                    </div>
                    <div className="text-2xl font-bold text-blueGray-800">
                      {dynamicStats.totalSize}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md text-center">
                    <div className="text-blueGray-500 text-sm mb-1">
                      Dernière activité
                    </div>
                    <div className="text-sm font-medium text-blueGray-800">
                      {dynamicStats.lastActivity}
                    </div>
                  </div>
                </div>

                {/* 🔗 Table des documents backend */}
                <div className="mt-12">
                  <h4 className="text-xl font-bold text-blueGray-800 mb-4">
                    📂 Documents sauvegardés (MongoDB)
                  </h4>
                  <DocumentsTable />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Documents;
