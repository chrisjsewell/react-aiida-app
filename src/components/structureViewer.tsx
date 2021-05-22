import React, { useContext, useRef } from 'react'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { useQuery } from 'react-query'
import { Canvas } from '@react-three/fiber'
import { Center, Line, OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'

import {
  AiidaSettingsContext,
  getNode,
  uuidPattern
} from '../clients/aiidaClient'
import { useLocalStorage } from '../utils'
import {
  IStructureData,
  IStructureCell,
  element2radius,
  element2colorThree,
  kinds2elMap
} from './structureUtils'
import { StructureTable } from './structureTable'

/** Selector for a structure, plus visualisers */
export function StructurePanel(): JSX.Element {
  const aiidaSettings = useContext(AiidaSettingsContext)
  const [rootUUID, setrootUUID] = useLocalStorage(
    'aiida-structure-uuid',
    null as null | string
  )
  const handleUUIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setrootUUID(event.target.value)
  }
  const result = useQuery(
    [aiidaSettings.baseUrl, 'node', rootUUID],
    () => getNode(aiidaSettings.baseUrl, rootUUID),
    { enabled: aiidaSettings.baseUrl !== null }
  )
  let view = null as null | JSX.Element
  // check the data is actually StructureData
  if (result.data) {
    if (result.data.attributes.cell) {
      const cell = result.data.attributes.cell
      view = (
        <React.Fragment>
          <Structure3DViewer data={result.data as IStructureData} />
          <Typography gutterBottom align="right">
            X: {vectorLength(cell[0])}; Y: {vectorLength(cell[1])}; Z:{' '}
            {vectorLength(cell[2])}
          </Typography>
          <StructureTable data={result.data as IStructureData} />
        </React.Fragment>
      )
    } else {
      console.error('Data is not from StructureData')
    }
  }

  return (
    <React.Fragment>
      <TextField
        label="StructureData UUID"
        value={rootUUID || ''}
        onChange={handleUUIDChange}
        error={rootUUID ? !uuidPattern.test(rootUUID) : false}
        // helperText={!result.error ? undefined : `${result.error}`}
        fullWidth
      />
      {view}
    </React.Fragment>
  )
}

/** Create a 3D scene for a single StructureData  */
function Structure3DViewer({ data }: { data: IStructureData }): JSX.Element {
  // TODO I would like to add a PerspectiveCamera, to change the FoV,
  // but can't work out how to integrate it with the OrbitControls
  // https://github.com/pmndrs/drei/issues/402
  return (
    <Canvas>
      <OrbitControls />

      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Center alignTop={false}>
        <Structure data={data} />
      </Center>
    </Canvas>
  )
}

/** Get the length of a 3D vector */
function vectorLength(point: [number, number, number]) {
  const vector = new Vector3(...point)
  return vector.length().toFixed(2)
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
