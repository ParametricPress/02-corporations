import Outro from './scenes/Outro'
import React, { useState } from 'react'
import demands from './data/demands'

function OutroIllustration() {
  const [demand, setDemand] = useState(demands.list()[0]);

  return (
    <div className="outro-scene-wrapper" style={{"width" : "100%", "position": "relative", "paddingBottom": "56.25%"}}>
      <div style={{"position": "absolute", "top": 0, "bottom": 0, "left": 0, "right": 0}}>
        <Outro />
      </div>
      <div className="outro-scene-title">
        <h5>8 Simple Demands for Fossil Fuel Corporations</h5>
      </div>
      <div className="outro-scene-caption">
        <div className="outro-scene-caption-title">{demand.index + 1}. {demand.location}</div>
        <div className="outro-scene-caption-body">{demand.text}</div>
        <div className="outro-scene-caption-controls">
          <div className="outro-scene-back">
            <button
              onClick={() => { setDemand(demands.prev(demand.id)) }}
            >←</button>
          </div>
          <div className="outro-scene-forward">
            <button
              onClick={() => { setDemand(demands.next(demand.id)) }}
            >→</button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default OutroIllustration