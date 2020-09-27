import React from 'react';

import {
  withFadeIn,
  TreemapMatrix,
  TreemapSVG
} from './treemap-base';

function TreemapIndividuals({width, height, data, progress, ...props}) {
  return (
    <TreemapSVG width={width} height={height}>
      <TreemapMatrix
        width={width}
        height={height}
        cellWidth={10}
        cellHeight={10}
      />
    </TreemapSVG>
  )
}

export default withFadeIn(TreemapIndividuals);