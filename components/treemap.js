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
    .tile("d3.treemapBinary")
    .size([width, height])
    .padding(1)
    .round(true);

console.log({ treemap });

class Treemap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { hasError, idyll, updateProps, clickCount, ...props } = this.props;

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
