import React, { useRef } from 'react'

import { Canvas } from '@react-three/fiber'
import { Center, Line, OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'

import {
  IStructureData,
  IStructureCell,
  element2radius,
  element2colorThree,
  kinds2elMap
} from './structureUtils'

/** Create a 3D scene for a single StructureData  */
export function Structure3DViewer({
  data
}: {
  data: IStructureData
}): JSX.Element {
  // TODO I would like to add a PerspectiveCamera, to change the FoV,
  // but can't work out how to integrate it with the OrbitControls
  // https://github.com/pmndrs/drei/issues/402
  return (
    <Canvas className="structure-3d-viewer">
      <OrbitControls />

      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Center alignTop={false}>
        <Structure data={data} />
      </Center>
    </Canvas>
  )
}

/** Render a single atoms as a sphere */
function Atom({
  position,
  radius = 1,
  color = 'blue',
  opacity = 0.9
}: {
  position: Vector3
  radius: number
  color: string | number | THREE.Color
  opacity: number
}): JSX.Element {
  // This reference will give us direct access to the mesh
  const mesh = useRef() as any
  return (
    <mesh ref={mesh} position={position}>
      <sphereBufferGeometry args={[radius, 30, 30]} />
      <meshLambertMaterial color={color} transparent={true} opacity={opacity} />
    </mesh>
  )
}

function add(v1: Vector3, v2: Vector3): Vector3 {
  return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
}

/** Draw the  */
function Boundary({ cell }: { cell: IStructureCell }): JSX.Element {
  const root = new Vector3(0, 0, 0)
  const x = new Vector3(...cell[0])
  const y = new Vector3(...cell[1])
  const z = new Vector3(...cell[2])
  return (
    <React.Fragment>
      <Line
        points={[
          root,
          x,
          add(x, z),
          z,
          root,
          y,
          add(y, x),
          add(add(y, x), z),
          add(y, z),
          y,
          root
        ]}
        color="black"
        lineWidth={1}
        dashed={true}
      />
      <Line points={[z, add(y, z)]} color="black" lineWidth={1} dashed={true} />
      <Line
        points={[add(x, z), add(add(y, x), z)]}
        color="black"
        lineWidth={1}
        dashed={true}
      />
    </React.Fragment>
  )
}

/** Render a single AiiDA StructureData */
function Structure({ data }: { data: IStructureData }): JSX.Element {
  const sites = data.attributes.sites
  const kindMap = kinds2elMap(data.attributes.kinds)
  return (
    <React.Fragment>
      <Boundary cell={data.attributes.cell} />
      {sites.map(site => {
        return (
          <Atom
            position={new Vector3(...site.position)}
            radius={element2radius(kindMap[site.kind_name])}
            color={element2colorThree(kindMap[site.kind_name])}
            opacity={0.9}
          />
        )
      })}
    </React.Fragment>
  )
}
