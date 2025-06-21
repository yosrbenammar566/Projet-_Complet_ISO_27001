import React, { useState, useEffect, useRef, useContext } from "react";
import { CiImport } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import { NonConformityContext } from "../../contexts/NonConformityContext";
import { ChecklistContext } from "../../contexts/ChecklistContext";

export default function AuditChecklist() {
  const [selectedControl, setSelectedControl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { saveCurrentChecklist } = useContext(ChecklistContext);
  // console.log('ChecklistContext:', ChecklistContext);

  const [checklistItems, setChecklistItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [auditId, setAuditId] = useState("");
  const [globalChecklist, setGlobalChecklist] = useState(() => {
    const saved = localStorage.getItem("globalChecklist");
    return saved ? JSON.parse(saved) : {};
  });
  const [savedChecklists, setSavedChecklists] = useState(() => {
    const saved = localStorage.getItem("savedChecklists");
    return saved ? JSON.parse(saved) : [];
  });
  const fileInputRef = useRef(null);

  const [checklistsConformes, setChecklistsConformes] = useState([]);
  const [checklistsNonConformes, setChecklistsNonConformes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    fetch("http://localhost:5000/api/checklists")
      .then((res) => res.json())
      .then((data) => setChecklists(data))
      .catch((err) =>
        console.error("Erreur de chargement des checklists :", err)
      );
  }, []);

  const isoCategories = {
    Operationnelle: [
      { id: "A.5.1", name: "Politiques de sécurité de l'information" },
      { id: "A.5.2", name: "Rôles et responsabilités" },
    ],
    "A.Humen": [
      { id: "A.6.1", name: "Organisation interne" },
      { id: "A.6.2", name: "Télébureau et télétravail" },
    ],
    physique: [
      { id: "A.7.1", name: "Sélection" },
      { id: "A.7.2", name: "Formation et sensibilisation" },
      { id: "A.7.3", name: "Processus disciplinaire" },
    ],
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() === "") return;

    const newChecklistItem = {
      id: Date.now(),
      text: newItem,
      status: "pending",
    };

    setChecklistItems([...checklistItems, newChecklistItem]);
    setNewItem("");
  };

  const handleStatusChange = (itemId, newStatus) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleConstatChange = (itemId, value) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === itemId ? { ...item, constat: value } : item
      )
    );
  };

  const handleRecommendationChange = (itemId, value) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === itemId ? { ...item, recommendation: value } : item
      )
    );
  };

  const handlePreuveChange = (itemId, value) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === itemId ? { ...item, preuve: value } : item
      )
    );
  };

  const handleImport = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      console.log("Import du fichier:", file.name);
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
    }
  };
  const handleSaveChecklist = async () => {
    try {
      const updatedItems = checklistItems.map((item) => ({
        ...item,
        category: selectedCategory || item.category || "Sans catégorie",
        control: selectedControl || item.control || "Sans contrôle",
      }));

      const response = await fetch("http://localhost:5000/api/checklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ control: selectedControl, items: updatedItems }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      // ✅ Enregistre dans le state local
      const newChecklist = await response.json();
      setChecklists((prev) => [...prev, newChecklist]);
      setSelectedChecklist(newChecklist);
      setShowChecklistModal(true);

      // 🔥 AJOUT : Génère automatiquement les non-conformités
      const nonConformingItems = updatedItems.filter(
        (item) => item.status === "non-compliant"
      );
      for (const item of nonConformingItems) {
        const newNC = {
          title: item.text,
          control: item.control,
          severity: "major",
          responsible: "À désigner",
          discoveredDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          description: item.constat || "Non-conformité détectée",
          correctiveAction: item.recommendation || "",
          verificationMethod: "",
          verificationDate: null,
          notes: item.preuve || "",
          status: "open",
        };

        await fetch("http://localhost:5000/api/nonconformities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNC),
        });
      }

      toast.success("✅ Checklist et non-conformités enregistrées");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  const [checklists, setChecklists] = useState([]);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const { addNonConformity } = useContext(NonConformityContext);
  //   const [showSaveModal, setShowSaveModal] = useState(false);
  // const [checklistName, setChecklistName] = useState("");

  // const handleSaveChecklist1 = () => {
  //   setShowSaveModal(true);
  // };

  // const confirmSaveChecklist = () => {
  //   try {
  //     setGlobalChecklist((prev) => {
  //       // Update checklistItems to set category and control for each item
  //       const updatedItemsWithCategoryAndControl = checklistItems.map(
  //         (item) => ({
  //           ...item,
  //           category: selectedCategory || item.category || "Sans catégorie",
  //           control: selectedControl || item.control || "Sans contrôle",
  //         })
  //       );

  //       // Merge updatedItemsWithCategoryAndControl with existing items for the selected control
  //       const existingControls = prev[selectedCategory] || {};
  //       const mergedControls = {
  //         ...existingControls,
  //         [selectedControl]: updatedItemsWithCategoryAndControl,
  //       };

  //       const updatedGlobalChecklist = {
  //         ...prev,
  //         [selectedCategory]: mergedControls,
  //       };

  //       // Defensive check: ensure controls is an object and items is an array
  //       const allItems = Object.entries(updatedGlobalChecklist).flatMap(
  //         ([category, controls]) =>
  //           controls && typeof controls === "object"
  //             ? Object.entries(controls).flatMap(([control, items]) =>
  //                 Array.isArray(items)
  //                   ? items.map((item) => ({
  //                       ...item,
  //                       category: category,
  //                       control: control,
  //                     }))
  //                   : []
  //               )
  //             : []
  //       );

  //       const newChecklist = {
  //         id: Date.now(),
  //         name: checklistName || "Checklist sans nom",
  //         items: allItems,
  //       };

  //       saveCurrentChecklist(newChecklist.name, allItems);
  //       toast.success("Checklist enregistrée dans le contexte !");
  //        console.log("Checklist sauvegardée")
  //       return updatedGlobalChecklist;
  //     });
  //   } catch (error) {
  //     console.error("Erreur lors de la sauvegarde :", error);
  //     alert("Une erreur est survenue lors de la sauvegarde.");
  //   }
  //   setShowSaveModal(false);
  //   setChecklistName("");
  // };


  return (
    <div className="page-fade-in">
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white mt-50 green-glow-container">
        <div className="flex-auto p-5 lg:p-10">
          <h4 className="text-2xl font-semibold text-blueGray-800">
            Checklist d'audit ISO 27001
          </h4>
          <p className="leading-relaxed mt-1 mb-4 text-blueGray-500">
            Sélectionnez une mesure de l'Annexe A et créez une checklist
            personnalisée pour votre audit.
          </p>

          <div className="relative w-full mb-6">
            {/* Choix de la catégorie */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Catégorie ISO 27001
              </label>
              <select
                className="w-full p-2 rounded border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                value={selectedCategory}
                onChange={(e) => {
                  if (selectedControl && selectedCategory) {
                    setGlobalChecklist((prev) => {
                      const updatedCategory = {
                        ...(prev[selectedCategory] || {}),
                        [selectedControl]: checklistItems,
                      };
                      return {
                        ...prev,
                        [selectedCategory]: updatedCategory,
                      };
                    });
                  }
                  setSelectedCategory(e.target.value);
                  setSelectedControl("");
                }}
              >
                <option value="">Sélectionnez une catégorie</option>
                {Object.keys(isoCategories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Choix du contrôle */}
            {selectedCategory && (
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Mesure ISO 27001
                </label>
                <select
                  className="w-full p-2 rounded border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white text-sm shadow focus:outline-none focus:ring"
                  value={selectedControl}
                  onChange={(e) => {
                    const controlValue = e.target.value;

                    // 1. Met à jour immédiatement le contrôle
                    setSelectedControl(controlValue);

                    // 2. Sauvegarde la checklist précédente (si elle existe)
                    if (selectedCategory && selectedControl) {
                      setGlobalChecklist((prev) => {
                        const updatedCategory = {
                          ...(prev[selectedCategory] || {}),
                          [selectedControl]: checklistItems,
                        };
                        const updated = {
                          ...prev,
                          [selectedCategory]: updatedCategory,
                        };
                        localStorage.setItem(
                          "globalChecklist",
                          JSON.stringify(updated)
                        );
                        return updated;
                      });
                    }

                    // 3. Vérifie s’il existe déjà une checklist
                    const existing =
                      globalChecklist[selectedCategory]?.[controlValue];

                    // 4. Affiche les 3 questions si aucune checklist trouvée
                    if (!existing || existing.length === 0) {
                      setChecklistItems([
                        {
                          id: 1,
                          text: "La politique est-elle documentée et approuvée par la direction?",
                          status: "pending",
                        },
                        {
                          id: 2,
                          text: "La politique est-elle communiquée à tous les employés?",
                          status: "pending",
                        },
                        {
                          id: 3,
                          text: "La politique est-elle revue à intervalles planifiés?",
                          status: "pending",
                        },
                      ]);
                    } else {
                      setChecklistItems(existing);
                    }
                  }}
                >
                  <option value="">Sélectionnez une mesure</option>
                  {isoCategories[selectedCategory].map((ctrl) => (
                    <option key={ctrl.id} value={ctrl.id}>
                      {ctrl.id} - {ctrl.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {selectedControl && (
            <React.Fragment>
              <div className="mb-6">
                <h5 className="text-lg font-semibold text-blueGray-700 mb-3">
                  Questions de vérification
                </h5>

                <div className="bg-white rounded shadow-md p-4 mb-4">
                  <form onSubmit={handleAddItem} className="flex mb-4">
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 mr-2"
                      placeholder="Ajouter une nouvelle question..."
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    >
                      Ajouter
                    </button>
                  </form>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white  ">
                      <thead>
                        <tr>
                          <th className="py-4 px-6 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                            Question
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                            Statut
                          </th>

                          <th className="py-4 px-6 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                            Constat
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                            Recommendation
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                            Preuve
                          </th>
                          <th className="py-4 px-6 text-left text-xs font-medium text-blueGray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {checklistItems.map((item) => (
                          <tr
                            key={item.id}
                            className="border-t border-blueGray-200"
                          >
                            <td className="py-3 px-4 text-sm text-blueGray-700">
                              {item.text}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <select
                                className="border-0 px-2 py-1 text-sm rounded focus:outline-none focus:ring"
                                value={item.status}
                                onChange={(e) =>
                                  handleStatusChange(item.id, e.target.value)
                                }
                              >
                                <option value="pending">En attente</option>
                                <option value="compliant">Conforme</option>
                                <option value="non-compliant">
                                  Non conforme
                                </option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <textarea
                                type="text"
                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 mr-2"
                                placeholder="Ajouter un constat..."
                                value={item.constat || ""}
                                onChange={(e) =>
                                  handleConstatChange(item.id, e.target.value)
                                }
                              />
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <textarea
                                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 mr-2"
                                placeholder="Recommandation auditeur"
                                value={item.recommendation || ""}
                                onChange={(e) =>
                                  handleRecommendationChange(
                                    item.id,
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <textarea
                                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 mr-2"
                                  placeholder="Preuve"
                                  value={item.preuve || ""}
                                  onChange={(e) =>
                                    handlePreuveChange(item.id, e.target.value)
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="text-blueGray-600 hover:text-blueGray-800 flex items-center space-x-1"
                                >
                                  <CiImport className="font-medium text-xl text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
                                </button>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.jpg,.png"
                                  onChange={handleImport}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() =>
                                  setChecklistItems(
                                    checklistItems.filter(
                                      (i) => i.id !== item.id
                                    )
                                  )
                                }
                                title="Supprimer"
                              >
                                <RiDeleteBin5Fill className="text-lg text-red-500 hover:text-red-700" />
                              </button>
                              <button className="p-2" title="Modifier">
                                <FaEdit className="text-lg text-emerald-500 hover:text-emerald-700" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button
                    className="welcome-button welcome-button-primary mr-1 mb-1"
                    onClick={handleSaveChecklist}
                  >
                    Sauvegarder la checklist
                  </button>
                </div>
                {/* {showSaveModal && (
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
                        maxWidth: "40rem",
                        width: "100%",
                        padding: "2rem",
                        overflow: "auto",
                        maxHeight: "80vh",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      <h3 className="text-lg font-semibold mb-4">
                        Nom de la checklist
                      </h3>
                      <input
                        type="text"
                        value={checklistName}
                        onChange={(e) => setChecklistName(e.target.value)}
                        placeholder="Entrez le nom de la checklist"
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => {
                            setShowSaveModal(false);
                            setChecklistName("");
                          }}
                          className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={confirmSaveChecklist}
                          className="welcome-button welcome-button-primary"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  </div>
                )} */}

              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
// </create_file>
