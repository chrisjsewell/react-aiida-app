// https://dev.to/timlrx/a-comparison-of-javascript-graph-network-visualisation-libraries-34a8
// https://github.com/vasturiano/react-force-graph
// https://github.com/vasturiano/react-force-graph/issues/282
import React from 'react'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import ForceGraph2D from 'react-force-graph-2d'
import { SizeMe } from 'react-sizeme'

import { useStyles } from './styles';

export function PageNodeGraph(): JSX.Element {
    const classes = useStyles();
    return (
        <Grid container spacing={2} className={classes.mainGrid} direction="row-reverse">

            <Grid item xs={12} sm={12} md={6}>
                <Paper variant="outlined" className={classes.paper}>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <Paper variant="outlined" className={classes.paper}>
                    <AiidaNodeGraph />
                </Paper>
            </Grid>
        </Grid>
    )
}

export function AiidaNodeGraph(): JSX.Element {
    const data = {
        "nodes": [ 
            { 
              "id": "id1",
              "name": "name1",
              "val": 1 
            },
            { 
              "id": "id2",
              "name": "name2",
              "val": 10 
            },
        ],
        "links": [
            {
                "source": "id1",
                "target": "id2"
            },
        ]
    }
    return  <SizeMe>{({ size }) => <ForceGraph2D
        graphData={data}
        width={size.width === null? undefined : size.width}
        height={size.height === null? undefined : size.height}
    />}</SizeMe>
}