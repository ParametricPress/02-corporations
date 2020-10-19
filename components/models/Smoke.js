import * as THREE from "three";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLoader, useFrame } from 'react-three-fiber';
import FireMaterial from '../materials/FireMaterial';

export default function Smoke({...props}) {
  const [clock] = useState(() => new THREE.Clock())
  const fire = useRef();
  const material = useRef();
  const flameTexture = useLoader(THREE.TextureLoader, './static/textures/smoke.png');
  flameTexture.magFilter = flameTexture.minFilter = THREE.LinearFilter;
  flameTexture.wrapS = flameTexture.wrapT = THREE.ClampToEdgeWrapping;

  material.current = useMemo(() => {
    const material = (new FireMaterial()).clone();
    material.seed = Math.random() * 19.19;
    material.flameTexture = flameTexture;
    material.color = new THREE.Color(0x555555);
    material.intensity = 0.6;
    material.lacunity = 0.2;
    material.noiseScale.y = 1.0;
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