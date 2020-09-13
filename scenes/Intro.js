import React, { Suspense, useState, useContext, useRef, useEffect } from 'react'
import { ACESFilmicToneMapping } from 'three'
import { Canvas } from 'react-three-fiber'
import { OrbitControls } from 'drei'

import Bicyclist from '../models/Bicyclist'
import GasStation from '../models/GasStation'

export default function Scene() {
  return (
    <Canvas
      concurrent
      shadowMap
      toneMapping={ACESFilmicToneMapping}
      pixelRatio={window.devicePixelRatio || 1}
    >
      <OrbitControls />
      <hemisphereLight
        color="#9696b4"
        groundColor="#003100"
        intensity={1.0}
      />
      <directionalLight
        position={[-5, 10, 5]}
        castShadow
        intensity={2}
      />
      <Suspense fallback={null}>
        <Bicyclist />
        <GasStation />
      </Suspense>
    </Canvas>
  )
}
