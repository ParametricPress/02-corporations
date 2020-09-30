import React, { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from 'react-three-fiber'
import { OrbitControls, Stats } from 'drei';
import CorporateScene from '../models/CorporateScene'

function Scene() {
  return (
    <React.Fragment>
      <OrbitControls
        target={[20, 30, 0]}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2 - Math.PI / 48}
        maxPolarAngle={Math.PI / 2 + Math.PI / 48}
        minAzimuthAngle={- Math.PI / 48}
        maxAzimuthAngle={Math.PI / 48}
      />
      <Suspense fallback={null}>
        <CorporateScene />
      </Suspense>    
    </React.Fragment>  
  )
}

export default function Outro() {
  return (
    <div className="scene-wrapper" style={{"width" : "100%", "position": "relative", "paddingBottom": "56.25%"}}>
      <div style={{"position": "absolute", "top": 0, "bottom": 0, "left": 0, "right": 0}}>
        <Canvas
          camera={{ position: [20, 30, 120], fov: 35 }}
          colorManagement
        >
          <Scene />
        </Canvas>
      </div>
    </div>
  )
}