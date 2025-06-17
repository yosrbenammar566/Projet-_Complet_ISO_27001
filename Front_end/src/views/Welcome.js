/*eslint-disable*/
/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import { AiOutlineAudit } from "react-icons/ai";
import { GrDocumentPdf } from "react-icons/gr";
import { MdOutlineTimer } from "react-icons/md";
import { FcDataProtection } from "react-icons/fc";
import { MdReportGmailerrorred } from "react-icons/md";
import auditImage from "../assets/img/audit2.jpeg";
import doc1 from "../assets/img/doc1_500x658.webp";
import doc2 from "../assets/img/doc_526x634.jpg";
import doc3 from "../assets/img/doc2.jpg";
import risqueImage from "../assets/img/risque_1781x1232.jpeg";
import loginImg from "../assets/img/login.jpg";
import profileImg from "../assets/img/profile.jpg";


export default function Welcome() {
  return (
    <>
      <IndexNavbar fixed  />
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">
              <h2 className="font-semibold text-5xl text-blueGray-600 fade-in-title">
                Simplifiez vos audits ISO dès maintenant !
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blueGray-500 fade-in-paragraph">
              Découvrez comment notre plateforme simplifie
              la gestion des audits de conformite ISO 27001
              garantissant des processus transparents, des
              intormations automatisées et des mesures de
              sécurité renforcées pour votre organisation.
                
              </p>
             <div className="mt-12">
  <Link
    to="/auth/animated"
    className="get-started welcome-button welcome-button-primary mr-1 mb-1"
  >
    Se connecter
  </Link>
  <Link
    to="/auth/animated"
    className="github-star welcome-button welcome-button-secondary ml-1"
  >
    S'inscrire
  </Link>
</div>
            </div>
          </div>
        </div>

        <img
          className="absolute top-0 b-auto right-0 pt-16 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 max-h-860px blue-glow-image"
          src={require("assets/img/audit2.jpeg")}
          alt="..."
        />
      </section>

      <section className="mt-48 md:mt-40 pb-40 relative bg-blueGray-100">
        <div
          className="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-100 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto -mt-32">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-lightBlue-500">
                <img
                  alt="..."
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
                  className="w-full align-middle rounded-t-lg blue-glow-image"
                />
                <blockquote className="relative p-8 mb-4">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute left-0 w-full block h-95-px -top-94-px"
                  >
                    <polygon
                      points="-30,95 583,95 583,65"
                      className="text-lightBlue-500 fill-current"
                    ></polygon>
                  </svg>
                  <h3 className="text-xl font-bold text-white text-center slide-in-title">
                    Explorez nos fonctionnalités !
                  </h3>
                  <h3 className="text-xl font-bold text-white text-center slide-in-title">
                         Libérer l'essentiel
                  </h3>
                  <p className="text-md font-light mt-2 text-white fade-in-paragraph">
                  Notre plateforme offre une gestion transparente des audits. un suivi optimal 
                  des non-canformites et un controle efficace des documents pour améliorer 
                  votre flux de travail, Découvrez des outils de reporting automatisés et de
                  fonctionnalités de sécurité robustes conçues pour protéger vos données.
                  </p>
                </blockquote>
              </div>
            </div>

            <div className="w-full md:w-6/12 px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                      <AiOutlineAudit className=" text-xl mb-1 font-semibold"/>
                      
                      </div>
                      <p className="text-xl mb-1 font-semibold fade-in-paragraph">
                        Rationalisation des processus d'audit pour plus d'efficacité
                      </p>
                      {/* <p className="mb-4 text-blueGray-500">
                        Notus React comes with a huge number of Fully Coded CSS
                        components.
                      </p> */}
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                      
                      <MdOutlineTimer className=" text-2xl mb-1 font-semibold"/>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold slide-in-title">
                        Informations en temps réel sur les non-conformités 
                      </h6>
                      {/* <p className="mb-4 text-blueGray-500">
                        We also feature many dynamic components for React,
                        NextJS, Vue and Angular.
                      </p> */}
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-6/12 px-4">
                  <div className="relative flex flex-col min-w-0 mt-4">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                      <GrDocumentPdf className=" text-xl mb-1 font-semibold"/>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold slide-in-title">Flux de documents sécurisé et organisé</h6>
                      
                    </div>
                  </div>
                  <div className="relative flex flex-col min-w-0">
                    <div className="px-4 py-5 flex-auto">
                      <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <h6 className="text-xl mb-1 font-semibold slide-in-title">
                        Des rapport simplifiès à portée de main
                      </h6>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto overflow-hidden pb-20">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-4/12 px-12 md:px-4 ml-auto mr-auto mt-48">
              <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                <i className="fas fa-file-alt text-xl"></i>
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal">
                Outils de reporting dynamique
              </h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
                Génerer des rapports complets grace a notre systeme automatisé en vaillantà ce que tout 
                soit document avec précision et présenté d'une manière profesionnelle
              </p>
              
            </div>

            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto mt-32">
              <div className="relative flex flex-col min-w-0 w-full mb-6 mt-48 md:mt-0">
              <img
  alt="..."
  src={doc1}
  className="w-full align-middle rounded-lg absolute shadow-lg -top-160-px left-260-px max-w-210-px blue-glow-image"
/>
<img
  alt="..."
  src={doc2}
  className="w-full align-middle rounded-lg absolute shadow-lg max-w-180-px -top-225-px left-40-px z-2 blue-glow-image"
/>

<img
  alt="..."
  src={doc3}
  className="w-full align-middle rounded-lg absolute shadow-2xl max-w-200-px -left-50-px top-25-px blue-glow-image"
/>

                
              </div>
            </div>
          </div>

        </div>

        <div className="container mx-auto px-4 pb-32 pt-48">
          <div className="items-center flex flex-wrap">
            <div className="w-full md:w-5/12 ml-auto px-12 md:px-4">
              <div className="md:pr-12">
                <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-white">
                
                <MdReportGmailerrorred className="text-3xl"/>
                </div>
                <h3 className="text-3xl font-semibold">
                Analyses de risque
                
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                Les organisations font face chaque jour à des menaces pouvant compromettre la confidentialité,
                 l’intégrité ou la disponibilité de leurs informations. La gestion des risques permet de :

                </p>
                <ul className="list-none mt-6">
                  <li className="py-2">
                    <div className="flex items-center">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-blueGray-50 mr-3">
                          <i className="fas fa-fingerprint"></i>
                        </span>
                      </div>
                      <div>
                        <h4 className="text-blueGray-500">
                        Évaluer les menaces réelles et Identifier les failles potentielles
                        </h4>
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="flex items-center">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-blueGray-50 mr-3">
                        
                        <FcDataProtection className="text-lg" />
                        </span>
                      </div>
                      <div>
                        <h4 className="text-blueGray-500">
                        Mettre en place des mesures de protection adaptées
                        </h4>
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="flex items-center">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blueGray-500 bg-blueGray-50 mr-3">
                          <i className="far fa-paper-plane"></i>
                        </span>
                      </div>
                      <div>
                        <h4 className="text-blueGray-500">
                        Réduire l’impact des incidents de sécurité
                        </h4>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full md:w-6/12 mr-auto px-4 pt-24 md:pt-0">
              <img
                alt="..."
                className="max-w-full align-middle rounded-lg shadow-xl max-h-860px blue-glow-image"
                style={{
                  transform:
                    "scale(1) perspective(1040px) rotateY(-11deg) rotateX(2deg) rotate(2deg)",
                }}
               src={require("assets/img/risque_1781x1232.jpeg")}

              />
            </div>
          </div>
        </div>

        <div className="justify-center text-center flex flex-wrap mt-24">
          <div className="w-full md:w-6/12 px-12 md:px-4">
            <h2 className="font-semibold text-4xl">Libérer de puissantes fonctionnalités de plate-forme</h2>
            <p className="text-lg leading-relaxed mt-4 mb-4 text-blueGray-500">
              Explorez nos fonctionnalités gestion des audit ,
              suivi de la conformité et controle des document qui améliorent votre flux de travail, 
              garantissant sécurité et l'effecacité.
            </p>
          </div>
        </div>
      </section>

      
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>


      <section className="pb-16 bg-blueGray-200 relative pt-32">
        <div
          className="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>

        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center bg-white shadow-xl rounded-lg -mt-64 py-16 px-12 relative z-10">
            <div className="w-full text-center lg:w-8/12">
              
              
              <div className="sm:block flex flex-col mt-10">
                <Link
    to="/auth/animated"
    className="github-star welcome-button welcome-button-secondary ml-1"
  >
    S'inscrire
  </Link>
              </div>
              <div className="text-center mt-16"></div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
