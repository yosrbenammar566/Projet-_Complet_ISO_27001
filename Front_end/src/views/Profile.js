import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";


import Navbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();


  useEffect(() => {
    const userId = "665d2aa91cbd8c7d92eea772"; // À remplacer dynamiquement
    axios
      .get(`http://localhost:5000/api/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSave = () => {
    axios
      .put(`http://localhost:5000/api/users/${user._id}`, user)
      .then(() => alert("✅ Informations enregistrées avec succès !"))
      .catch((err) => console.error(err));
  };

  if (!user) return <div className="text-center mt-10">Chargement...</div>;

  return (
    <>
      <Navbar transparent />
      <main className="profile-page">
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal text-blueGray-700">
                    {user.name}
                  </h3>
                  <div className="text-sm leading-normal mb-2 text-blueGray-400 font-bold uppercase">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                    {user.location}
                  </div>
                  <div className="mb-2 text-blueGray-600 mt-10">
                    <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                    {user.jobTitle}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                    {user.university}
                  </div>
                </div>

                <div className="flex justify-center py-4">
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block text-blueGray-600">
                      {user.friends}
                    </span>
                    <span className="text-sm text-blueGray-400">Friends</span>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <span className="text-xl font-bold block text-blueGray-600">
                      {user.photos}
                    </span>
                    <span className="text-sm text-blueGray-400">Photos</span>
                  </div>
                  <div className="p-3 text-center">
                    <span className="text-xl font-bold block text-blueGray-600">
                      {user.comments}
                    </span>
                    <span className="text-sm text-blueGray-400">Comments</span>
                  </div>
                </div>

                <div className="text-center mt-10">
                  <p className="text-lg leading-relaxed text-blueGray-700">
                    {user.about}
                  </p>
                </div>

                <div className="text-center mt-6 space-x-4">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
                  >
                    💾 Enregistrer
                  </button>

                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-gray-700 text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition"
                  >
                    ⚙️ Paramètres
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Paramètres */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Paramètres du compte</h2>
            <button
              className="w-full text-left mb-2 text-blue-600 hover:underline"
              onClick={() => history.push("/settings")}

            >
              🔒 Modifier le mot de passe
            </button>
            <button
              className="w-full text-left mb-2 text-blue-600 hover:underline"
              onClick={() => alert("📬 Préférences non implémentées")}
            >
              📬 Préférences de notification
            </button>
            <button
              className="w-full text-left mb-2 text-red-600 hover:underline"
              onClick={() => alert("⚠️ Suppression du compte en cours...")}
            >
              🗑️ Supprimer le compte
            </button>
            <div className="text-right">
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
