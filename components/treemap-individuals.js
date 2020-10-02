import React from "react";

import { withFadeIn, TreemapMatrix, TreemapSVG } from "./treemap-base";

function TreemapIndividuals({
  width,
  height,
  chartHeight,
  data,
  progress,
  ...props
}) {
  return (
    <TreemapSVG width={width} height={height}>
      <TreemapMatrix
        width={width}
        height={chartHeight}
        cellWidth={10}
        cellHeight={10}
      />
    </TreemapSVG>
  );
}

export default withFadeIn(TreemapIndividuals);
