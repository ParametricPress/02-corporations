const React = require("react");
const d3 = require("d3");
const _ = require("lodash");
const Color = require("color");

// todo: responsive sizing
const width = 800;
const height = 600;

const treemap = (data) =>
  d3
    .treemap()
    .tile(d3.treemapBinary)
    .size([width, height])
    .padding(1)
    .round(true)(d3.hierarchy(data));

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

    console.log("rendering");
    console.log("data", data);
    console.log("root", root);
    console.log("treemap", treemap(data));

    return (
      <div {...props}>
        <svg width={width} height={height}>
          <text y={100}>Hello world</text>
        </svg>
      </div>
    );
  }
}

module.exports = Treemap;
