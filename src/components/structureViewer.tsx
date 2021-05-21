import React, { useContext, useRef } from 'react'

import TextField from '@material-ui/core/TextField';
import { DataGrid, GridColDef, GridCellParams } from '@material-ui/data-grid';
import { useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { useQuery } from 'react-query'
import { Canvas } from '@react-three/fiber'
import { Center, Line, OrbitControls } from '@react-three/drei'
import { Color, Vector3 } from 'three'

import get from 'lodash.get'

import { AiidaSettingsContext, IAiidaRestNode, getNode, uuidPattern } from '../clients/aiidaClient'
import { useLocalStorage } from '../utils'

interface IStructureKind {
    name: string,
    mass: number,
    symbols: string[],
    weights: number[]
}

type IStructureCell = [
    [number, number, number],
    [number, number, number],
    [number, number, number]
]

interface IStructureData extends IAiidaRestNode {
    attributes: {
        cell: IStructureCell
        kinds: IStructureKind[]
        pbc1: boolean
        pbc2: boolean
        pbc3: boolean
        sites: {
            kind_name: string,
            position: [number, number, number]
        }[]
    }
}


/** Selector for a structure, plus visualisers */
export function StructurePanel(): JSX.Element {
    const aiidaSettings = useContext(AiidaSettingsContext)
    const [rootUUID, setrootUUID] = useLocalStorage('aiida-structure-uuid', null as null | string);
    const handleUUIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setrootUUID(event.target.value);
    }
    const result = useQuery([aiidaSettings.baseUrl, 'node', rootUUID], () => getNode(aiidaSettings.baseUrl, rootUUID), { enabled: aiidaSettings.baseUrl !== null })
    let view = null as null | JSX.Element
    // check the data is actually StructureData
    if (result.data) {
        if (result.data.attributes.cell) {
            const cell = result.data.attributes.cell
            view = (
                <React.Fragment>
                    <Structure3DViewer data={result.data as IStructureData} />
                    <Typography gutterBottom align="right">X: {vectorLength(cell[0])}; Y: {vectorLength(cell[1])}; Z: {vectorLength(cell[2])}</Typography>
                    <StructureTable data={result.data as IStructureData} />
                </React.Fragment>
            )
        } else {
            console.error("Data is not from StructureData")
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
function Atom(
    {
        position,
        radius = 1,
        color = 'blue',
        opacity = 0.9
    }: {
        position: Vector3,
        radius: number,
        color: string | number | THREE.Color,
        opacity: number
    }
): JSX.Element {
    // This reference will give us direct access to the mesh
    const mesh = useRef() as any
    return (
        <mesh
            ref={mesh}
            position={position}
        >
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
            <Line points={[root, x, add(x, z), z, root, y, add(y, x), add(add(y, x), z), add(y, z), y, root]} color="black" lineWidth={1} dashed={true} />
            <Line points={[z, add(y, z)]} color="black" lineWidth={1} dashed={true} />
            <Line points={[add(x, z), add(add(y, x), z)]} color="black" lineWidth={1} dashed={true} />
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
            {
                sites.map((site) => {
                    return <Atom
                        position={new Vector3(...site.position)}
                        radius={get(atomData, kindMap[site.kind_name], [1])[0]}
                        color={element2colorThree(kindMap[site.kind_name])}
                        opacity={0.9}
                    />
                })
            }
        </React.Fragment>
    )
}


/** Convert element to a color fr use with Three JS */
function element2colorThree(elementName: string): Color {
    return new Color(
        ...get(atomData, elementName, [1, 0, 1, 0]).slice(1, 4)
    )
}

/** Convert element to a color fr use with CSS */
function element2colorCss(elementName: string): string {
    const color = new Color(
        ...get(atomData, elementName, [1, 0, 1, 0]).slice(1, 4)
    )
    return `rgb(${color.r * 255},${color.g * 255},${color.b * 255})`
}


/** Convert list of kinds to a mapping of the kind name to the element name.
 * We take only the first element name in the list
 */
function kinds2elMap(kinds: IStructureKind[]): { [key: string]: string } {
    return kinds.reduce(
        (prev, current) => {
            prev[current.name] = (current.symbols.length ? current.symbols[0] : 'XX'); return prev
        },
        {} as { [key: string]: string }
    )
}


/** Create a table of the atoms */
function StructureTable({ data }: { data: IStructureData }): JSX.Element {
    const theme = useTheme();
    const kindMap = kinds2elMap(data.attributes.kinds)
    const columns: GridColDef[] = [
        {
            field: 'element', headerName: 'Element', width: 140, renderCell: (params: GridCellParams) => {
                const color = element2colorCss(`${params.value}`)
                return <Avatar
                    style={{ backgroundColor: color, color: theme.palette.getContrastText(color) }}
                >{params.value}</Avatar>
            }
        },
        { field: 'kind', headerName: 'Kind', width: 120 },
        { field: 'x', headerName: 'X', type: 'number' },
        { field: 'y', headerName: 'Y', type: 'number' },
        { field: 'z', headerName: 'Z', type: 'number' }
    ]
    const rows = data.attributes.sites.map((site, index) => {
        return { id: index, element: kindMap[site.kind_name], kind: site.kind_name, x: site.position[0], y: site.position[0], z: site.position[0] }
    })
    return (
        <div style={{ width: '100%' }}>
            <DataGrid autoHeight rows={rows} columns={columns} />
        </div>
    )
}

/** element name -> (radius, red, blue, green) */
const atomData = {
    XX: [0.8, 0.3, 0.3, 0.3],
    H: [0.46, 1.0, 0.8, 0.8],
    He: [1.22, 0.98907, 0.91312, 0.81091],
    Li: [1.57, 0.52731, 0.87953, 0.4567],
    Be: [1.12, 0.37147, 0.8459, 0.48292],
    B: [0.81, 0.1249, 0.63612, 0.05948],
    C: [0.77, 0.5043, 0.28659, 0.16236],
    N: [0.74, 0.69139, 0.72934, 0.9028],
    O: [0.74, 0.99997, 0.01328, 0.0],
    F: [0.72, 0.69139, 0.72934, 0.9028],
    Ne: [1.6, 0.99954, 0.21788, 0.71035],
    Na: [1.91, 0.97955, 0.86618, 0.23787],
    Mg: [1.6, 0.98773, 0.48452, 0.0847],
    Al: [1.43, 0.50718, 0.70056, 0.84062],
    Si: [1.18, 0.10596, 0.23226, 0.98096],
    P: [1.1, 0.75557, 0.61256, 0.76425],
    S: [1.04, 1.0, 0.98071, 0.0],
    Cl: [0.99, 0.19583, 0.98828, 0.01167],
    Ar: [1.92, 0.81349, 0.99731, 0.77075],
    K: [2.35, 0.63255, 0.13281, 0.96858],
    Ca: [1.97, 0.35642, 0.58863, 0.74498],
    Sc: [1.64, 0.71209, 0.3893, 0.67279],
    Ti: [1.47, 0.47237, 0.79393, 1.0],
    V: [1.35, 0.9, 0.1, 0.0],
    Cr: [1.29, 0.0, 0.0, 0.62],
    Mn: [1.37, 0.66148, 0.03412, 0.62036],
    Fe: [1.26, 0.71051, 0.44662, 0.00136],
    Co: [1.25, 0.0, 0.0, 0.68666],
    Ni: [1.25, 0.72032, 0.73631, 0.74339],
    Cu: [1.28, 0.1339, 0.28022, 0.86606],
    Zn: [1.37, 0.56123, 0.56445, 0.50799],
    Ga: [1.53, 0.62292, 0.89293, 0.45486],
    Ge: [1.22, 0.49557, 0.43499, 0.65193],
    As: [1.21, 0.45814, 0.81694, 0.34249],
    Se: [1.04, 0.6042, 0.93874, 0.06122],
    Br: [1.14, 0.49645, 0.19333, 0.01076],
    Kr: [1.98, 0.98102, 0.75805, 0.95413],
    Rb: [2.5, 1.0, 0.0, 0.6],
    Sr: [2.15, 0.0, 1.0, 0.15259],
    Y: [1.82, 0.40259, 0.59739, 0.55813],
    Zr: [1.6, 0.0, 1.0, 0.0],
    Nb: [1.47, 0.29992, 0.70007, 0.46459],
    Mo: [1.4, 0.70584, 0.52602, 0.68925],
    Tc: [1.35, 0.80574, 0.68699, 0.79478],
    Ru: [1.34, 0.81184, 0.72113, 0.68089],
    Rh: [1.34, 0.80748, 0.82205, 0.67068],
    Pd: [1.37, 0.75978, 0.76818, 0.72454],
    Ag: [1.44, 0.72032, 0.73631, 0.74339],
    Cd: [1.52, 0.95145, 0.12102, 0.86354],
    In: [1.67, 0.84378, 0.50401, 0.73483],
    Sn: [1.58, 0.60764, 0.56052, 0.72926],
    Sb: [1.41, 0.84627, 0.51498, 0.31315],
    Te: [1.37, 0.67958, 0.63586, 0.32038],
    I: [1.33, 0.55914, 0.122, 0.54453],
    Xe: [2.18, 0.60662, 0.63218, 0.97305],
    Cs: [2.72, 0.05872, 0.99922, 0.72578],
    Ba: [2.24, 0.11835, 0.93959, 0.17565],
    La: [1.88, 0.3534, 0.77057, 0.28737],
    Ce: [1.82, 0.82055, 0.99071, 0.02374],
    Pr: [1.82, 0.9913, 0.88559, 0.02315],
    Nd: [1.82, 0.98701, 0.5556, 0.02744],
    Pm: [1.81, 0.0, 0.0, 0.96],
    Sm: [1.81, 0.99042, 0.02403, 0.49195],
    Eu: [2.06, 0.98367, 0.03078, 0.83615],
    Gd: [1.79, 0.75325, 0.01445, 1.0],
    Tb: [1.77, 0.44315, 0.01663, 0.99782],
    Dy: [1.77, 0.1939, 0.02374, 0.99071],
    Ho: [1.76, 0.02837, 0.25876, 0.98608],
    Er: [1.75, 0.28688, 0.45071, 0.23043],
    Tm: [1.0, 0.0, 0.0, 0.88],
    Yb: [1.94, 0.15323, 0.99165, 0.95836],
    Lu: [1.72, 0.15097, 0.99391, 0.71032],
    Hf: [1.59, 0.70704, 0.70552, 0.3509],
    Ta: [1.47, 0.71952, 0.60694, 0.33841],
    W: [1.41, 0.55616, 0.54257, 0.50178],
    Re: [1.37, 0.70294, 0.69401, 0.55789],
    Os: [1.35, 0.78703, 0.69512, 0.47379],
    Ir: [1.36, 0.78975, 0.81033, 0.45049],
    Pt: [1.39, 0.79997, 0.77511, 0.75068],
    Au: [1.44, 0.99628, 0.70149, 0.22106],
    Hg: [1.55, 0.8294, 0.72125, 0.79823],
    Tl: [1.71, 0.58798, 0.53854, 0.42649],
    Pb: [1.75, 0.32386, 0.32592, 0.35729],
    Bi: [1.82, 0.82428, 0.18732, 0.97211],
    Po: [1.77, 0.0, 0.0, 1.0],
    At: [0.62, 0.0, 0.0, 1.0],
    Rn: [0.8, 1.0, 1.0, 0.0],
    Fr: [1.0, 0.0, 0.0, 0.0],
    Ra: [2.35, 0.42959, 0.66659, 0.34786],
    Ac: [2.03, 0.39344, 0.62101, 0.45034],
    Th: [1.8, 0.14893, 0.99596, 0.47106],
    Pa: [1.63, 0.16101, 0.98387, 0.20855],
    U: [1.56, 0.47774, 0.63362, 0.66714],
    Np: [1.56, 0.3, 0.3, 0.3],
    Pu: [1.64, 0.3, 0.3, 0.3],
    Am: [1.73, 0.3, 0.3, 0.3]
}
