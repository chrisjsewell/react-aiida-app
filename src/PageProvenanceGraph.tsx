// https://dev.to/timlrx/a-comparison-of-javascript-graph-network-visualisation-libraries-34a8
// https://github.com/vasturiano/react-force-graph
// https://github.com/vasturiano/react-force-graph/issues/282
import React, { useContext } from 'react'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import ForceGraph2D from 'react-force-graph-2d'
import { useQuery } from 'react-query'
import { SizeMe } from 'react-sizeme'

import { AiidaSettingsContext, getNodeOutgoing } from './aiidaClient'
import { useStyles } from './styles';

export function PageProvenanceGraph(): JSX.Element {
    const classes = useStyles();
    return (
        <Grid container spacing={2} className={classes.mainGrid} direction="row-reverse">

            <Grid item xs={12} sm={12} md={6}>
                <Paper variant="outlined" className={classes.paper}>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <Paper variant="outlined" className={classes.paper}>
                    <AiidaProvenanceGraph nodeUUID="66218f40-bd92-4862-b78e-2439e56bdcf6" />
                </Paper>
            </Grid>
        </Grid>
    )
}

export function AiidaProvenanceGraph({ nodeUUID }: { nodeUUID: string | null }): JSX.Element {
    const aiidaSettings = useContext(AiidaSettingsContext)
    const result = useQuery([aiidaSettings.baseUrl, 'nodeOutgoing', nodeUUID], () => getNodeOutgoing(aiidaSettings.baseUrl, nodeUUID), { enabled: aiidaSettings.baseUrl !== null })
    let data = {
        "nodes": [
            {
                "id": "id1",
                "name": "placeholder",
                "val": 1
            },
        ],
        "links": [] as {source: string, target: string}[]
    }
    if (result.data) {
        const nodes = [{"id": "0", "name": "root", "val": 1}, ...result.data.map((node) => {return {"id": `${node.id}`, "name": node.uuid, "val": 1}})]
        const links = result.data.map((node) => {return {"source": "0", "target": `${node.id}`}})
        data = {nodes, links}
    }
    return <SizeMe>{({ size }) => <ForceGraph2D
        graphData={data}
        width={size.width === null ? undefined : size.width}
        height={size.height === null ? undefined : size.height}
        dagMode='td'
    />}</SizeMe>
}