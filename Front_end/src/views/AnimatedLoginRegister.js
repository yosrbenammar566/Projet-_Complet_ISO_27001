// src/components/AnimatedLoginRegister/AnimatedLoginRegister.jsx
import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./AnimatedLoginRegister.css";
import cyberImage from '../../assets/img/images6.jpeg';

export default function AnimatedLoginRegister() {
  console.log("✅ Composant AnimatedLoginRegister chargé");

  const location = useLocation();
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "login";
  const [isRegister, setIsRegister] = useState(mode === "register");
  const [formMode, setFormMode] = useState(isRegister ? "register" : "login");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    poste: "",
    verificationCode: "",
  });
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (res.ok) {
        const data = await res.json();
        alert("Connexion réussie !");
        history.push("/admin/dashboard");
      } else {
        alert("Email ou mot de passe incorrect.");
      }
    } catch (err) {
      alert("Erreur serveur.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: registerData.poste || "user",
      };
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("✅ Compte créé avec succès !");
        history.push("/auth/animated?mode=login");
      } else {
        const error = await res.json();
        alert("Erreur : " + error.message);
      }
    } catch (err) {
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleSendCode = () => {
    if (!registerData.email) {
      alert("Veuillez entrer votre email.");
    
    }
    setSendingCode(true);
    setTimeout(() => {
      setSendingCode(false);
      setCodeSent(true);
      alert("Code de vérification simulé !");
    }, 1000);
  };

  return (
    <>
      <div
        className="login-register-background"
        style={{
          backgroundImage: `url(${cyberImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -2,
        }}
      ></div>

      <div className={`wrapper ${formMode === "register" ? "active" : ""} ${formMode === "code" ? "code-mode" : ""}`}>

        {/* LOGIN FORM */}
        <div className="form-box login">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div className="input-box">
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
              <label>Email</label>
            </div>
            <div className="input-box">
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              <label>Password</label>
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="btn">Login</button>
            <div className="logreg-link">
              <p>
                Don't have an account?{" "}
                <span
                  onClick={() => setIsRegister(true)}
                  style={{ color: "#0ef", cursor: "pointer" }}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </form>
        </div>

        <div className="info login"></div>

        {/* CODE VERIFICATION FORM (AJOUT SANS MODIFICATION) */}
        <div className="form-box code">
          <h1>Vérification</h1>
          <form>
            <div className="input-box">
              <input
                type="text"
                name="verificationCode"
                value={registerData.verificationCode}
                onChange={(e) =>
                  setRegisterData({ ...registerData, verificationCode: e.target.value })
                }
                required
              />
              <label>Code de vérification</label>
            </div>
            <button type="submit" className="btn">Valider le code</button>
            <div className="logreg-link">
              <p>
                Retour ?{" "}
                <span
                  onClick={() => setFormMode("login")}
                  style={{ color: "#0ef", cursor: "pointer" }}
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>

        {/* REGISTER FORM */}
        <div className="form-box register">
          <div className="flex flex-col md:flex-row w-full max-h-screen overflow-y-auto">
            {/* Colonne gauche */}
            <div className="w-full md:w-1/2 p-6 space-y-4">
              <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
              <form onSubmit={handleRegister} className="space-y-4">

                <div className="input-box">
                  <input
                    type="text"
                    name="name"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    required
                  />
                  <label>Nom</label>
                </div>

                <div className="input-box">
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    required
                  />
                  <label>Email</label>
                </div>

                <div className="input-box flex flex-col">
                  <input
                    type="text"
                    name="verificationCode"
                    value={registerData.verificationCode}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        verificationCode: e.target.value,
                      })
                    }
                    disabled={!codeSent}
                    required
                  />
                  <label>Code de vérification</label>
                  <button
                    type="button"
                    className="btn mt-2"
                    onClick={handleSendCode}
                    disabled={sendingCode}
                  >
                    {sendingCode
                      ? "Envoi..."
                      : codeSent
                      ? "Renvoyer"
                      : "Envoyer le code"}
                  </button>
                </div>

                <div className="input-box">
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                    required
                  />
                  <label>Password</label>
                </div>

                <div className="input-box">
                  <select
                    name="poste"
                    value={registerData.poste}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, poste: e.target.value })
                    }
                    required
                  >
                    <option value="">-- Sélectionner un poste --</option>
                    <option value="admin">Consultant</option>
                    <option value="auditeur">Auditeur</option>
                    <option value="responsable">Responsable SMSI</option>
                  </select>
                  <label>Poste</label>
                </div>

                <button type="submit" className="btn w-full">Sign Up</button>
                <div className="logreg-link">
                  <p>
                    Already have an account?{" "}
                    <span
                      onClick={() => setIsRegister(false)}
                      style={{ color: "#0ef", cursor: "pointer" }}
                    >
                      Login
                    </span>
                  </p>
                </div>
              </form>
            </div>

            {/* Colonne droite */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 bg-gray-100 rounded-r-xl">
              <p className="text-lg italic text-gray-600 text-center">
                "Conformité ISO27001, sécurité simplifiée pour tous les acteurs de votre organisation."
              </p>
            </div>
          </div>
        </div>

        <div className="info register">
          <p>"Conformité ISO 27001 simplifiée, sécurité renforcée."</p>
        </div>
      </div>
    </>
  );
}
