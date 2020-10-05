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
    <Canvas
      camera={{ position: [20, 30, 120], fov: 35 }}
      colorManagement
    >
      <Scene />
    </Canvas>
  )
}