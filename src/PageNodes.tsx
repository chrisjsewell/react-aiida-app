import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { AiidaXNodeTree } from './nodeTree';
import { useStyles } from './styles';


export function PageProcesses(): JSX.Element {
  const classes = useStyles();
  const [nodePrefix, setnodePrefix] = React.useState("process.");

  // TODO generate dynamically (also with number for each)
  const nodePrefixes = [
    "data.", "data.array.", "data.bool.", "data.cif.", "data.code.", "data.dict.",
    "data.float.", "data.folder.", "data.int.", "data.list.", "data.numeric.",
    "data.orbital.", "data.remote.", "data.structure.",
    "process.", "process.calculation.", "process.process.", "process.workflow."
  ]
  return (
    <Grid container spacing={2} className={classes.mainGrid} direction="row-reverse">

      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <h2>AiiDA Node Explorer</h2>

          <Grid container>

            <Grid item xs={12}>
              <Paper variant="outlined" className={classes.paper}>

                <h3>Filters</h3>
                <FormControl className={classes.formControl}>
                  <InputLabel id="node-prefix-select-label">Node Type Prefix</InputLabel>
                  <Select
                    labelId="node-prefix-select-label"
                    id="node-prefix-select"
                    value={nodePrefix}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => { setnodePrefix(event.target.value as string); }}
                  >
                    {nodePrefixes.map((name) => (
                      <MenuItem value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" className={classes.paper}>
                <h3>Database Fields</h3>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" className={classes.paper}>
                <h3>File Contents</h3>
              </Paper>
            </Grid>

          </Grid>

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
