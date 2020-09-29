import React, { useMemo, useEffect, useContext, useState, useRef } from "react";
import * as d3 from "d3";
import { useSpring, animated, config } from "react-spring";
import useEventListener from "@use-it/event-listener";

import Context from "./treemap-context";

const WIDTH = 400;
const HEIGHT = 600;
const HOVER_LABEL_HEIGHT = 100;
const CONTAINER_HEIGHT = HEIGHT + HOVER_LABEL_HEIGHT;

const styles = {
  "--color-green": "rgb(216, 255, 162)",
  "--color-green-50": "rgb(216, 255, 162, 0.5)",
  "--color-green-90": "rgb(216, 255, 162, 0.9)",
  "--color-green-highlight": "rgb(234, 255, 204)",
  "--color-green-highlight-50": "rgb(234, 255, 204, 0.5)",
  "--color-green-highlight-90": "rgb(234, 255, 204, 0.9)",
  "--color-red": "rgb(240, 153, 137)",
  "--color-red-highlight": "rgb(246, 196, 187)",
  "--color-black": "rgb(34, 34, 34)",
  "--color-black-50": "rgb(34, 34, 34, 0.5)",

  "--large-row-font-size": "18px",
  "--large-row-detail-font-size": "14px",
  "--row-font-size": "14px",
  "--row-detail-font-size": "14px",

  "--primary-fill": "var(--color-green)",
  "--primary-stroke": "var(--color-black)",
  "--primary-fill-hover": "var(--color-green-highlight)",
  "--primary-text": "var(--color-black)",
  "--primary-detail-text": "var(--color-black-50)",
  "--secondary-fill": "url(#diagonal-stripes)",
  "--secondary-stroke": "var(--color-black)",
  "--secondary-fill-hover": "url(#diagonal-stripes-highlight)",
  "--secondary-text": "var(--color-black)",
  "--secondary-detail-text": "var(--color-black-50)",
  "--highlight-fill": "var(--color-red)",
  "--highlight-stroke": "var(--color-black)",
  "--highlight-fill-hover": "var(--color-green-highlight)",
  "--highlight-text": "var(--color-black)",
  "--highlight-detail-text": "var(--color-black-50)",
  "--faded-fill": "var(--color-green-50)",
  "--faded-stroke": "var(--color-black)",
  "--faded-fill-hover": "var(--color-green-50)",
  "--faded-text": "var(--color-black)",
  "--faded-detail-text": "var(--color-black-50)",
  "--background-fill": "var(--color-red)",
  "--background-stroke": "var(--color-black)",
  "--background-fill-hover": "var(--color-red-highlight)",
  "--background-text": "var(--color-black)",
  "--background-detail-text": "var(--color-black-50)",
};

// pixel values for non-css svg properties
const LARGE_ROW_LINE_HEIGHT = 1.2 * 18;
const ROW_LINE_HEIGHT = 1.2 * 14;
const TEXT_PADDING = 6;

const OTHER_NAME = "Other Sources";

// CDIAC Total Global Emissions MtCO2e, 1751-2016.
// (This defines the total size of the treemap square)
const GLOBAL_EMISSIONS_TOTAL = 1544812;

// return a d3 treemap data structure based on some data
// padTotal: A number from 0 to 1.
//   0 = just plot the given data, no extra entities to add
//   1 = add an extra entity so that the total sums to the global total emissions
//   in between = scale the extra entity proportionally. (used for animation)
const generateTreemap = (data, padTotal = 0) => {
  let groupedEntities = [
    { entity: "Global", parent: null },
    ...data.map((d) => ({ ...d, parent: "Global" })),
  ];

  if (padTotal > 0) {
    groupedEntities.push({
      entity: OTHER_NAME,
      parent: "Global",
      value:
        (GLOBAL_EMISSIONS_TOTAL - d3.sum(data.map((d) => d.value))) * padTotal,
    });
  }

  const root = d3
    .stratify()
    .id(function (d) {
      return d.entity;
    })
    .parentId(function (d) {
      return d.parent;
    })(groupedEntities);

  const hierarchicalData = d3
    .hierarchy(root)
    .sum((d) => d.data.value)
    .sort((a, b) => {
      // Put "other" at the bottom always
      if (a.data.id === OTHER_NAME) {
        return 1;
      } else if (b.data.id === OTHER_NAME) {
        return -1;
      } else {
        return b.value - a.value;
      }
    });

  return d3.treemap().tile(d3.treemapSlice).size([WIDTH, HEIGHT]).round(true)(
    hierarchicalData
  );
};

function withFadeIn(Component) {
  return (props) => {
    const [animatedProps, set] = useSpring(() => ({
      strokeWidth: 0,
      opacity: 0,
      config: config.slow,
    }));
    const { strokeWidth, opacity } = animatedProps;

    useEffect(() => {
      set({ strokeWidth: 2 });
      set({ opacity: 1, delay: 100 });
    }, []);

    return (
      <animated.div
        style={{
          "--stroke-width": strokeWidth,
          "--text-opacity": opacity,
        }}
      >
        <Component {...props} />
      </animated.div>
    );
  };
}

function CO2() {
  return (
    <tspan>
      CO
      <tspan dy="0.3em" fontSize="0.7em">
        2
      </tspan>
    </tspan>
  );
}

function MtCO2({ value, units = false }) {
  return (
    <tspan>
      {d3.format(",.0f")(value)}
      {units && (
        <tspan>
          {" "}
          Mt
          <CO2 />
        </tspan>
      )}
    </tspan>
  );
}

function TreemapNormalRowText({ text, width, detailText, status }) {
  return (
    <React.Fragment>
      <text
        fill={`var(--${status}-text)`}
        dx={TEXT_PADDING}
        dy={TEXT_PADDING}
        fontSize={`var(--row-font-size)`}
        dominantBaseline="hanging"
        opacity={`var(--text-opacity)`}
      >
        {text}
      </text>
      <text
        fill={`var(--${status}-detail-text)`}
        dx={width - TEXT_PADDING}
        dy={TEXT_PADDING}
        fontSize={`var(--row-detail-font-size)`}
        textAnchor="end"
        dominantBaseline="hanging"
        opacity={`var(--text-opacity)`}
      >
        {detailText}
      </text>
    </React.Fragment>
  );
}

function TreemapLargeRowText({ text, width, height, detailText, status }) {
  return (
    <text
      fill={`var(--${status}-text)`}
      dx={width / 2}
      dy={height / 2}
      fontSize={`var(--large-row-font-size)`}
      textAnchor="middle"
      opacity={`var(--text-opacity)`}
    >
      <tspan>{text}</tspan>
      <tspan
        fill={`var(--${status}-detail-text)`}
        x="50%"
        textAnchor="middle"
        dy={LARGE_ROW_LINE_HEIGHT}
        fontSize={`var(--large-row-detail-font-size)`}
      >
        {detailText}
      </tspan>
    </text>
  );
}

function TreemapRow({
  width,
  height,
  x0 = 0,
  y0 = 0,
  text,
  detailText,
  data = {},
  status,
  size,
  hideText,
  strokeOpacity = 1,
  ...props
}) {
  const TreemapRowText =
    size == "large" ? TreemapLargeRowText : TreemapNormalRowText;
  const { setActiveRow } = useContext(Context);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setActiveRow({
      text,
      detailText,
      data,
    });
  };
  const handleMouseOut = () => {
    setIsHovered(false);
    setActiveRow(null);
  };

  console.log("treemaprow", { status });

  return (
    <g
      transform={`translate(${x0},${y0})`}
      {...props}
      onMouseEnter={handleMouseEnter}
      onMouseOut={handleMouseOut}
    >
      <rect
        width={width}
        height={height}
        fill={`var(--${status}-fill${isHovered ? "-hover" : ""})`}
        stroke={`rgb(34, 34, 34, ${strokeOpacity})`}
        strokeWidth={`var(--stroke-width)`}
      />
      {!hideText && (
        <TreemapRowText
          text={text}
          detailText={detailText}
          width={width}
          height={height}
          status={status}
        />
      )}
    </g>
  );
}

function TreemapMatrix({ width, height, cellWidth, cellHeight, strokeWidth }) {
  const rows = Math.floor(height / cellHeight);
  const columns = Math.floor(width / cellWidth);
  const rowHeight = height / rows;
  const columnWidth = width / columns;
  const rowLines = useMemo(
    () =>
      Array(rows)
        .fill()
        .map((el, rowIdx) => {
          return (
            <line
              key={`row${rowIdx}`}
              x1="0"
              y1={rowHeight * rowIdx}
              x2="100%"
              y2={rowHeight * rowIdx}
              style={{
                stroke: "var(--primary-stroke)",
                strokeWidth: "var(--stroke-width)",
              }}
            />
          );
        }),
    [rows, rowHeight]
  );
  const columnLines = useMemo(
    () =>
      Array(columns)
        .fill()
        .map((el, colIdx) => {
          return (
            <line
              key={`col${colIdx}`}
              y1="0"
              x1={columnWidth * colIdx}
              y2="100%"
              x2={columnWidth * colIdx}
              style={{
                stroke: "var(--primary-stroke)",
                strokeWidth: "var(--stroke-width)",
              }}
            />
          );
        }),
    [columns, columnWidth]
  );

  return (
    <React.Fragment>
      <rect
        fill={"var(--primary-fill)"}
        stroke={"var(--primary-stroke)"}
        width={width}
        height={height}
      ></rect>
      {rowLines}
      {columnLines}
    </React.Fragment>
  );
}

function TreemapSVG({ key, width, height, children, ...props }) {
  const { mouseXY } = useContext(Context);
  const svgEl = useRef(null);
  let dummy = useRef(null);

  useEffect(() => {
    dummy.current = svgEl.current.createSVGPoint();
  }, [svgEl.current]);

  useEventListener("mousemove", ({ clientX, clientY }) => {
    dummy.current.x = clientX;
    dummy.current.y = clientY;
    mouseXY.current = dummy.current.matrixTransform(
      svgEl.current.getScreenCTM().inverse()
    );
  });

  return (
    <svg ref={svgEl} width={width} height={height} {...props}>
      <pattern
        id="diagonal-stripes"
        x="0"
        y="0"
        width="12"
        height="12"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect
          x="0"
          y="0"
          width="10"
          height="12"
          stroke="none"
          fill={"var(--color-green-90)"}
        />
        <rect
          x="10"
          y="0"
          width="2"
          height="12"
          stroke="none"
          fill={"var(--color-green-50)"}
        />
      </pattern>
      <pattern
        id="diagonal-stripes-highlight"
        x="0"
        y="0"
        width="12"
        height="12"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect
          x="0"
          y="0"
          width="10"
          height="12"
          stroke="none"
          fill={"var(--primary-fill-hover)"}
        />
        <rect
          x="10"
          y="0"
          width="2"
          height="12"
          stroke="none"
          fill={"var(--color-green-highlight-90)"}
        />
      </pattern>
      {children}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="none"
        stroke={"var(--primary-stroke)"}
        strokeWidth={2}
      />
    </svg>
  );
}

export {
  generateTreemap,
  withFadeIn,
  CO2,
  MtCO2,
  TreemapSVG,
  TreemapMatrix,
  TreemapRow,
  styles,
  OTHER_NAME,
};
