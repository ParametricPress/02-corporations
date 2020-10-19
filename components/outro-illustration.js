import Outro from './scenes/Outro'
import React, { useState } from 'react'
import demands from './data/demands'
import { useWindowSize } from "./hooks";

function OutroIllustration() {
  const [demand, setDemand] = useState(demands.list()[0]);
  const { width, height } = useWindowSize();

  const isMobile = (width < 720);

  return (
    <div className="outro-scene-wrapper" style={{"width" : "100%", "position": "relative", "paddingBottom": isMobile ? "150%" : "56.25%"}}>
      <div style={{
        "position": "absolute",
        "top": 0,
        "bottom": 0,
        "left": 0,
        "right": 0,
        "background": "linear-gradient(45deg, #e47f1e, #1e1d2f 50%)"
      }}>
        <Outro demands={demands} demand={demand} setDemand={setDemand} isMobile={isMobile} />
      </div>
      <div className="outro-scene-title">
        <h5>{demands.list().length} Simple Demands for Fossil Fuel Corporations</h5>
      </div>
      <div className="outro-scene-caption">
    <div className="outro-scene-caption-title">{demand.title} <span className="outro-scene-caption-location">• {demand.location}</span></div>
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