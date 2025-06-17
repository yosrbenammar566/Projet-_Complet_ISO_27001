import React, { useState } from "react";

// components

export default function CardSocialTraffic() {
  const [showAll, setShowAll] = useState(false);

  const nonConformities = [
    {
      id: 1,
      description: "Non-conformité 1",
      action: "Action corrective 1",
      evolution: 60,
      color: "bg-red-500",
      bgColor: "bg-red-200",
    },
    {
      id: 2,
      description: "Non-conformité 2",
      action: "Action corrective 2",
      evolution: 70,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-200",
    },
    {
      id: 3,
      description: "Non-conformité 3",
      action: "Action corrective 3",
      evolution: 80,
      color: "bg-purple-500",
      bgColor: "bg-purple-200",
    },
    {
      id: 4,
      description: "Non-conformité 4",
      action: "Action corrective 4",
      evolution: 75,
      color: "bg-lightBlue-500",
      bgColor: "bg-lightBlue-200",
    },
    {
      id: 5,
      description: "Non-conformité 5",
      action: "Action corrective 5",
      evolution: 30,
      color: "bg-emerald-500",
      bgColor: "bg-orange-200",
    },
  ];

  const displayedConformities = showAll
    ? nonConformities
    : nonConformities.slice(0, 2);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Evolution des non-conformités et actions
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <button
                onClick={() => setShowAll(!showAll)}
                className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                {showAll ? "Voir moins" : "Voir tout"}
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Non-conformities table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Non-conformité
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Action
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                  Evolution
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedConformities.map((nc) => (
                <tr key={nc.id}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {nc.description}
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {nc.action}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div className="flex items-center">
                      <span className="mr-2">{nc.evolution}%</span>
                      <div className="relative w-full">
                        <div
                          style={{ width: `${nc.evolution}%` }}
                          className={`overflow-hidden h-2 text-xs flex rounded text-center whitespace-nowrap text-white justify-center ${nc.bgColor}`}
                        >
                          <div
                            className={`shadow-none flex flex-col justify-center ${nc.color}`}
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
// </create_file>
