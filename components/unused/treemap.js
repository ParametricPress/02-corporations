const React = require("react");
const d3 = require("d3");
const _ = require("lodash");

// todo: responsive sizing
const width = 400;
const height = 600;
const hoverLabelHeight = 100;
const containerHeight = height + hoverLabelHeight;

const styles = {
  '--color-green': 'rgb(216, 255, 162)',
  '--color-green-50': 'rgb(216, 255, 162, 0.5)',
  '--color-green-highlight': 'rgb(234, 255, 204)',
  '--color-green-highlight-50': 'rgb(234, 255, 204, 0.5)',
  '--color-red': 'rgb(240, 153, 137)',
  '--color-red-highlight': 'rgb(246, 196, 187)',
  '--color-black': 'rgb(34, 34, 34)',
  '--color-black-50': 'rgb(34, 34, 34, 0.5)',

  '--large-row-font-size': '18px',
  '--large-row-detail-font-size': '14px',
  '--row-font-size': '14px',
  '--row-detail-font-size': '14px',

  '--primary-fill': 'var(--color-green)',
  '--primary-stroke': 'var(--color-black)',
  '--primary-hover': 'var(--color-green-highlight)',
  '--primary-text': 'var(--color-black)',
  '--primary-detail-text': 'var(--color-black-50)',
  '--secondary-fill': 'var(--color-green-50)',
  '--secondary-stroke': 'var(--color-black)',
  '--secondary-hover': 'var(--color-green-highlight-50)',
  '--secondary-text': 'var(--color-black)',
  '--secondary-detail-text': 'var(--color-black-50)',
  '--background-fill': 'var(--color-red)',
  '--background-stroke': 'var(--color-black)',
  '--background-hover': 'var(--color-red-highlight)',
  '--background-text': 'var(--color-black)',
  '--background-detail-text': 'var(--color-black-50)'
}

// pixel values for non-css svg properties
const LARGE_ROW_LINE_HEIGHT = 1.2 * 18;
const ROW_LINE_HEIGHT = 1.2 * 14;
const TEXT_PADDING = 6;
const STROKE_WIDTH = 2;

const OTHER_NAME = "Other Sources";

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

function CO2() {
  return (
    <tspan>
      CO
      <tspan
        dy="0.3em"
        fontSize="0.7em"
      >2</tspan>
    </tspan>
  )
}

function MtCO2({value, units = false}) {
  return (
    <tspan>
      {d3.format(",.0f")(value)}
      {units && (
        <tspan> Mt<CO2/></tspan>
      )}
    </tspan>
  )
}

function TreemapNormalRowText ({text, width, detailText, status}) {
  return (
    <React.Fragment>
      <text
        fill={`var(--${status}-text)`}
        dx={TEXT_PADDING}
        dy={TEXT_PADDING}
        fontSize={`var(--row-font-size)`}
        dominant-baseline="hanging"
      >
        {text}
      </text>
      <text
        fill={`var(--${status}-detail-text)`}
        dx={width - TEXT_PADDING}
        dy={TEXT_PADDING}
        fontSize={`var(--row-detail-font-size)`}
        textAnchor="end"
        dominant-baseline="hanging"
      >
        {detailText}
      </text>
    </React.Fragment>
  )
}

function TreemapLargeRowText ({text, width, height, detailText, status}) {
  return (
    <text
      fill={`var(--${status}-text)`}
      dx={width / 2}
      dy={height / 2}
      fontSize={`var(--large-row-font-size)`}
      textAnchor="middle"
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
  )
}

function TreemapRow ({id, width, height, x0, y0, text, detailText, status, size}) {
  const TreemapRowText = size == 'large' ? TreemapLargeRowText : TreemapNormalRowText;
  return (
    <g key={id} transform={`translate(${x0 || 0},${y0 || 0})`}>
      <rect
        width={width}
        height={height}
        fill={`var(--${status}-fill)`}
        stroke={`var(--${status}-stroke)`}
        strokeWidth={STROKE_WIDTH / 2}
      />
      <TreemapRowText
        text={text}
        detailText={detailText}
        width={width}
        height={height}
        status={status}  
      />
    </g>
  );
}


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
    if (this.props.step.name !== prevProps.step.name) {
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
      progress,
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
        <svg width={width} height={containerHeight} style={styles}>
          <TreemapRow
            id={'total'}
            text={<tspan>1.5 trillion tons of <CO2/></tspan>}
            width={width}
            height={height}
            status={'primary'}
            size={'large'}
          />
        </svg>
      );
    } else if (stepName === "individuals") {
      const animationPercent = Math.min(
        d3.easeCubic(this.state.relativeAnimationTime / 500),
        1
      );

      const currentStrokeWidth = d3.interpolateNumber(0, STROKE_WIDTH)(animationPercent);

      // Draw a neon rectangle,
      // then draw dark lines horizontally and vertically to
      // divide it up into a grid.
      // creates the effect of many small squares,
      // but with n+m elements instead of n*m
      return (
        <svg width={width} height={containerHeight} style={styles}>
          <rect fill={'var(--primary-fill)'} stroke={'var(--primary-stroke)'} width="100%" height={height}></rect>
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
                    stroke: 'var(--primary-stroke)',
                    strokeWidth: currentStrokeWidth,
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
                    stroke: 'var(--primary-stroke)',
                    strokeWidth: currentStrokeWidth,
                  }}
                />
              );
            })}
        </svg>
      );
    } else if (stepName === "corporations") {
      const entityData = [
        {
          entity: "Top 100 fossil fuel corporations",
          value: 677936,
        },
      ];
      const treemapData = treemap(entityData, 1);

      return (
        <div {...props}>
          <svg width={width} height={containerHeight} style={styles}>
            {treemapData.leaves().map((d, idx) => {
              return (
                <TreemapRow
                  id={d.data.id}
                  text={d.data.id}
                  detailText={<MtCO2 value={d.value} units={idx == 0} />}
                  width={d.x1 - d.x0}
                  height={d.y1 - d.y0}
                  x0={d.x0}
                  y0={d.y0}
                  status={d.data.id === OTHER_NAME ? 'secondary' : 'primary'}
                  size={'large'}
                />
              );
            })}
          </svg>
        </div>
      );
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
      const entityData = step.data.filter((d) => d.entity_type !== "State");

      let padTotal;
      if (stepName === "corporations-detail-preview") {
        padTotal = 1 - d3.easeCubic(this.state.relativeAnimationTime / 1000);
      } else {
        padTotal = 0;
      }

      const treemapData = treemap(entityData, padTotal);

      return (
        <div {...props}>
          <svg width={width} height={containerHeight} style={styles}>
            {treemapData.leaves().map((d, idx) => {
              return (
                <TreemapRow
                  id={d.data.id}
                  text={d.data.id}
                  detailText={<MtCO2 value={d.value} units={idx == 0} />}
                  width={d.x1 - d.x0}
                  height={d.y1 - d.y0}
                  x0={d.x0}
                  y0={d.y0}
                  status={d.data.id === OTHER_NAME ? 'secondary' : 'primary'}
                  size={'normal'}
                />
              );
            })}
            {this.state.hoveredEntity && (
              <g>
                <text y={height + 20} x={0}>
                  {this.state.hoveredEntity.data.id}
                </text>
                <text y={height + 40} x={0} fontSize={16}>
                  {d3.format(",.0f")(this.state.hoveredEntity.value)} MtCO2
                  traced to this corporation
                </text>
              </g>
            )}
          </svg>
        </div>
      );
    } else if (stepName === "countries") {
      const entityData = step.data.filter((d) => d.value > 5000);

      const treemapData = treemap(entityData, 1);

      return (
        <div {...props}>
          <div className="treemap-container">
            <svg width={width} height={containerHeight} style={styles}>
              {treemapData.leaves().map((d, idx) => {
                return (
                  <TreemapRow
                    id={d.data.id}
                    text={d.data.id}
                    detailText={<MtCO2 value={d.value} units={idx == 0} />}
                    width={d.x1 - d.x0}
                    height={d.y1 - d.y0}
                    x0={d.x0}
                    y0={d.y0}
                    status={d.data.id === OTHER_NAME ? 'secondary' : 'primary'}
                    size={'normal'}
                  />
                );
              })}
              {this.state.hoveredEntity && (
                <g>
                  <text y={height + 20} x={0}>
                    {this.state.hoveredEntity.data.id}
                  </text>
                  <text y={height + 40} x={0} fontSize={16}>
                    {d3.format(",.0f")(this.state.hoveredEntity.value)} MtCO2
                    emitted from this country
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
      );
    }
  }
}

module.exports = Treemap;
