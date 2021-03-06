import React, { useRef } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { Canvas } from '@react-three/fiber'
import { Center, Line, OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'

import {
  IStructureDataAttrs,
  IStructureCell,
  element2radius,
  element2colorThree,
  kinds2elMap
} from './structureUtils'

/** Create a 3D scene for a single StructureData  */
export function Structure3DViewer(props: {
  data: IStructureDataAttrs
  withBox: boolean
  images: [number, number, number][]
  height?: number | undefined
  width?: number | undefined
}): JSX.Element {
  const theme = useTheme()

  // TODO I would like to add a PerspectiveCamera, to change the FoV,
  // but can't work out how to integrate it with the OrbitControls
  // https://github.com/pmndrs/drei/issues/402

  // Note contexts are not forwarded to the canvas, unless you use https://github.com/pmndrs/drei#usecontextbridge
  return (
    <Canvas
      className="structure-3d-viewer"
      style={{ height: props.height, width: props.width }}
    >
      <OrbitControls />

      <ambientLight castShadow />
      <pointLight position={[10, 10, 10]} />

      <Center alignTop={false}>
        <Structure
          data={props.data}
          images={props.images}
          withBox={props.withBox}
          boxColor={theme.palette.text.primary}
        />
      </Center>
    </Canvas>
  )
}

Structure3DViewer.defaultProps = {
  withBox: true,
  images: [[0, 0, 0]]
}

/** Render a single AiiDA StructureData */
export function Structure(props: {
  data: IStructureDataAttrs
  images: [number, number, number][]
  withBox: boolean
  boxColor: string
}): JSX.Element {
  const [[ax, ay, az], [bx, by, bz], [cx, cy, cz]] = props.data.cell
  const sites = props.data.sites
  const kindMap = kinds2elMap(props.data.kinds)
  let boxes = null
  if (props.withBox) {
    boxes = (
      <>
        {props.images.map(([na, nb, nc]) => {
          const newCell = [
            [ax + ax * na, ay + ay * na, az + az * na],
            [bx + bx * nb, by + by * nb, bz + bz * nb],
            [cx + cx * nc, cy + cy * nc, cz + cz * nc]
          ]
          return <BoundingBox cell={newCell as IStructureCell} color={props.boxColor} />
        })}
      </>
    )
  }
  return (
    <>
      {boxes}
      {props.images.map(([na, nb, nc]) => {
        return sites.map(site => {
          const [px, py, pz] = site.position
          return (
            <Atom
              position={
                new Vector3(
                  px + ax * na + bx * nb + cx * nc,
                  py + ay * na + by * nb + cy * nc,
                  pz + az * na + bz * nb + cz * nc
                )
              }
              radius={element2radius(kindMap[site.kind_name])}
              color={element2colorThree(kindMap[site.kind_name]) as unknown as string}
            />
          )
        })
      })}
    </>
  )
}

Structure.defaultProps = {
  withBox: true,
  images: [[0, 0, 0]]
}

/** Render a single atoms as a sphere */
export function Atom(props: {
  position: Vector3
  radius: number
  color: string | number | THREE.Color
  opacity: number
}): JSX.Element {
  // This reference will give us direct access to the mesh
  const mesh = useRef() as any
  return (
    <mesh ref={mesh} position={props.position}>
      <sphereBufferGeometry args={[props.radius, 30, 30]} />
      <meshLambertMaterial
        color={props.color as string}
        transparent={true}
        opacity={props.opacity}
      />
    </mesh>
  )
}

Atom.defaultProps = {
  radius: 1,
  color: 'blue',
  opacity: 0.9
}

function add(v1: Vector3, v2: Vector3): Vector3 {
  return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z)
}

/** Draw the boundary box for the unit cell */
function BoundingBox({
  cell,
  color
}: {
  cell: IStructureCell
  color: string
}): JSX.Element {
  const root = new Vector3(0, 0, 0)
  const x = new Vector3(...cell[0])
  const y = new Vector3(...cell[1])
  const z = new Vector3(...cell[2])
  return (
    <>
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
        color={color}
        lineWidth={1}
        transparent={true}
        opacity={0.9}
        dashed={true}
      />
      <Line points={[z, add(y, z)]} color={color} lineWidth={1} dashed={true} />
      <Line
        points={[add(x, z), add(add(y, x), z)]}
        color={color}
        lineWidth={1}
        dashed={true}
      />
    </>
  )
}

BoundingBox.defaultProps = {
  color: 'black'
}
