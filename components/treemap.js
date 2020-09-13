const React = require("react");
const d3 = require("d3");
const _ = require("lodash");

// todo: responsive sizing
const width = 400;
const height = 600;

const OTHER_NAME = "Other";

// CDIAC Total Global Emissions MtCO2e, 1751-2016.
// (This defines the total size of the treemap square)
const GLOBAL_EMISSIONS_TOTAL = 1544812;

// return a d3 treemap data structure based on some data
// padTotal: A number from 0 to 1.
//   0 = just plot the given data, no extra entities to add
//   1 = add an extra entity so that the total sums to the global total emissions
//   in between = scale the extra entity proportionally. (used for animation)
const treemap = (data, padTotal) => {
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
    this.frame = null;
    this.startTime = null;
  }

  animate(timestamp) {
    const duration = 500;
    if (!this.startTime) {
      this.startTime = timestamp;
    }

    // todo: evaluate if this approach to using setState on rAF is too slow;
    // consider using react-spring instead?
    this.setState((state, props) => ({
      relativeAnimationTime: timestamp - this.startTime,
    }));
    window.requestAnimationFrame(this.animate.bind(this));
  }

  componentDidMount() {
    this.setState({
      frame: window.requestAnimationFrame(this.animate.bind(this)),
    });
  }

  componentWillUnmount() {
    if (this.state.frame) {
      window.cancelAnimationFrame(this.state.frame);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.step !== prevProps.step) {
      this.startTime = null;
    }
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

    let stepName = step.name;
    if (
      stepName === "corporations-detail" &&
      this.state.relativeAnimationTime < 1000
    ) {
      stepName = "corporations-detail-preview";
    }

    // need to handle the case where variable isn't properly passed in
    // (I think this only happens right on page init?)
    if (!step) {
      return <div></div>;
    }
    if (stepName === "total") {
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
            <tspan dy="3" fontSize=".7em">
              2
            </tspan>
          </text>
        </svg>
      );
    } else if (stepName === "individuals") {
      const animationPercent = Math.min(
        d3.easeCubic(this.state.relativeAnimationTime / 500),
        1
      );

      const strokeWidth = d3.interpolateNumber(0, 3)(animationPercent);

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
                  key={`row${rowIdx}`}
                  x1="0"
                  y1={10 * rowIdx}
                  x2="100%"
                  y2={10 * rowIdx}
                  style={{
                    stroke: "#222222",
                    strokeWidth: strokeWidth,
                  }}
                />
              );
            })}
          {Array(width / 10)
            .fill()
            .map((el, colIdx) => {
              return (
                <line
                  key={`col${colIdx}`}
                  y1="0"
                  x1={10 * colIdx}
                  y2="100%"
                  x2={10 * colIdx}
                  style={{
                    stroke: "#222222",
                    strokeWidth: strokeWidth,
                  }}
                />
              );
            })}
        </svg>
      );
    } else {
      let entityData = step.data;

      const top100entity = {
        entity: "Top 100 fossil fuel corporations",
        value: 677936,
      };

      // do pre-processing on the data
      if (stepName === "countries") {
        // Only show largest countries
        entityData = entityData.filter((d) => d.value > 15000);
      } else if (stepName === "corporations") {
        entityData = [top100entity];
      } else if (
        stepName === "corporations-detail" ||
        stepName === "corporations-detail-preview"
      ) {
        // Our raw data file includes 3 types of entities:
        // 1) Nation-states ("State")
        // 2) State-owned corporations ("SOE")
        // 3) Investor-owned corporations ("IOC")
        // Only 2 + 3 are considered corporate entities.
        // So we filter out State here, so the data only includes corporations.
        entityData = entityData.filter((d) => d.entity_type !== "State");
      }

      // todo: don't run on render, precompute?

      let padTotal;

      if (["countries", "corporations"].includes(stepName)) {
        padTotal = 1;
      } else if (stepName === "corporations-detail-preview") {
        padTotal = 1 - d3.easeCubic(this.state.relativeAnimationTime / 1000);
      }

      const treemapData = treemap(entityData, padTotal);

      return (
        <div {...props}>
          <svg width={width} height={height}>
            {treemapData.leaves().map((d) => {
              const width = d.x1 - d.x0;
              const height = d.y1 - d.y0;
              return (
                <g key={d.data.id} transform={`translate(${d.x0},${d.y0})`}>
                  <rect
                    width={width}
                    height={height}
                    opacity={d.data.id === OTHER_NAME ? "50%" : "100%"}
                    fill="#d8ffa2"
                    stroke="black"
                    key={d.data.id}
                  />
                  {stepName === "corporations" ? (
                    // special styling for the top 100 fossil cos aggregated
                    d.data.id === OTHER_NAME ? null : (
                      <g>
                        <text
                          style={{ fill: "#222222" }}
                          dx={width / 2}
                          dy={height / 2}
                          textAnchor="middle"
                        >
                          {d.data.id}
                        </text>
                        <text
                          style={{ fill: "#8e8e8e" }}
                          dx={width / 2}
                          dy={height / 2 + 30}
                          textAnchor="middle"
                          fontSize={14}
                        >
                          {d3.format(",.0f")(d.value)}
                        </text>
                      </g>
                    )
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
