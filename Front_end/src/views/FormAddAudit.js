import React, { useState } from "react";

export default function FormAddAudit() {
  const [auditData, setAuditData] = useState({
    auditName: "",
    auditType: "internal",
    auditDate: "",
    auditor: "",
    department: "",
    scope: "",
    description: "",
    checklist: [],
    status: "planned",
    priority: "medium",
     category: "",
  });

  const [message, setMessage] = useState(""); // ✅ état pour le message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuditData({
      ...auditData,
      [name]: value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔁 Traduire le type
  let translatedType = "";
    let typeCode = ""; 
  switch (auditData.auditType) {
    case "internal":
      translatedType = "Audit interne";
      typeCode = "type1";
      break;
    case "external":
      translatedType = "Audit de tierce partie";
       typeCode = "type2";
      break;
    case "certification":
      translatedType = "Audit de certification";
      typeCode = "type3";
      break;
    default:
      translatedType = auditData.auditType;
  }

  // 🔁 Traduire la priorité
  let translatedPriority = "";
  switch (auditData.priority) {
    case "low":
      translatedPriority = "Faible";
      break;
    case "medium":
      translatedPriority = "Moyenne";
      break;
    case "high":
      translatedPriority = "Élevée";
      break;
    default:
      translatedPriority = "Moyenne"; // valeur par défaut
  }

  const adaptedData = {
    name: auditData.auditName,
    type: translatedType,
    startDate: auditData.auditDate,
    endDate: auditData.auditDate,
    auditor: auditData.auditor,
    department: auditData.department,
    scope: auditData.scope,
    description: auditData.description,
    checklist: auditData.checklist || [],
    status: "En cours",
    priority: translatedPriority,
    category: auditData.category
  };

  try {
    const response = await fetch("http://localhost:5000/api/audits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adaptedData),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la soumission de l'audit.");
    }

    const result = await response.json();
    console.log("✅ Audit créé :", result);
    window.dispatchEvent(new Event("auditAdded"));

    setMessage("✅ Connexion réussie et audit créé !");

    setAuditData({
      auditName: "",
      auditType: "internal",
      auditDate: "",
      auditor: "",
      department: "",
      scope: "",
      description: "",
      checklist: [],
      status: "planned",
      priority: "medium",
        category: "" 
    });
  } catch (error) {
    console.error("❌ Erreur :", error);
    setMessage("❌ Échec de la connexion au backend.");
  }
};

  return (
    <>
      <section className="relative block py-24 lg:pt-0 bg-white mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-8/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-50">
                <div className="flex-auto p-5 lg:p-10">
                  <h4 className="text-2xl font-semibold text-blueGray-800 text-center">
                    Créer un nouvel audit ISO 27001
                  </h4>
                  <p className="leading-relaxed mt-1 mb-4 text-blueGray-500 text-center">
                    Remplissez ce formulaire pour planifier un nouvel audit de conformité ISO 27001.
                  </p>

                  {/* ✅ Message de succès ou d'erreur */}
                  {message && (
                    <div className={`text-center mb-4 font-bold ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tous les champs restent inchangés */}
                      {/* ... (les inputs du formulaire) */}
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="auditName">
                          Nom de l'audit
                        </label>
                        <input type="text" id="auditName" name="auditName" value={auditData.auditName} onChange={handleChange} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="Ex: Audit de conformité Q1 2023" required />
                      </div>

                      {/* ... autres champs inchangés ... */}

                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="auditType">
                          Type d'audit
                        </label>
                        <select id="auditType" name="auditType" value={auditData.auditType} onChange={handleChange} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" required>
                          <option value="internal">Interne</option>
                          <option value="external">Externe</option>
                          <option value="certification">Certification</option>
                        </select>
                      </div>

                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="auditDate">
                          Date de l'audit
                        </label>
                        <input type="date" id="auditDate" name="auditDate" value={auditData.auditDate} onChange={handleChange} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" required />
                      </div>

                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="auditor">
                          Auditeur
                        </label>
                        <input type="text" id="auditor" name="auditor" value={auditData.auditor} onChange={handleChange} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="Nom de l'auditeur" required />
                      </div>

                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="department">
                          Département
                        </label>
                        <input type="text" id="department" name="department" value={auditData.department} onChange={handleChange} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="Département audité" required />
                      </div>

                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="priority">
                          Priorité
                        </label>
                        <select id="priority" name="priority" value={auditData.priority} onChange={handleChange} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" required>
                          <option value="low">Basse</option>
                          <option value="medium">Moyenne</option>
                          <option value="high">Haute</option>
                        </select>
                      </div>
                      
                    </div>
                    <div className="relative w-full mb-3">
  <label
    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
    htmlFor="category"
  >
    Catégorie
  </label>
  <select
    id="category"
    name="category"
    value={auditData.category}
    onChange={handleChange}
    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
    required
  >
    <option value="">-- Catégorie --</option>
    <option value="Physique">Physique</option>
    <option value="Opérationnelle">Opérationnelle</option>
    <option value="Administrative">Administrative / Organisationnelle</option>
  </select>
</div>

                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="scope">
                        Périmètre de l'audit
                      </label>
                      <input type="text" id="scope" name="scope" value={auditData.scope} onChange={handleChange} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="Ex: Systèmes d'information, Processus RH, etc." required />
                    </div>

                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="description">
                        Description détaillée
                      </label>
                      <textarea id="description" name="description" value={auditData.description} onChange={handleChange} rows="4" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" placeholder="Décrivez l'objectif et le contexte de cet audit..." required />
                    </div>

                    <div className="text-center mt-6">
                      <button className="bg-emerald-500 text-white active:bg-emerald-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg hover:bg-emerald-600 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="submit">
                        Créer l'audit
                      </button>
                      <button className="bg-blueGray-200 text-blueGray-800 active:bg-blueGray-100 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" onClick={() => {
                        setAuditData({
                          auditName: "",
                          auditType: "internal",
                          auditDate: "",
                          auditor: "",
                          department: "",
                          scope: "",
                          description: "",
                          checklist: [],
                          status: "planned",
                          priority: "medium",
                        });
                        setMessage("");
                      }}>
                        Réinitialiser
                      </button>
                    </div>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
