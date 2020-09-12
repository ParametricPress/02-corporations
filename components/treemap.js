const React = require("react");
const d3 = require("d3");
const _ = require("lodash");
const Color = require("color");

// todo: responsive sizing
const width = 400;
const height = 600;

const OTHER_NAME = "Other";

const treemap = (data) => {
  // CDIAC Total Global Emissions MtCO2e, 1751-2016.
  // (This defines the total size of the treemap square)
  const globalEmissionsTotal = 1544812;

  const groupedEntities = [
    { entity: "Global", parent: null },
    ...data.map((d) => ({ ...d, parent: "Global" })),

    // Add an extra entity to pad the treemap so that the total adds up to all global emissions
    {
      entity: OTHER_NAME,
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

  return d3
    .treemap()
    .tile(d3.treemapSlice)
    .size([width, height])
    .padding(1)
    .round(true)(hierarchicalData);
};

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
      // Draw a neon rectangle,
      // then draw dark lines horizontally and vertically to
      // divide it up into a grid.
      // creates the effect of many small squares,
      // but with n+m elements instead of n*m
      return (
        <svg width={width} height={height}>
          <rect fill="#d8ffa2" width="100%" height="100%"></rect>
          {Array(height / 10)
            .fill()
            .map((el, rowIdx) => {
              return (
                <line
                  x1="0"
                  y1={10 * rowIdx}
                  x2="100%"
                  y2={10 * rowIdx}
                  style={{ stroke: "#222222", strokeWidth: 3 }}
                />
              );
            })}
          {Array(width / 10)
            .fill()
            .map((el, colIdx) => {
              return (
                <line
                  y1="0"
                  x1={10 * colIdx}
                  y2="100%"
                  x2={10 * colIdx}
                  style={{ stroke: "#222222", strokeWidth: 3 }}
                />
              );
            })}
        </svg>
      );
    } else {
      let entityData = step.data;

      // do pre-processing on the data

      if (step.name === "countries") {
        // Only show largest countries
        entityData = entityData.filter((d) => d.value > 15000);
      }

      if (step.name === "corporations") {
        entityData = [
          {
            entity: "Top 100 Fossil Fuel Corporations",
            value: 677936,
          },
        ];

        // entityData = [
        //   {
        //     entity: "State-Owned Corporations",
        //     value: 341512,
        //   },
        //   {
        //     entity: "Investor-Owned Corporations",
        //     value: 336424,
        //   },
        // ];
      }

      if (step.name === "corporations-detail") {
        // Our raw data file includes 3 types of entities:
        // 1) Nation-states ("State")
        // 2) State-owned corporations ("SOE")
        // 3) Investor-owned corporations ("IOC")
        // Only 2 + 3 are considered corporate entities.
        // So we filter out State here, so the data only includes corporations.
        entityData = entityData.filter((d) => d.entity_type !== "State");
      }

      // todo: don't run on render, precompute?
      const treemapData = treemap(entityData);

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
                    opacity={d.data.id === OTHER_NAME ? "50%" : "100%"}
                    fill="#d8ffa2"
                    stroke="black"
                  />
                  {step.name === "corporations" ? (
                    <text
                      style={{ fill: "#222222" }}
                      dx="50%"
                      dy={140}
                      textAnchor="middle"
                    >
                      {d.data.id}
                    </text>
                  ) : (
                    d.value > 10000 && (
                      <text
                        style={{ fill: "#222222" }}
                        dx={5}
                        dy={15}
                        fontSize={14}
                      >
                        {d.data.id}
                        <tspan dx={5} fill="#8e8e8e">
                          {d3.format(",.0f")(d.value)}
                        </tspan>
                      </text>
                    )
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
