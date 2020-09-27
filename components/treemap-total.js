import React from 'react';

import {
  withFadeIn,
  CO2,
  TreemapRow,
  TreemapSVG
} from './treemap-base';

function TreemapTotal({width, height, data, progress, ...props}) {
  return (
    <TreemapSVG width={width} height={height}>
      <TreemapRow
        text={<tspan>1.5 trillion tons of <CO2/></tspan>}
        width={width}
        height={height}
        status={'primary'}
        size={'large'}
      />
    </TreemapSVG>
  )
}

export default withFadeIn(TreemapTotal);