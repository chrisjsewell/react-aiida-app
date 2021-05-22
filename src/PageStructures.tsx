import React from 'react'

import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { Link } from 'react-router-dom'

import { useStyles } from './styles'
import PageKeys from './pages'
import { StructurePanel } from './components/structurePanel'

export function PageStructures(): JSX.Element {
  const classes = useStyles()
  return (
    <Grid container spacing={2} className={classes.mainGrid} direction="row-reverse">
      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3>Structure Visualisation</h3>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <p>
                  This panel allows you to visualise structures within your database.
                </p>
                <p>
                  Simply enter a <code>StructureData</code> UUID (you can copy one from
                  the <Link to={PageKeys.nodeExplorer}>Node explorer</Link>). Then you
                  can resize the viewer, zoom in/out, rotate (left-click) and pan
                  (right-click).
                </p>
              </div>
            </AccordionDetails>
          </Accordion>
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
