import React, { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { OrbitControls, Stats } from 'drei';
import CorporateBuilding from '../models/CorporateBuilding'
import { useSpring  } from "react-spring";

export const useParallax = (amount = 0.5) => {
  const [{ parallax }, set] = useSpring(() => ({
    parallax: [0, 0]
  }))

  function onMouseMove(e){
    let x = (e.clientX / window.innerWidth) * 2 - 1;
    let y = -(e.clientY / window.innerHeight) * 2 + 1;
    set({
      parallax: [x * amount, y * amount]
    })
  }

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  });

  return parallax;
}

function Scene({ isMobile, ...props }) {

  const cameraDistance = isMobile ? 40 : 28;

  const camera = useRef();
  const { setDefaultCamera } = useThree();

  useEffect(() => {
    setDefaultCamera(camera.current);
  }, [camera.current]);

  const parallax = useParallax();

  useFrame(() => {
    const [x, y] = parallax.getValue();
    camera.current.position.x = cameraDistance * Math.sin(0.3 * x);
    camera.current.position.z = cameraDistance * Math.cos(0.3 * x);
    camera.current.lookAt(0, 10.655, 0);
    camera.current.updateWorldMatrix();
  })

  return (
    <React.Fragment>
      <perspectiveCamera
        ref={camera}
        position={[0, 2.5, cameraDistance]}
        fov={52.411668340213666}
      />
      <Suspense fallback={null}>
        <CorporateBuilding {...props} isMobile={isMobile} />
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