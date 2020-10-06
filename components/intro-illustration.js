import Intro from './scenes/Intro'
import React, { useState } from 'react'

function IntroIllustration() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`intro-scene-wrapper${isDragging ? ' dragging' : ''}`}
      style={{"width" : "100%", "position": "relative", "paddingBottom": "56.25%"}}
    >
      <div
        style={{"position": "absolute", "top": 0, "bottom": 0, "left": 0, "right": 0}}
      >
        <Intro
          onInteractionStart={() => setIsDragging(true)}
          onInteractionEnd={() => setIsDragging(false)}
        />
      </div>
    </div>
  )
}

export default IntroIllustration;