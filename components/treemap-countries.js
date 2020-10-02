import React, { useMemo } from "react";

import {
  withFadeIn,
  MtCO2,
  generateTreemap,
  TreemapRow,
  TreemapSVG,
  OTHER_NAME,
} from "./treemap-base";

function TreemapCountries({
  width,
  height,
  chartHeight,
  data,
  progress,
  ...props
}) {
  const treemapData = useMemo(() => {
    const entityData = data.filter((d) => d.value > 10000);
    return generateTreemap(entityData, 1, width, chartHeight);
  }, []);

  const leaves = useMemo(() => {
    return treemapData.leaves();
  });

  const rows = useMemo(() => {
    const otherY0 = leaves[leaves.length - 1].y0;
    return leaves.map((d, idx) => {
      return (
        <TreemapRow
          key={d.data.id}
          text={d.data.id}
          detailText={<MtCO2 value={d.value} units={idx == 0} />}
          width={400}
          fillWidth={400}
          height={d.y1 - d.y0}
          x0={d.x0}
          y0={d.y0}
          status={d.data.id == OTHER_NAME ? "secondary" : "primary"}
          strokeOpacity={
            d.data.id == OTHER_NAME ? 1 : 1 - 0.8 * (d.y0 / otherY0) ** 2
          }
          size={"normal"}
          data={d.data.data}
        />
      );
    });
  }, []);

  return (
    <TreemapSVG width={width} height={height}>
      {rows}
    </TreemapSVG>
  );
}

export default withFadeIn(TreemapCountries);
