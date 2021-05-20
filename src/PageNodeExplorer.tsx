import React, { useContext } from 'react'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress'
// import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

import { useQuery } from 'react-query'
import ReactJson from 'react-json-view'

import { AiidaSettingsContext, getNodeStatistics, getNode } from './aiidaClient'
import { AiidaNodeTree } from './nodeTree';
import { useStyles } from './styles';
import { useLocalStorage } from './utils'


export function PageNodeExplorer(): JSX.Element {
  const classes = useStyles();
  const [nodePrefix, setnodePrefix] = useLocalStorage('aiida-node-explorer-type-prefix',  "");
  const [nodeFieldsUUID, setnodeFieldsUUID] = React.useState(null as string | null);

  return (
    <Grid container spacing={2} className={classes.mainGrid} direction="row-reverse">

      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}><h3>AiiDA Node Explorer</h3></AccordionSummary>
            <AccordionDetails><NodeExplorerIntroduction /></AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}><h3>Filters</h3></AccordionSummary>
            <AccordionDetails>
              <NodeExplorerFilters nodePrefix={nodePrefix} setnodePrefix={setnodePrefix} />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}><h3>Database Fields</h3></AccordionSummary>
            <AccordionDetails className={classes.overflowAuto}><NodeExplorerAttributes nodeFieldsUUID={nodeFieldsUUID} setnodeFieldsUUID={setnodeFieldsUUID} /></AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}><h3>File Contents</h3></AccordionSummary>
            <AccordionDetails>TODO ...</AccordionDetails>
          </Accordion>

        </Paper>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <AiidaNodeTree nodePrefix={nodePrefix} />
        </Paper>
      </Grid>

    </Grid>
  );
}


export function NodeExplorerIntroduction(): JSX.Element {
  return (
      <div>
        <p>The node explorer allows you to visualise the nodes in your AiiDA profile as a filtered tree.</p>
        <p>Use the filter section below to select which node type you want to explore.</p>
        <p>
          You can right-click on a node to see additional actions,
          including copying its UUID to the clipboard.
          You can use this to show all of if its content in the "Database Fields" section.
          </p>
      </div>
  )
}

const nodePrefixesDefault = {
  "": null, "data.": null, "data.array.": null, "data.bool.": null, "data.cif.": null, "data.code.": null, "data.dict.": null,
  "data.float.": null, "data.folder.": null, "data.int.": null, "data.list.": null, "data.numeric.": null,
  "data.orbital.": null, "data.remote.": null, "data.structure.": null,
  "process.": null, "process.calculation.": null, "process.workflow.": null
} as { [key: string]: null | number }

export function NodeExplorerFilters({ nodePrefix, setnodePrefix }: { nodePrefix: string, setnodePrefix: React.Dispatch<React.SetStateAction<string>> }): JSX.Element {
  const classes = useStyles();
  const aiidaSettings = useContext(AiidaSettingsContext)
  const result = useQuery([aiidaSettings.baseUrl, 'statistics'], () => getNodeStatistics(aiidaSettings.baseUrl), { enabled: aiidaSettings.baseUrl !== null })

  let nodePrefixes = nodePrefixesDefault
  if (result.data) {
    nodePrefixes = result.data.types
    // TODO do this programmatically
    nodePrefixes[""] = result.data.total
    nodePrefixes["data."] = null
    nodePrefixes["process."] = null
    nodePrefixes["process.calculation."] = null
    nodePrefixes["process.workflow."] = null
  }

  return (
    <React.Fragment>
      <FormControl className={classes.formControl}>
        <InputLabel id="node-prefix-select-label">Node Type Prefix</InputLabel>
        <Select
          labelId="node-prefix-select-label"
          id="node-prefix-select"
          value={nodePrefix}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => { setnodePrefix(event.target.value as string); }}
        >
          {Object.entries(nodePrefixes).sort().map(([name, count]) => (
            <MenuItem value={name}>
              {count === null ? name : `${name || 'ALL'} (${count})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  )
}

export function NodeExplorerAttributes({ nodeFieldsUUID, setnodeFieldsUUID }: { nodeFieldsUUID: null | string, setnodeFieldsUUID: React.Dispatch<React.SetStateAction<string | null>> }): JSX.Element {
  const classes = useStyles();
  const aiidaSettings = useContext(AiidaSettingsContext)
  const result = useQuery([aiidaSettings.baseUrl, 'node', nodeFieldsUUID], () => getNode(aiidaSettings.baseUrl, nodeFieldsUUID), { enabled: aiidaSettings.baseUrl !== null })
  const handleUUIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setnodeFieldsUUID(event.target.value);
  }
  let view = null as null | JSX.Element
  if (result.data) {
    view = <ReactJson src={result.data} collapseStringsAfterLength={40} />
  } else if (result.isFetching) {
    view = <CircularProgress />
  }
  return (
    <Grid container>
      <Grid xs={12}>
        <TextField
          label="UUID"
          value={nodeFieldsUUID}
          onChange={handleUUIDChange}
          error={!!result.error}
          helperText={!result.error ? undefined : `${result.error}`}
          fullWidth
        />
      </Grid>
      <Grid xs={12} className={classes.padTop}>
        {view}
      </Grid>
    </Grid>
  )
}
