import React, { useState, useEffect } from "react";
import axios from "axios";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import fr from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../assets/styles/modal.css";
import { toast } from "react-toastify";

// Configuration de la localisation
const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Événements de démonstration
const initialEvents = [
  {
    id: 1,
    title: "Audit Interne",
    start: new Date(2025, 3, 10),
    end: new Date(2025, 3, 12),
    type: "audit",
    priority: "high",
  },
  {
    id: 2,
    title: "Correction de non-conformité",
    start: new Date(2025, 3, 15),
    end: new Date(2025, 3, 20),
    type: "correction",
    priority: "medium",
  },
  {
    id: 3,
    title: "Réunion de suivi",
    start: new Date(2025, 3, 22),
    end: new Date(2025, 3, 22),
    type: "meeting",
    priority: "low",
  },
];

export default function CalendarAudit() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState(initialEvents);

  const [view, setView] = useState("month");
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
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
  });

useEffect(() => {
  const fetchEvents = async () => {
    try {
      console.log("📡 Requête envoyée vers /api/calendrier");

      const response = await axios.get("http://localhost:5000/api/calendar-events");

 // à adapter selon ton backend
      const eventsFromServer = response.data.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(eventsFromServer);
      console.log("✅ Événements reçus depuis backend :", eventsFromServer);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      toast.error("❌ Échec du chargement des événements !");
    }
  };

  fetchEvents();
}, []);


  // Filtrer les événements en fonction de la recherche
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigation dans le calendrier
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Style personnalisé pour les événements
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3182ce"; // Bleu par défaut

    switch (event.type) {
      case "audit":
        backgroundColor = event.priority === "high" ? "#F56565" : "#4299E1";
        break;
      case "correction":
        backgroundColor = event.priority === "high" ? "#9F7AEA" : "#48BB78";
        break;
      case "meeting":
        backgroundColor = "#718096";
        break;
      default:
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const handleDateClick = (slotInfo) => {
    const date = slotInfo.start || slotInfo;
    setSelectedDate(date);
    setAuditData((prev) => ({
      ...prev,
      auditDate: format(date, "yyyy-MM-dd"),
    }));
    setShowModal(true);
  };

  const handleSelectSlot = (slotInfo) => {
    handleDateClick(slotInfo);
  };

 const handleSelectEvent = (event) => {
  const confirmDelete = window.confirm(`🗑️ Supprimer l'événement : "${event.title}" ?`);
  if (confirmDelete) {
    handleDeleteEvent(event._id);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuditData({
      ...auditData,
      [name]: value,
    });
  };
  

 const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔧 Créer une date JS complète avec heure
  const date = new Date(auditData.auditDate);
  date.setHours(12, 0, 0); // Ajoute 12h (midi) pour éviter le problème d'affichage

  const newEvent = {
    title: auditData.auditName,
    start: date,
    end: date,
    type: auditData.auditType,
    priority: auditData.priority,
    auditor: auditData.auditor,
    department: auditData.department,
    description: auditData.description,
    scope: auditData.scope,
    checklist: auditData.checklist,
    status: auditData.status,
  };

  try {
    const response = await axios.post("http://localhost:5000/api/calendar-events", newEvent);


    // 🔍 Vérifie que les dates reviennent bien dans la réponse
    const savedEvent = {
      ...newEvent, // ← Utilise newEvent directement
      _id: response.data._id // on garde l'id retourné du backend
    };

    setEvents([...events, savedEvent]);
    toast.success("✅ Audit planifié avec succès !");
    setShowModal(false);

    // Réinitialiser le formulaire
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
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'événement:", error);
    toast.error("❌ Échec de la planification !");
  }
};


const handleDeleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/calendrier/${eventId}`);
    setEvents(events.filter((e) => e._id !== eventId));
    toast.success("🗑️ Événement supprimé !");
  } catch (error) {
    console.error("Erreur suppression :", error);
    toast.error("❌ Suppression échouée !");
  }
};

console.log("Événements affichés :", events);
  return (
    <div className="flex flex-wrap ">
      <div className="w-full px-4 ">
        <div className="page-fade-in">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded green-glow-container ">
            <div className="p-6 ">
              {/* En-tête avec les boutons et la recherche */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                  <button
                    onClick={goToPreviousMonth}
                    className="bg-white text-blueGray-700 border border-blueGray-200 px-4 py-2 rounded hover:bg-blueGray-50"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={goToToday}
                    className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
                  >
                    Aujourd'hui
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="bg-white text-blueGray-700 border border-blueGray-200 px-4 py-2 rounded hover:bg-blueGray-50"
                  >
                    Suivant
                  </button>
                </div>

                <div className="flex items-center">
                  <div className="relative flex w-96">
                    <input
                      type="text"
                      placeholder="Rechercher un audit..."
                      className="w-full px-4 py-2 rounded-lg border border-blueGray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 slide-in-title"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute right-3 top-2.5 text-blueGray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setView("month")}
                    className={`px-4 py-2 rounded ${
                      view === "month"
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-blueGray-700 border border-blueGray-200"
                    }`}
                  >
                    Mois
                  </button>
                  <button
                    onClick={() => setView("week")}
                    className={`px-4 py-2 rounded ${
                      view === "week"
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-blueGray-700 border border-blueGray-200"
                    }`}
                  >
                    Semaine
                  </button>
                  <button
                    onClick={() => setView("day")}
                    className={`px-4 py-2 rounded ${
                      view === "day"
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-blueGray-700 border border-blueGray-200"
                    }`}
                  >
                    Jour
                  </button>
                </div>
              </div>

              {/* Modal */}
              {showModal && (
                <div className="modal-overlay">
                  <div className="modal-content modal-container">
                    {/* Modal Header */}
                    <div className="modal-header">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Planifier un audit
                        </h3>
                        <button
                          onClick={() => setShowModal(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                      <div className="mb-4">
                        <div className="flex items-center text-gray-600">
                          <span className="text-lg mr-2">📅</span>
                          <span>
                            Date sélectionnée :{" "}
                            {selectedDate?.toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} id="auditForm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-gray-600 text-xs font-bold mb-2">
                              Nom de l'audit
                            </label>
                            <input
                              type="text"
                              name="auditName"
                              value={auditData.auditName}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: Audit de conformité Q1 2023"
                              required
                            />
                          </div>

                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-gray-600 text-xs font-bold mb-2">
                              Type d'audit
                            </label>
                            <select
                              name="auditType"
                              value={auditData.auditType}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="internal">Interne</option>
                              <option value="external">Externe</option>
                              <option value="certification">
                                Certification
                              </option>
                            </select>
                          </div>

                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-gray-600 text-xs font-bold mb-2">
                              Priorité
                            </label>
                            <select
                              name="priority"
                              value={auditData.priority}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="low">Basse</option>
                              <option value="medium">Moyenne</option>
                              <option value="high">Haute</option>
                            </select>
                          </div>

                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-gray-600 text-xs font-bold mb-2">
                              Auditeur
                            </label>
                            <input
                              type="text"
                              name="auditor"
                              value={auditData.auditor}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Nom de l'auditeur"
                              required
                            />
                          </div>
                        </div>

                        <div className="relative w-full mb-3">
                          <label className="block uppercase text-gray-600 text-xs font-bold mb-2">
                            Département
                          </label>
                          <input
                            type="text"
                            name="department"
                            value={auditData.department}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Département audité"
                            required
                          />
                        </div>

                        <div className="relative w-full mb-3">
                          <label className="block uppercase text-gray-600 text-xs font-bold mb-2">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={auditData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Décrivez l'objectif et le contexte de cet audit..."
                            required
                          />
                        </div>
                      </form>
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          supprimer 🗑️
                        </button>
                        <button
                          type="submit"
                          form="auditForm"
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Planifier l'audit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendrier */}
              <div className="bg-white rounded shadow">
                <Calendar
                  localizer={localizer}
                  events={filteredEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 700 }}
                  date={currentDate}
                  onNavigate={(date) => setCurrentDate(date)}
                  view={view}
                  onView={setView}
                  eventPropGetter={eventStyleGetter}
                  selectable={true}
                  defaultView="month"
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  dayPropGetter={(date) => ({
                    className: "cursor-pointer hover:bg-gray-50",
                  })}
                  components={{
                    dateCellWrapper: (props) => (
                      <div
                        onClick={() => handleDateClick(props.value)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        {props.children}
                      </div>
                    ),
                  }}
                  views={["month", "week", "day"]}
                  culture="fr"
                  messages={{
                    next: "Suivant",
                    previous: "Précédent",
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                    agenda: "Agenda",
                    date: "Date",
                    time: "Heure",
                    event: "Événement",
                    noEventsInRange: "Aucun événement dans cette période",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
