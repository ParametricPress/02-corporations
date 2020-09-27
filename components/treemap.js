import React, { useState, useRef } from "react";

import Context from "./treemap-context";

import TreemapTotal from "./treemap-total";
import TreemapIndividuals from "./treemap-individuals";
import TreemapCountries from "./treemap-countries";
import TreemapCorporationsOverview from "./treemap-corporations-overview";
import TreemapCorporations from "./treemap-corporations";
import TreemapCorporationsDetail from "./treemap-corporations-detail";
import { styles } from "./treemap-base";

const TreemapSteps = {
  total: TreemapTotal,
  individuals: TreemapIndividuals,
  countries: TreemapCountries,
  "corporations-overview": TreemapCorporationsOverview,
  corporations: TreemapCorporations,
  "corporations-detail": TreemapCorporationsDetail,
  "corporations-state": TreemapCorporations,
  "corporations-investor": TreemapCorporations,
  deception: TreemapCorporations,
};

function Treemap({ step, width = 400, height = 600 }) {
  if (!step || !step.name || !TreemapSteps[step.name]) return null;

  const [activeRow, setActiveRow] = useState(null);
  const mouseXY = useRef({ x: 0, y: 0 });

  const TreemapStep = TreemapSteps[step.name];

  return (
    <div
      className="treemap-container"
      style={{ transform: "translate(0, -50px)", ...styles }}
    >
      <Context.Provider
        value={{
          activeRow,
          setActiveRow,
          mouseXY,
        }}
      >
        <TreemapStep data={step.data} width={width} height={height} />
      </Context.Provider>
    </div>
  );
}

export default Treemap;
