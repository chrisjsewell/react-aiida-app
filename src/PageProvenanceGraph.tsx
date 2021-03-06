import React from 'react'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'

import { uuidPattern } from './clients/aiidaClient'
import { useStyles } from './styles'
import { LocalStorageKeys, PageKeys } from './constants'
import { LinkInternal, useLocalStorage } from './hooks'
import { AiidaProvenanceGraph, DagType } from './components/provenanceGraph'

export function PageProvenanceGraph(): JSX.Element {
  const classes = useStyles()
  const [rootUUID, setrootUUID] = useLocalStorage(
    LocalStorageKeys.aiidaProvenanceRootUUID,
    null as null | string
  )
  const [dagMode, setdagMode] = useLocalStorage(
    LocalStorageKeys.aiidaProvenanceDagMode,
    'lr' as DagType
  )
  const [dagLevelDistance, setdagLevelDistance] = useLocalStorage(
    LocalStorageKeys.aiidaProvenanceDagLevel,
    50
  )

  const handleUUIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setrootUUID(event.target.value)
  }

  return (
    <Grid container spacing={2} className={classes.mainGrid} direction="row-reverse">
      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <Accordion defaultExpanded>
            <AccordionSummary
              classes={{ content: classes.accordSumContent }}
              expandIcon={<ExpandMoreIcon />}
            >
              <h2>Provenance Graph Visualisation</h2>
            </AccordionSummary>
            <AccordionDetails>
              <ProvenanceGraphIntroduction />
            </AccordionDetails>
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
          <FormControl fullWidth>
            <InputLabel id="dag-mode-select-label">DAG Mode</InputLabel>
            <Select
              labelId="dag-mode-select-label"
              id="dag-mode-select"
              value={dagMode}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                setdagMode(event.target.value as DagType)
              }}
            >
              {['td', 'bu', 'lr', 'rl', 'radialout', 'radialin'].map(name => (
                <MenuItem value={name}>{name}</MenuItem>
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
              onChange={(
                event: React.ChangeEvent<unknown>,
                value: number | number[]
              ) => {
                setdagLevelDistance(value as number)
              }}
            />
          </FormControl>
          <AiidaProvenanceGraph
            nodeUUID={rootUUID}
            dagMode={dagMode}
            dagLevelDistance={dagLevelDistance}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}

export function ProvenanceGraphIntroduction(): JSX.Element {
  return (
    <div>
      <p>This is a work in progress!</p>
      <p>
        Input a root node UUID (you can copy one from the{' '}
        <LinkInternal to={PageKeys.nodeExplorer}>Node explorer</LinkInternal>) and you
        will see a visualisation of its local provenance graph.
      </p>
      <p>
        Hover over a node or link to see more information about it (you may have to
        click on the area first).
      </p>
      <p>Eventually it is intended to add features like click-to-expand.</p>
    </div>
  )
}
