import React from 'react'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { useStyles } from './styles'
import { PageKeys } from './constants'
import { LinkInternal } from './hooks'
import { StructurePanel } from './components/structurePanel'
import { OptimadePanel } from './components/optimadePanel'

export function PageStructures(): JSX.Element {
  const classes = useStyles()
  return (
    <Grid container spacing={2} className={classes.mainGrid} direction="row-reverse">
      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <Accordion defaultExpanded>
            <AccordionSummary
              classes={{ content: classes.accordSumContent }}
              expandIcon={<ExpandMoreIcon />}
            >
              <h2>Structure Visualisation</h2>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <p>
                  This panel allows you to visualise structures within your database.
                </p>
                <p>
                  Simply enter a <code>StructureData</code> UUID (you can copy one from
                  the{' '}
                  <LinkInternal to={PageKeys.nodeExplorer}>Node explorer</LinkInternal>
                  ). Then you can resize the viewer, zoom in/out, rotate (left-click)
                  and pan (right-click).
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
            <AccordionSummary
              classes={{ content: classes.accordSumContent }}
              expandIcon={<ExpandMoreIcon />}
            >
              <h2>Optimade Explorer</h2>
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
