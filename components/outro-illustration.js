import Outro from './scenes/Outro'
import React from 'react'

function OutroIllustration() {
  return (
    <div className="outro-scene-wrapper" style={{"width" : "100%", "position": "relative", "paddingBottom": "56.25%"}}>
      <div style={{"position": "absolute", "top": 0, "bottom": 0, "left": 0, "right": 0}}>
        <Outro />
      </div>
      <div className="outro-scene-title">
        <h5>8 Simple Demands for Fossil Fuel Corporations</h5>
      </div>
      <div className="outro-scene-caption">
        <div className="outro-scene-caption-title">1. Lobby</div>
        <div className="outro-scene-caption-body">Pay reparations for knowingly contributing to climate change while misinforming the public.</div>
        <div className="outro-scene-caption-controls">
          <div className="outro-scene-back"><button>←</button></div>
          <div className="outro-scene-forward"><button>→</button></div>
        </div>
      </div>
    </div>

  )
}

export default OutroIllustration