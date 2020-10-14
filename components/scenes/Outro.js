import React, { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls, Stats } from 'drei';
import CorporateBuilding from '../models/CorporateBuilding'

function Scene({...props}) {

  const camera = useRef();

  const { setDefaultCamera } = useThree();

  useEffect(() => {
    setDefaultCamera(camera.current);
  }, [camera.current]);

  return (
    <React.Fragment>
      <perspectiveCamera
        ref={camera}
        position={[0, 2.5, 28]}
        rotation={[0.261799, 0, 0]}
        fov={52.411668340213666}
      />
      <Suspense fallback={null}>
        <CorporateBuilding {...props} />
      </Suspense>
    </React.Fragment>  
  )
}

export default function Outro({...props}) {

  return (
    <Canvas
      colorManagement
    >
      <Scene {...props} />
    </Canvas>
  )
}