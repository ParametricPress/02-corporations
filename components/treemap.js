const React = require("react");
const d3 = require("d3");
const _ = require("lodash");
const Color = require("color");

// todo: responsive sizing
const width = 600;
const height = 600;

const treemap = (data) => {
  // CDIAC Total Global Emissions MtCO2e, 1751-2016.
  // (This defines the total size of the treemap square)
  const globalEmissionsTotal = 1544812;

  const groupedEntities = [
    { entity: "Global", parent: null },
    ...data.map((d) => ({ ...d, parent: "Global" })),

    // Add an extra entity to pad the treemap so that the total adds up to all global emissions
    {
      entity: "Other sources",
      parent: "Global",
      value: globalEmissionsTotal - d3.sum(data.map((d) => d.value)),
    },
  ];

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
    .sort((a, b) => b.value - a.value);

  console.log({ hierarchicalData });

  return d3.treemap().size([width, height]).padding(1).round(true)(
    hierarchicalData
  );
};

const color = d3.scaleOrdinal(d3.schemeCategory10);

class Treemap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      hasError,
      idyll,
      updateProps,
      clickCount,
      step,
      ...props
    } = this.props;

    console.log("rendering, step", step);

    // need to handle the case where variable isn't properly passed in
    // (I think this only happens right on page init?)
    if (!step) {
      return <div></div>;
    }
    if (step.name === "total") {
      return (
        <svg width={width} height={height}>
          <rect fill="#d8ffa2" width="100%" height="100%"></rect>
          <text
            style={{ fill: "#222222" }}
            dx="50%"
            dy="50%"
            textAnchor="middle"
          >
            1.5 trillion tons of CO
            <tspan dy="3" font-size=".7em">
              2
            </tspan>
          </text>
        </svg>
      );
    } else if (step.name === "individuals") {
      const n_rows = height / 10;
      const n_cols = width / 10;

      console.log({ n_rows, n_cols });

      return (
        <svg width={width} height={height}>
          {Array(n_rows)
            .fill()
            .map((el, rowIdx) => {
              return Array(n_cols)
                .fill()
                .map((el, colIdx) => {
                  return (
                    <rect
                      fill="#d8ffa2"
                      width="7px"
                      height="7px"
                      y={10 * rowIdx}
                      x={10 * colIdx}
                    ></rect>
                  );
                });
            })}
        </svg>
      );
    } else {
      console.log("raw data", step.data);
      // todo: don't run on render, precompute?
      const treemapData = treemap(step.data);

      console.log({ treemapData });

      return (
        <div {...props}>
          <svg width={width} height={height}>
            {treemapData.leaves().map((d) => {
              const width = d.x1 - d.x0;
              const height = d.y1 - d.y0;
              return (
                <g key={d.id} transform={`translate(${d.x0},${d.y0})`}>
                  <rect
                    width={width}
                    height={height}
                    // fill={color(d.data.id)}
                    fill="#d8ffa2"
                    stroke="black"
                  />
                  {d.value > 1000 && (
                    <text
                      style={{ fill: "#222222" }}
                      dx={5}
                      dy={15}
                      fontSize={10}
                    >
                      {d.data.id}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      );
    }
  }
}

module.exports = Treemap;
