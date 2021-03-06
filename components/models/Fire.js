import * as THREE from "three";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import FireMaterial from '../materials/FireMaterial';

export default function Fire({...props}) {
  const [clock] = useState(() => new THREE.Clock())
  const fire = useRef();
  const material = useRef();
  const flameTexture = useLoader(THREE.TextureLoader, './static/textures/fire.png');
  flameTexture.magFilter = flameTexture.minFilter = THREE.LinearFilter;
  flameTexture.wrapS = flameTexture.wrapT = THREE.ClampToEdgeWrapping;

  material.current = useMemo(() => {
    const material = (new FireMaterial()).clone();
    material.seed = Math.random() * 19.19;
    material.flameTexture = flameTexture;
    return material;
  }, []);

  useFrame(() => {
    let invModelMatrix = material.current.invModelMatrix;
    fire.current.updateMatrixWorld();
    invModelMatrix.getInverse( fire.current.matrixWorld );
    material.current.time = clock.getElapsedTime();
    material.current.invModelMatrix = invModelMatrix;
    material.current.scale = fire.current.scale;
  });

  return (
    <mesh
      ref={fire}
      material={material.current}
      {...props}
    >
      <boxBufferGeometry
        attach="geometry"
        args={[1, 1, 1]}
      />
    </mesh>
  )
}