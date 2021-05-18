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

import { useQuery } from 'react-query'

import { AiidaXNodeTree } from './nodeTree';
import { useStyles } from './styles';
import { AiidaSettingsContext, getNodeStatistics } from './aiidaClient'


export function PageProcesses(): JSX.Element {
  const classes = useStyles();
  const [nodePrefix, setnodePrefix] = React.useState("process.");
  // const [nodeFieldsId, setnodeFieldsId] = React.useState("process.");

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
            <AccordionDetails>a</AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}><h3>File Contents</h3></AccordionSummary>
            <AccordionDetails>a</AccordionDetails>
          </Accordion>

        </Paper>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <AiidaXNodeTree nodePrefix={nodePrefix} />
        </Paper>
      </Grid>

    </Grid>
  );
}


export function NodeExplorerIntroduction(): JSX.Element {
  return (
    <React.Fragment>
      <div>
        <p>The node explorer allows you to visualise the nodes in your AiiDA profile as a filtered tree.</p>
        <p>Use the filter section below to select which node type you want to explore.</p>
      </div>
    </React.Fragment>
  )
}

const nodePrefixesDefault = {
  "data.": null, "data.array.": null, "data.bool.": null, "data.cif.": null, "data.code.": null, "data.dict.": null,
  "data.float.": null, "data.folder.": null, "data.int.": null, "data.list.": null, "data.numeric.": null,
  "data.orbital.": null, "data.remote.": null, "data.structure.": null,
  "process.": null, "process.calculation.": null, "process.workflow.": null
} as {[key: string]: null | number}

export function NodeExplorerFilters({ nodePrefix, setnodePrefix }: { nodePrefix: string, setnodePrefix: React.Dispatch<React.SetStateAction<string>> }): JSX.Element {
  const classes = useStyles();
  const aiidaSettings = useContext(AiidaSettingsContext)
  const result = useQuery([aiidaSettings.baseUrl, 'statistics'], () => getNodeStatistics(aiidaSettings.baseUrl), { enabled: aiidaSettings.baseUrl !== null })

  let nodePrefixes = nodePrefixesDefault
  if (result.data) {
    nodePrefixes = result.data.types
    // TODO do this programmatically
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
              {count===null? name: `${name} (${count})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  )
}