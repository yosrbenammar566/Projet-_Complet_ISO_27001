import React, { useState, useRef, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import cyberImage from "../../assets/img/images6.jpeg";
import "./AnimatedLoginRegister.css"; // Ton fichier CSS déjà stylisé
import { verifyCode } from "Services/ApiUsers";

export default function CodeEmail() {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const email = location.state?.email || ""
    console.log(location)
    if (!email) {
      debugger
      alert("Aucune adresse e-mail fournie. Veuillez revenir en arrière.");
      history.push("/auth/animated");
      return;
    }
    setEmail(email);
  }, []);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);
      if (val && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    alert("Code renvoyé à votre adresse e-mail.");
  };

  const handleVerify = async () => {
    try {
      const enteredCode = code.join("");
      if (enteredCode.length < 4) {
        alert("Veuillez entrer le code complet à 4 chiffres.");
        return;
      }
      await verifyCode(email, enteredCode)
      alert(`Code vérifié: ${enteredCode}`);
      history.push("/auth/animated");
    } catch (error) {
      console.error("Erreur lors de la vérification du code:", error);
      alert("Erreur lors de la vérification du code.");
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
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

      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 
                          shadow-xl rounded-lg glassmorphism border border-green-400">
            <div className="flex-auto px-6 py-8">
              <h2 className="text-center text-white text-2xl font-bold mb-4 ">
                Vérifiez votre adresse mail !
              </h2>
              <p className="text-center text-sm text-white mb-6">
                Nous avons envoyé un code de confirmation à quatre chiffres à <br />
                <strong className="text-green-300 logreg-link">{email}</strong>.
                <br /> Entrez le code ci-dessous pour confirmer votre adresse e-mail.
              </p>

              <div className="flex justify-center space-x-4 mb-6">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    className="w-12 h-12 text-center border border-green-400 rounded-md text-lg 
                               bg-transparent focus:outline-none focus:ring-2 focus:ring-green-300
                               placeholder-gray-400 shadow-md"
                  />
                ))}
              </div>

              <div className="text-center mb-4 text-sm text-white">
                <span>Vous n'avez pas reçu votre code ? </span>
                <button
                  onClick={handleResend}
                  className="text-white underline hover:text-green-600"
                >
                  Renvoyer
                </button>
              </div>

              <button
                onClick={handleVerify}
                className="w-full bg-green-400 text-white py-2 rounded-md 
                           hover:bg-green-500 transition duration-300 ease-in-out font-semibold"
              >
                Vérifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
