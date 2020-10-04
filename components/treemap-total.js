import React from "react";

import { withFadeIn, CO2, MtCO2, TreemapRow, TreemapSVG } from "./treemap-base";

const GLOBAL_TOTAL = 1500000;

function TreemapTotal({
  width,
  height,
  chartHeight,
  data,
  progress,
  ...props
}) {
  return (
    <TreemapSVG width={width} height={height}>
      <TreemapRow
        text={
          <tspan>
            Global cumulative <CO2 /> <tspan dy="-0.3em">emissions</tspan>
          </tspan>
        }
        detailText={<MtCO2 value={GLOBAL_TOTAL} units />}
        width={width}
        fillWidth={width}
        height={chartHeight}
        status={"primary"}
        size={"large"}
        data={{ value: GLOBAL_TOTAL }}
      />
    </TreemapSVG>
  );
}

export default withFadeIn(TreemapTotal);
