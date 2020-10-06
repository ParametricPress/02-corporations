import React, { Suspense, useState, useContext, useRef, useEffect } from 'react'
import { ACESFilmicToneMapping, sRGBEncoding } from 'three'
import { Canvas, useFrame, useThree, useUpdate } from 'react-three-fiber'
import { OrbitControls, PerspectiveCamera } from 'drei'

import Bicyclist from '../models/Bicyclist'
import GasStation from '../models/GasStation'

function Scene({onInteractionStart, onInteractionEnd}) {
  const controls = useRef();

  useEffect(() => {
    if (controls.current) {
      controls.current.addEventListener('start', onInteractionStart)
      controls.current.addEventListener('end', onInteractionEnd)
    }
    return () => {
      if (controls.current) {
        controls.current.removeEventListener('start', onInteractionStart)
        controls.current.removeEventListener('end', onInteractionEnd)
      }  
    }
  }, []);

  return (
    <React.Fragment>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 128]}
        fov={4}
      />
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={2 * Math.PI / 5}
        maxPolarAngle={2 * Math.PI / 5}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[31, 26, 7]} intensity={2.0} />
      <Suspense fallback={null}>
        <group position={[0, -1.5, 0]} rotation={[0, Math.PI, 0]}>
          <GasStation />
          <Bicyclist />
        </group>
      </Suspense>
    </React.Fragment>
  )
}

export default function Intro({onInteractionStart, onInteractionEnd}) {
  const canvas = useRef();

  return (
    <Canvas colorManagement >
      <Scene
        onInteractionStart={onInteractionStart}
        onInteractionEnd={onInteractionEnd}
      />
    </Canvas>
  )
}