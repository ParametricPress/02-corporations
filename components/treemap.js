import React, { useState, useRef, useEffect } from "react";

import Context from "./treemap-context";

import TreemapTotal from "./treemap-total";
import TreemapIndividuals from "./treemap-individuals";
import TreemapCountries from "./treemap-countries";
import TreemapCorporationsOverview from "./treemap-corporations-overview";
import TreemapCorporations from "./treemap-corporations";
import { styles } from "./treemap-base";

const TreemapSteps = {
  total: {
    component: TreemapTotal,
    width: "full",
  },
  individuals: {
    component: TreemapIndividuals,
    width: "full",
  },
  countries: {
    component: TreemapCountries,
    width: "full",
  },
  "corporations-overview": {
    component: TreemapCorporationsOverview,
    width: "full",
  },
  corporations: {
    component: TreemapCorporations,
    width: "split",
  },
  "corporations-exxon": {
    component: TreemapCorporations,
    width: "split",
    props: { highlight: "exxon" },
  },
  "corporations-state": {
    component: TreemapCorporations,
    props: { highlight: "state" },
    width: "split",
  },
  "corporations-investor": {
    component: TreemapCorporations,
    props: { highlight: "investor" },
    width: "split",
  },
  "deception-api": {
    component: TreemapCorporations,
    props: { highlight: "deception-api" },
    width: "split",
  },
  "deception-accce": {
    component: TreemapCorporations,
    props: { highlight: "deception-accce" },
    width: "split",
  },
};

// height = total svg height
// chartHeight = height of actual rectangular chart body
function Treemap({ step, width = 400, height = 700 }) {
  if (!step || !step.name || !TreemapSteps[step.name]) return null;

  const [activeRow, setActiveRow] = useState(null);
  const [lastWidth, setLastWidth] = useState("full");
  const mouseXY = useRef({ x: 0, y: 0 });

  const chartHeight = height - 100;

  const treemapStep = TreemapSteps[step.name];

  useEffect(() => {
    setLastWidth(TreemapSteps[step.name].width);
  }, [step.name]);

  return (
    <div className="treemap-container" style={{ ...styles }}>
      <Context.Provider
        value={{
          activeRow,
          setActiveRow,
          mouseXY,
          lastWidth,
        }}
      >
        <treemapStep.component
          data={step.data}
          width={width}
          height={height}
          chartHeight={chartHeight}
          {...(treemapStep.props || {})}
        />
      </Context.Provider>
    </div>
  );
}

export default Treemap;
