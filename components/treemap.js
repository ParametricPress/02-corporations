const React = require("react");
const d3 = require("d3");
const _ = require("lodash");
const Color = require("color");

// todo: responsive sizing
const width = 800;
const height = 600;

const treemap = (data) => {
  const hierarchicalData = d3
    .hierarchy(data)
    .sum((d) => d.data.value)
    .sort((a, b) => b.data.value - a.data.value);

  return d3
    .treemap()
    .tile(d3.treemapBinary)
    .size([width, height])
    .padding(1)
    .round(false)(hierarchicalData);
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

    const groupedCountries = [
      { country: "World", parent: null },
      ...data.map((d) => ({ ...d, parent: "World" })),
    ];

    const root = d3
      .stratify()
      .id(function (d) {
        return d.country;
      })
      .parentId(function (d) {
        return d.parent;
      })(groupedCountries);

    console.log("root", root);

    // todo: don't run on render, precompute?
    const treemapData = treemap(root);

    console.log("rendering");
    console.log("treemap", treemapData);

    return (
      <div {...props}>
        <svg width={width} height={height}>
          {treemapData.leaves().map((d) => {
            const width = d.x1 - d.x0;
            const height = d.y1 - d.y0;
            return (
              <g key={d.data.id} transform={`translate(${d.x0},${d.y0})`}>
                {height > 5 && (
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
