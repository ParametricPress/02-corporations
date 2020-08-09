const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');
const _ = require('lodash');
const Color = require('color');

// todo: responsive sizing
const width = 800;
const height = 600;

// todo: abstract out an Axis component containing the label?

function YAxisLabel(props) {
  return <text
    transform={`translate(${width/2}, ${height})`}
    textAnchor="middle"
    >
    {props.children}
  </text>;
}

function XAxisLabel(props) {
  return <text
    x={0 - (height / 2)}
    y={0}
    dy="1em"
    transform="rotate(-90)"
    textAnchor="middle"
    >
    {props.children}
  </text>
}

class AnimatedStackedArea extends React.Component {
  constructor(props) {
    super(props);
    console.log('Initializing AnimatedStackedArea component.')
  }

  render() {
    const { hasError, idyll, updateProps, clickCount, ...props } = this.props;

    return (
      <div {...props} >
        <svg
          width={width}
          height={height}
          fontSize={14}>

          <YAxisLabel>Year</YAxisLabel>
          <XAxisLabel>Emissions (MtCO2e)</XAxisLabel>

        </svg>
      </div>
    );
  }
}

module.exports = AnimatedStackedArea;
