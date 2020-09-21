import React, { Suspense, useState, useContext, useRef, useEffect } from 'react'
import { ACESFilmicToneMapping, sRGBEncoding } from 'three'
import { Canvas, useFrame, useThree, useUpdate } from 'react-three-fiber'
import { OrbitControls, PerspectiveCamera } from 'drei'

import Bicyclist from '../models/Bicyclist'
import GasStation from '../models/GasStation'

function Scene() {
  return (
    <React.Fragment>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 128]}
        fov={4}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={2 * Math.PI / 5}
        maxPolarAngle={2 * Math.PI / 5}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[31, 26, 7]} intensity={2.0} />
      <Suspense fallback={null}>
        <group position={[0, -1, 0]} rotation={[0, Math.PI, 0]}>
          <GasStation />
          <Bicyclist />
        </group>
      </Suspense>
    </React.Fragment>
  )
}

export default function Intro() {
  return (
    <div className="scene-wrapper" style={{"width" : "100%", "position": "relative", "paddingBottom": "56.25%"}}>
      <div style={{"position": "absolute", "top": 0, "bottom": 0, "left": 0, "right": 0}}>
        <Canvas colorManagement>
          <Scene />
        </Canvas>
      </div>
    </div>
  )
}