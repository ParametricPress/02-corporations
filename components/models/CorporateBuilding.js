/*
auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import * as THREE from 'three'
import React, { useRef, useEffect, useMemo } from 'react'
import { useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { meshopt } from '../../lib/meshopt'
import { Html } from 'drei'
import Fire from './Fire'
import Smoke from './Smoke'

function HtmlLabel({active, demand, setDemand, isMobile}) {
  return (
    <Html zIndexRange={[950, 0]} style={{position: "relative"}}>
      <button 
        className={`outro-scene-label${ active ? ' outro-scene-label-active' : '' }`}
        onClick={() => setDemand(demand)}
      >
        {isMobile ? demand.index + 1 : `${demand.index + 1}. ${demand.title}`}
      </button>
    </Html>
  )
}

const pad = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const getEmptyName = (i, emptyPattern) => (i > 0 ? `${emptyPattern}${pad(i, 3)}` : emptyPattern);

const emptyLookup = (nodes, i, emptyPattern) => {
  return nodes[getEmptyName(i, emptyPattern)];
}

const getEmptyCount = (nodes, emptyPattern) => {
  let count = 0;
  while (getEmptyName(count, emptyPattern) in nodes) {
    count++;
  }
  return count;
}

function Rooms({ name, emptyPattern, nodes, materials, ...props }) {
  const count = useMemo(() => {
    return getEmptyCount(nodes, emptyPattern);
  }, [name, emptyPattern, nodes]);

  const instancedMeshes = useMemo(() => {
    const group = nodes[name].children[0];
    const meshes = group.children;
    return meshes.map(mesh => {
      const instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, count);
      for (let i = 0; i < count; i++) {
        group.updateMatrix();
        const empty = emptyLookup(nodes, i, emptyPattern);
        empty.updateMatrix();
        const matrix = empty.matrix.multiply(group.matrix);
        instancedMesh.setMatrixAt(i, matrix);
      }
      instancedMesh.instanceMatrix.needsUpdate = true;
      return instancedMesh;
    });
  }, [name, emptyPattern, nodes, materials]);

  return (
    <group {...props}>
      {instancedMeshes.map(instancedMesh => (
        <primitive key={instancedMesh.uuid} object={instancedMesh} />
      ))}
    </group>
  )
}


export default function Model({ isMobile, demands, demand, setDemand, ...props }) {
  const group = useRef()
  const { nodes, materials, cameras } = useLoader(GLTFLoader, './static/gltf/corporate-building.glb', meshopt())

  return (
    <group ref={group} {...props}>
      <group
        position={[-18.571188, 0.85291, -16.1750889]}
        rotation={[1e-7, 0.8021532, Math.PI / 2]}
        scale={[1.2191998, 1.2191998, 1.2191999]}>
        <mesh
          material={materials.Trees}
          geometry={nodes.mesh_0.geometry}
          position={[-47.8668327, -7.5675559, -27.4320488]}
          scale={[0.0059873, 0.0059873, 0.0059873]}
        />
      </group>
      <group position={[0, 2.286001, -4.572]}>
        <mesh
          material={materials['Building Exterior']}
          geometry={nodes.mesh_1.geometry}
          position={[-47.8668327, -7.5675559, -27.4320488]}
          scale={[0.0059873, 0.0059873, 0.0059873]}
        />
      </group>
      <group position={[0, 2.286001, -4.572]}>
        <mesh
          material={materials.Terrain}
          geometry={nodes.mesh_2.geometry}
          position={[-47.8668327, -7.5675559, -27.4320488]}
          scale={[0.0059873, 0.0059873, 0.0059873]}
        />
      </group>
      <group position={[34.4775696, 2.2860031, -16.4591999]}>
        <mesh
          material={materials.Refinery}
          geometry={nodes.mesh_3.geometry}
          position={[-47.8668327, -7.5675559, -27.4320488]}
          scale={[0.0059873, 0.0059873, 0.0059873]}
        />
      </group>
      <Rooms 
        name="Room_1"
        emptyPattern="emptyRoom_1"
        nodes={nodes}
        materials={materials}
      />
      <Rooms 
        name="Room_2"
        emptyPattern="emptyRoom_2"
        nodes={nodes}
        materials={materials}
      />
      <Rooms 
        name="Room_3"
        emptyPattern="emptyRoom_3"
        nodes={nodes}
        materials={materials}
      />
      <Rooms 
        name="Room_4"
        emptyPattern="emptyRoom_4"
        nodes={nodes}
        materials={materials}
      />
      <Rooms 
        name="Room_5"
        emptyPattern="emptyRoom_5"
        nodes={nodes}
        materials={materials}
      />
      <Rooms 
        name="Room_6"
        emptyPattern="emptyRoom_6"
        nodes={nodes}
        materials={materials}
      />
      <Rooms 
        name="Room_7"
        emptyPattern="emptyRoom_7"
        nodes={nodes}
        materials={materials}
      />
      <Rooms 
        name="Lab"
        emptyPattern="emptyLab"
        nodes={nodes}
        materials={materials}
      />
      <Rooms 
        name="Board_Room"
        emptyPattern="emptyBoard_Room"
        nodes={nodes}
        materials={materials}
      />
      <group position-y={2}>
        <Fire position={nodes.emptyFire.position} scale={[3, 4, 3]} />
        <Fire position={nodes.emptyFire001.position} scale={[5, 6, 5]} />
        <Fire position={nodes.emptyFire002.position} scale={[5, 6, 5]} />
        <Fire position={nodes.emptyFire003.position} scale={[4, 5, 4]} />
      </group>
      <group position-y={15}>
        <Smoke position={nodes.emptySmoke.position} scale={[6, 30, 6]} />
        <Smoke position={nodes.emptySmoke001.position} scale={[6, 30, 6]} />
      </group>
      <group scale-x={isMobile ? 0.5 : 1} >
        {demands.list().map(currentDemand => (
          <group
            key={currentDemand.id}
            position={currentDemand.position}
            rotation={[Math.PI / 2, 0, 0]}
          >
          <HtmlLabel
            active={currentDemand.id == demand.id}
            demand={currentDemand}
            setDemand={setDemand}
            isMobile={isMobile}
          />
        </group>
      ))}
      </group>
    </group>
  )
}
