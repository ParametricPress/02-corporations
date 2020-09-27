import React, { useMemo } from "react";

import {
  withFadeIn,
  MtCO2,
  generateTreemap,
  TreemapRow,
  TreemapSVG,
  OTHER_NAME,
} from "./treemap-base";

function TreemapCorporationsOverview({
  width,
  height,
  data,
  progress,
  ...props
}) {
  const treemapData = useMemo(() => {
    const entityData = [
      {
        entity: "Top 20 fossil fuel corporations",
        value: 468978,
      },
    ];
    return generateTreemap(entityData, 1);
  }, []);

  return (
    <TreemapSVG width={width} height={height}>
      {treemapData.leaves().map((d, idx) => {
        return (
          <TreemapRow
            key={d.data.id}
            text={d.data.id}
            detailText={<MtCO2 value={d.value} units={idx == 0} />}
            width={d.x1 - d.x0}
            height={d.y1 - d.y0}
            x0={d.x0}
            y0={d.y0}
            status={d.data.id === OTHER_NAME ? "secondary" : "primary"}
            size={"large"}
          />
        );
      })}
    </TreemapSVG>
  );
}

export default withFadeIn(TreemapCorporationsOverview);
