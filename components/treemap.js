const React = require("react");
const d3 = require("d3");
const _ = require("lodash");
const Color = require("color");

// todo: responsive sizing
const width = 800;
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
      data,
      ...props
    } = this.props;

    // todo: don't run on render, precompute?
    const treemapData = treemap(data);

    console.log({ treemapData });

    return (
      <div {...props}>
        <svg width={width} height={height}>
          {treemapData.leaves().map((d) => {
            const width = d.x1 - d.x0;
            const height = d.y1 - d.y0;
            return (
              <g key={d.id} transform={`translate(${d.x0},${d.y0})`}>
                {d.value > 1000 && (
                  <text dx={5} dy={15} fontSize={10}>
                    {d.data.id}
                  </text>
                )}
                <rect
                  width={width}
                  height={height}
                  fill={color(d.data.id)}
                  opacity={0.5}
                  stroke="black"
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
}

module.exports = Treemap;
