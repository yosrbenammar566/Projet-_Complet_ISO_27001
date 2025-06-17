import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
// import { registerUser, sendCode } from "../../services/ApiUsers";

export default function Register() {
  const history = useHistory();

  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    password: "",
    poste: "",
    verificationCode: "",
  });

  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendVerificationCode = async () => {
    if (!newAccount.email) {
      alert(
        "Veuillez entrer votre email pour recevoir le code de vérification."
      );
      return;
    }
    setSendingCode(true);
    try {
      // TODO: Call backend API to send verification code to newAccount.email
      console.log("Sending verification code to:", newAccount.email);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCodeSent(true);
      alert("Code de vérification envoyé à votre email.");
      history.push("/auth/codeemail");
    } catch (error) {
      console.error("Erreur lors de l'envoi du code de vérification:", error);
      alert("Erreur lors de l'envoi du code de vérification.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Validate verification code and register user
    console.log("Registering user with data:", newAccount);
    alert("Inscription soumise. (Backend integration à faire)");
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    S'inscrire avec
                  </h6>
                </div>
                <div className="btn-wrapper text-center">
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    Client
                  </button>

                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    Autre utilisateur
                  </button>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Bienvenu</small>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="name"
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newAccount.name}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Nom"
                      required
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newAccount.email}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <div className="relativew-full mb-3 flex flex-row gap-4">
                    {/* <input
                      type="text"
                      name="verificationCode"
                      value={newAccount.verificationCode}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 w-auto placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Code de vérification"
                      required={codeSent}
                      disabled={!codeSent}
                    /> */}
                    
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="password"
                    >
                      Mot de passe
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={newAccount.password}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Mot de passe"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="poste"
                    >
                      Poste
                    </label>
                    <select
                      id="poste"
                      name="poste"
                      value={newAccount.poste}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      required
                    >
                      <option value="">-- Sélectionner un poste --</option>
                      <option value="admin">Consultant</option>
                      <option value="auditeur">Auditeur</option>
                      <option value="responsable">Responsable SMSI</option>
                    </select>
                  </div>
                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                      onClick={sendVerificationCode}
                      disabled={sendingCode}
                      // className="ml-2 bg-blueGray-800 w-1/4 text-white active:bg-blueGray-600 text-xs font-bold uppercase px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    >
                      {sendingCode
                        ? "Envoi..."
                        : codeSent
                        ? "Renvoyer"
                        : "Envoyer le code"}
                    </button>
                  </div>

                  {/* <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Créer Compte
                    </button>
                  </div> */}
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <Link to="/auth/forget" className="text-blueGray-200">
                  <small>Mot de passe oublié ?</small>
                </Link>
              </div>
              <div className="w-1/2 text-right">
                <Link to="/auth/login" className="text-blueGray-200">
                  <small>Se connecter</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
