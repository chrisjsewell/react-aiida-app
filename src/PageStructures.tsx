import React from 'react'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { Link } from 'react-router-dom'

import { useStyles } from './styles'
import { PageKeys } from './constants'
import { StructurePanel } from './components/structurePanel'
import { OptimadePanel } from './components/optimadePanel'

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
                <p>
                  You can also search for and visualise structures from an{' '}
                  <a href="https://www.optimade.org" target="_blank" rel="noopener">
                    Optimade compliant database
                  </a>
                  . It is intended that eventually you will be able to import these
                  structures directly into your AiiDA database.
                </p>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3>Optimade Explorer</h3>
            </AccordionSummary>
            <AccordionDetails>
              <OptimadePanel />
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
