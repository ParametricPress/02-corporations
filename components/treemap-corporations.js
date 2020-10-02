import React, { useMemo, useContext, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import Context from "./treemap-context";

import {
  withFadeIn,
  MtCO2,
  generateTreemap,
  TreemapRow,
  TreemapSVG,
  OTHER_NAME,
  HoverDetail,
} from "./treemap-base";

function TreemapCorporations({
  width,
  height,
  chartHeight,
  data,
  progress,
  highlight,
  ...props
}) {
  const { lastWidth, activeRow } = useContext(Context);

  // we only use the y-values from the d3 treemap;
  // the x-values are all managed internally here
  const detailWidth = 300;
  const finalDetailOffset = 100;

  const [animatedProps, set] = useSpring(() => ({
    detailOffset: lastWidth === "full" ? 400 : 100,
    overviewWidth: lastWidth === "full" ? 400 : 50,
  }));

  const { detailOffset, overviewWidth } = animatedProps;

  useEffect(() => {
    set({ detailOffset: finalDetailOffset });
    set({ overviewWidth: 50 });
  }, []);

  const detailData = useMemo(() => {
    // Extract the top 20 corporate entities. Excluding national governments
    const entityData = data
      .filter((d) => d.entity_type !== "State")
      .slice(0, 20);
    return generateTreemap(entityData, 0, width, chartHeight);
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
    return generateTreemap(entityData, 1, width, chartHeight);
  }, []);

  const overviewRows = overviewData.leaves().map((d, idx) => {
    return (
      <TreemapRow
        key={d.data.id}
        text={d.data.id}
        detailText={<MtCO2 value={d.value} units={idx == 0} />}
        width={overviewWidth}
        fillWidth={overviewWidth}
        height={d.y1 - d.y0}
        x0={0}
        y0={d.y0}
        status={d.data.id === OTHER_NAME ? "secondary" : "primary"}
        size={"large"}
        compressText={true}
        data={d.data.data}
      />
    );
  });

  const otherY0 = detailLeaves[detailLeaves.length - 1].y0;
  const detailRows = detailLeaves.map((d, idx) => {
    let status;
    if (d.data.id === OTHER_NAME) {
      status = "secondary";
    } else if (highlight === "state") {
      status = d.data.data.entity_type === "SOE" ? "primary" : "faded";
    } else if (highlight === "investor") {
      status = d.data.data.entity_type === "IOC" ? "primary" : "faded";
    } else {
      status = "primary";
    }

    return (
      <TreemapRow
        key={d.data.id}
        text={d.data.id}
        detailText={<MtCO2 value={d.value} units={idx == 0} />}
        width={detailWidth}
        fillWidth={detailWidth}
        height={d.y1 - d.y0}
        x0={detailOffset}
        y0={d.y0}
        status={status}
        strokeOpacity={d.data.id == OTHER_NAME ? 1 : 1 - 0.8 * (d.y0 / otherY0)}
        size={"normal"}
        data={d.data.data}
      />
    );
  });

  const annotationLineWidth = 2;

  const topLine = (
    <animated.line
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
    <animated.line
      x1={overviewWidth}
      y1={overviewData.leaves()[0].y1}
      x2={detailOffset}
      y2={chartHeight}
      style={{
        stroke: "#adadad",
        strokeWidth: annotationLineWidth,
        strokeDasharray: 3,
      }}
    />
  );

  return (
    <TreemapSVG width={width} height={height}>
      {overviewRows}
      {detailRows}
      {topLine}
      {bottomLine}
      <HoverDetail
        activeRow={activeRow}
        height={height}
        chartHeight={chartHeight}
        width={width}
        xOffset={finalDetailOffset}
      />
    </TreemapSVG>
  );
}

export default withFadeIn(TreemapCorporations);
