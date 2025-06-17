import React from "react";

// components

import CardStats from "components/Cards/CardStats.js";

export default function HeaderStats() {
  return (
    <>
      {/* Header */}
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap justify-center ">
              <div className="w-full lg:w-6/12 xl:w-3/12 mx-4  hover:-mt-4 relative flex flex-col min-w-0 break-words 
                    bg-pink-500 w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150">
                <CardStats
                  statSubtitle="NC MAJEUR"
                  statTitle="20"
                  statArrow="up"
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron="Audit interne"
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 mx-4  hover:-mt-4 relative flex flex-col min-w-0 break-words 
                   bg-pink-500 w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150">
                <CardStats
                  statSubtitle="NC EN RETARD"
                  statTitle="5"
                  statArrow="down"
                  statPercent=""
                  statPercentColor="text-red-500"
                  statDescripiron="dpuis 30/05/2025"
                  statIconName="fas fa-chart-pie"
                  statIconColor="bg-orange-500"
                />
              </div>
                 <div className="w-full lg:w-6/12 xl:w-3/12 mx-4  hover:-mt-4 relative flex flex-col min-w-0 break-words 
                    bg-pink-500 w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150">
                <CardStats
                  statSubtitle="ACTIONS EN COURS"
                  statTitle="50%"
                  statArrow="up"
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron="Audit interne"
                  statIconName="fas fa-percent"
                  statIconColor="bg-lightBlue-500"
                />
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </>
  );
}
