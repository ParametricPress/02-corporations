import React, { useMemo } from "react";

import {
  withFadeIn,
  MtCO2,
  generateTreemap,
  TreemapRow,
  TreemapSVG,
  OTHER_NAME,
} from "./treemap-base";

import TreemapCorporationsOverview from "./treemap-corporations-overview";

function TreemapCorporations({ width, height, data, progress, ...props }) {
  // we only use the y-values from the d3 treemap;
  // the x-values are all managed internally here
  const overviewWidth = 50;
  const detailWidth = 300;
  const detailOffset = 100;

  const detailData = useMemo(() => {
    // Extract the top 20 corporate entities. Excluding national governments
    const entityData = data
      .filter((d) => d.entity_type !== "State")
      .slice(0, 20);
    return generateTreemap(entityData, 0);
  }, []);

  const detailLeaves = useMemo(() => {
    return detailData.leaves();
  }, []);

  // TODO: DRY this
  const overviewData = useMemo(() => {
    const entityData = [
      {
        entity: "Top 20 fossil fuel corporations",
        value: 468978,
      },
    ];
    return generateTreemap(entityData, 1);
  }, []);

  const overviewRows = overviewData.leaves().map((d, idx) => {
    return (
      <TreemapRow
        key={d.data.id}
        text={d.data.id}
        detailText={<MtCO2 value={d.value} units={idx == 0} />}
        width={overviewWidth}
        height={d.y1 - d.y0}
        x0={0}
        y0={d.y0}
        status={d.data.id === OTHER_NAME ? "secondary" : "primary"}
        size={"large"}
        hideText={true}
      />
    );
  });

  const detailRows = useMemo(() => {
    const otherY0 = detailLeaves[detailLeaves.length - 1].y0;
    return detailLeaves.map((d, idx) => {
      return (
        <TreemapRow
          key={d.data.id}
          text={d.data.id}
          detailText={<MtCO2 value={d.value} units={idx == 0} />}
          width={detailWidth}
          height={d.y1 - d.y0}
          x0={100}
          y0={d.y0}
          status={d.data.id === OTHER_NAME ? "secondary" : "primary"}
          strokeOpacity={
            d.data.id == OTHER_NAME ? 1 : 1 - 0.8 * (d.y0 / otherY0)
          }
          size={"normal"}
          data={d.data.data}
        />
      );
    });
  }, []);

  const annotationLineWidth = 2;

  const topLine = (
    <line
      x1={overviewWidth}
      y1={annotationLineWidth}
      x2={detailOffset}
      y2={annotationLineWidth}
      style={{
        stroke: "#adadad",
        strokeWidth: annotationLineWidth,
        strokeDasharray: 3,
      }}
    />
  );

  const bottomLine = (
    <line
      x1={overviewWidth}
      y1={overviewData.leaves()[0].y1}
      x2={detailOffset}
      y2={height}
      style={{
        stroke: "#adadad",
        strokeWidth: annotationLineWidth,
        strokeDasharray: 3,
      }}
    />
  );

  return (
    <g>
      <TreemapSVG width={width} height={height}>
        {overviewRows}
        {detailRows}
        {topLine}
        {bottomLine}
      </TreemapSVG>
    </g>
  );
}

export default withFadeIn(TreemapCorporations);
