import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { AiidaXTree } from './tree';
import { useStyles } from './styles';


export function PageProcesses(baseUrl: { value: string; error: boolean; }): JSX.Element {
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.mainGrid}>

      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <h2>AiiDA Processes</h2>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
            <AiidaXTree />
        </Paper>
      </Grid>

    </Grid>
  );
}
