import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";

export default function CodeEmail() {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);
  const history = useHistory();

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);
      // Move focus to next input if value entered
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
    // TODO: Implement resend code logic
  };

  const handleVerify = () => {
    const enteredCode = code.join("");
    if (enteredCode.length < 4) {
      alert("Veuillez entrer le code complet à 4 chiffres.");
      return;
    }
    alert(`Code vérifié: ${enteredCode}`);
    // TODO: Implement verification logic
    // Redirect to login page after successful verification
    history.push("/auth/login");
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form>
                <div className="relative w-full mb-3 mt-4">
                  <div className="max-w-md mx-auto mt-20 p-6 border border-green-400 rounded-md">
                    <h2 className="text-center text-xl font-bold mb-4">
                      Vérifiez votre adresse mail !
                    </h2>
                    <p className="text-center mb-6 text-sm text-gray-700">
                      Nous avons envoyé un code de confirmation à quatre
                      chiffres à <strong>bensalahors013@gmail.com</strong>.{" "}
                      Entrez ci-dessous pour confirmer votre adresse e-mail.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center space-x-4 mb-4">
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(e, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      ref={(el) => (inputsRef.current[idx] = el)}
                      className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  ))}
                </div>
              </form>
            </div>
            <div className="text-center mb-4 text-sm">
              <span>vous n'avez pas reçu votre code ? </span>
              <button
                onClick={handleResend}
                className="text-green-500 underline hover:text-green-700"
              >
                Renvoyer
              </button>
            </div>
            <button
              onClick={handleVerify}
              className="w-full bg-green-400 text-white py-2 rounded-md hover:bg-green-500 transition-colors"
            >
              Vérifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
