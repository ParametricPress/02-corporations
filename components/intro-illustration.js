import Intro from './scenes/Intro'
import React from 'react'

function IntroIllustration() {
  return (
    <div className="intro-scene-wrapper" style={{"width" : "100%", "position": "relative", "paddingBottom": "56.25%"}}>
      <div style={{"position": "absolute", "top": 0, "bottom": 0, "left": 0, "right": 0}}>
        <Intro />
      </div>
    </div>
  )
}

export default IntroIllustration;