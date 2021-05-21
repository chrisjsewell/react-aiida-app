import React, { useContext, useEffect, useRef } from 'react'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import ForceGraph2D, { NodeObject, LinkObject, ForceGraphMethods } from 'react-force-graph-2d'
import { forceCollide } from 'd3-force'
import { useQuery } from 'react-query'
import { SizeMe } from 'react-sizeme'

import { AiidaSettingsContext, IAiidaRestNodeLinkItem, getNodeOutgoing, getNodeIncoming, uuidPattern } from './aiidaClient'
import { useStyles } from './styles';
import { useLocalStorage } from './utils'


type DagType = 'td' | 'bu' | 'lr' | 'rl' | 'radialout' | 'radialin'


export function PageProvenanceGraph(): JSX.Element {
    const classes = useStyles();
    const [rootUUID, setrootUUID] = useLocalStorage('aiida-provenence-graph-root-uuid', null as null | string);
    const [dagMode, setdagMode] = useLocalStorage('aiida-provenence-graph-dag-mode', 'lr' as DagType);
    const [dagLevelDistance, setdagLevelDistance] = useLocalStorage('aiida-provenence-graph-dag-level-dist', 50);

    const handleUUIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setrootUUID(event.target.value);
    }

    return (
        <Grid container spacing={2} className={classes.mainGrid} direction="row-reverse">

            <Grid item xs={12} sm={12} md={6}>
                <Paper variant="outlined" className={classes.paper}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}><h3>Provenance Graph Visualisation</h3></AccordionSummary>
                        <AccordionDetails><ProvenanceGraphIntroduction /></AccordionDetails>
                    </Accordion>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <Paper variant="outlined" className={classes.paper}>
                    <TextField
                        label="Root UUID"
                        value={rootUUID || ''}
                        onChange={handleUUIDChange}
                        error={rootUUID ? !uuidPattern.test(rootUUID) : false}
                        // helperText={!result.error ? undefined : `${result.error}`}
                        fullWidth
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="dag-mode-select-label">DAG Mode</InputLabel>
                        <Select
                            labelId="dag-mode-select-label"
                            id="dag-mode-select"
                            value={dagMode}
                            onChange={(event: React.ChangeEvent<{ value: unknown }>) => { setdagMode(event.target.value as DagType); }}
                        >
                            {['td', 'bu', 'lr', 'rl', 'radialout', 'radialin'].map((name) => (
                                <MenuItem value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>

                        <Typography id="discrete-slider" gutterBottom>
                            DAG Level Distance
                        </Typography>
                        <Slider
                            defaultValue={dagLevelDistance}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={10}
                            marks
                            min={10}
                            max={200}
                            onChange={(event: React.ChangeEvent<{}>, value: number | number[]) => { setdagLevelDistance(value as number); }}
                        />
                    </FormControl>
                    <AiidaProvenanceGraph nodeUUID={rootUUID} dagMode={dagMode} dagLevelDistance={dagLevelDistance} />
                </Paper>
            </Grid>
        </Grid>
    )
}


export function ProvenanceGraphIntroduction(): JSX.Element {
    return (
        <div>
            <p>This is a work in progress!</p>
            <p>Input a root node UUID and you will see a visualisation of its local provenance graph.</p>
            <p>Hover over a node or link to see more information about it (you may have to click on the area first).</p>
            <p>Eventually it is intended to add features like click-to-expand.</p>
        </div>
    )
}

interface Node2dObject extends NodeObject {
    name?: string
    label?: string
    color?: string
    fillColor?: string
    val?: number
    __bckgDimensions?: number[]
}

export function AiidaProvenanceGraph({ nodeUUID, dagMode, dagLevelDistance }: { nodeUUID: string | null, dagMode: DagType, dagLevelDistance: number }): JSX.Element {
    const fgRef = useRef();
    const aiidaSettings = useContext(AiidaSettingsContext)
    const resultIncoming = useQuery([aiidaSettings.baseUrl, 'nodeIncoming', nodeUUID], () => getNodeIncoming(aiidaSettings.baseUrl, nodeUUID), { enabled: aiidaSettings.baseUrl !== null })
    const resultOutgoing = useQuery([aiidaSettings.baseUrl, 'nodeOutgoing', nodeUUID], () => getNodeOutgoing(aiidaSettings.baseUrl, nodeUUID), { enabled: aiidaSettings.baseUrl !== null })

    useEffect(() => {
        // add collision force
        const fg = fgRef.current as undefined | ForceGraphMethods
        if (fg !== undefined) {
            // Deactivate existing forces
            // @ts-ignore
            fg.d3Force('charge', null);
            // @ts-ignore
            fg.d3Force('collision', forceCollide(15));
            // fg.d3Force('box' ...
        }
    }, [resultIncoming, resultOutgoing]);

    const rootNode = {
        "id": "root",
        "name": "root",
        "label": "ROOT",
        "val": 2,
        "color": "red",
    } as Node2dObject
    let nodes = [rootNode] as Node2dObject[]
    let links = [] as LinkObject[]

    if (resultIncoming.data) {
        nodes.push(...resultIncoming.data.map((node) => {
            return createNodeData(node)
        }))
        links.push(...resultIncoming.data.map((node) => {
            return {
                "target": "root",
                "source": `${node.id}`,
                "name": `${node.link_label}`
            }
        }))
    }
    if (resultOutgoing.data) {
        nodes.push(...resultOutgoing.data.map((node) => {
            return createNodeData(node)
        }))
        links.push(...resultOutgoing.data.map((node) => {
            return {
                "source": "root",
                "target": `${node.id}`,
                "name": `${node.link_label}`
            }
        }))
    }

    const data = {
        "nodes": nodes,
        "links": links
    }
    return (
        <SizeMe>
            {({ size }) => <ForceGraph2D
                ref={fgRef}
                graphData={data}
                width={size.width === null ? undefined : size.width}
                height={size.height === null ? undefined : size.height}
                dagMode={dagMode}
                dagLevelDistance={dagLevelDistance}
                nodeCanvasObject={nodeCanvasObject}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
            />}
        </SizeMe>
    )
}


function createNodeData(node: IAiidaRestNodeLinkItem): Node2dObject {
    const node_type = node.node_type.split(".")
    node_type.pop()
    return {
        "id": `${node.id}`,
        "name": `${node.id}${node.process_type? ', ' + node.process_type : ''}`,
        "label": node_type.pop(),
        "val": 40,
        "color": "blue",
    }
}


function nodeCanvasObject(node: Node2dObject, ctx: CanvasRenderingContext2D, globalScale: number): void {
    const label = `${node.label || ""}`;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
    if (node.x !== undefined && node.y !== undefined) {
        if (node.fillColor) {
            ctx.fillStyle = node.fillColor || 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
        }
        ctx.strokeRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
        ctx.fillStyle = node.color || "white";
        ctx.fillText(label, node.x, node.y);
    }

    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
}