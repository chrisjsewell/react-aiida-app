import React from 'react'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { useStyles } from './styles'
import { StructurePanel } from './components/structurePanel'

export function PageStructures(): JSX.Element {
  const classes = useStyles()
  return (
    <Grid
      container
      spacing={2}
      className={classes.mainGrid}
      direction="row-reverse"
    >
      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <div>
            <h2>Structure Visualisation</h2>
            <p>
              This will eventually be our structure visualiser (coupled with the
              Optimade Client).
            </p>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <StructurePanel />
        </Paper>
      </Grid>
    </Grid>
  )
}
