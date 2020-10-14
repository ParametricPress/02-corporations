import * as THREE from "three";
import React, { useRef, useState } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import FireMaterial from '../materials/FireMaterial';

export default function Fire({color, ...props}) {
  const [clock] = useState(() => new THREE.Clock())
  const fire = useRef();
  const material = useRef();
  const fireTex = useLoader(THREE.TextureLoader, './static/textures/fire.png');
 
  fireTex.magFilter = fireTex.minFilter = THREE.LinearFilter;
  fireTex.wrapS = fireTex.wrapT = THREE.ClampToEdgeWrapping;

  useFrame(() => {
    let invModelMatrix = material.current.invModelMatrix;
    fire.current.updateMatrixWorld();
    invModelMatrix.getInverse( fire.current.matrixWorld );
    material.current.time = clock.getElapsedTime();
    material.current.invModelMatrix = invModelMatrix;
    material.current.scale = fire.current.scale;
  });

  return (
    <mesh ref={fire} {...props}>
      <boxBufferGeometry
        attach="geometry"
        args={[1, 1, 1]}
      />
      <fireMaterial
        attach="material"
        ref={material}
        color={color || "0xeeeeee"}
        fireTex={fireTex}
        seed={Math.random() * 19.19}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}