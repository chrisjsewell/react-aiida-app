import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useStyles } from './styles';


export function PageHome(): JSX.Element {
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.mainGrid}>
      <Grid item xs={12}>
        <Paper variant="outlined" className={classes.paper}>
          <InfoBox />
        </Paper>
      </Grid>
    </Grid>
  );
}

export function InfoBox(): JSX.Element {
  return (
    <aside>
      <h2>Introduction</h2>
      <p>
        This is a demonstration of the AiiDA Dashboard:<br />
        A web-based UI for interfacing with AiiDA.
      </p>
      <p>
        AiiDA Dashboard uses industry leading libraries, to create a beautiful and responsive UI:
      </p>
      <ul>
        <li><a href="https://reactjs.org/">React</a>: A library for building user interfaces, maintained by Facebook and with users including Whatsapp, Dropbox and Netflix.</li>
        <li><a href="https://material-ui.com">Material-UI</a>: A React component library that implements <a href="https://material.io/design">Google’s Material Design</a> guidelines.</li>
        <li><a href="https://react-query.tanstack.com/">react-query</a>: A React component for synchronizing server data (from AiiDA) with the UI.</li>
      </ul>
      <p>
        AiiDA Dashboard can be used as a standalone Web UI, or it also provides React components and facilitates wrapping into a JupyterLab <a href="https://jupyterlab.readthedocs.io/en/stable/extension/virtualdom.html">extension widget</a>.
      </p>
    </aside>
  )
}
