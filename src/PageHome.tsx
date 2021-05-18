import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import * as MuiIcons from '@material-ui/icons';
import SyntaxHighlighter from 'react-syntax-highlighter';

import { useStyles } from './styles';


export function PageHome(): JSX.Element {
  const classes = useStyles();
  return (
    <Grid container spacing={2} className={classes.mainGrid}>
      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <IntroBox />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <GettingStartedBox />
        </Paper>
      </Grid>
    </Grid>
  );
}

export function IntroBox(): JSX.Element {
  return (
    <div>
      <h2>Introduction</h2>
      <p>
        This is a demonstration of the AiiDA Dashboard:<br />
        A web-based UI for interfacing with AiiDA, that can also act as an extension for JupyterLab.
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
      <p>
        See the app repository for more details: <a href="https://github.com/chrisjsewell/react-aiida-app">https://github.com/chrisjsewell/react-aiida-app</a>
      </p>
    </div>
  )
}

export function GettingStartedBox(): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <h2>Getting Started</h2>
      <p>
        To use this application, you need to be able to connect to a running AiiDA REST API server.
      </p>
      <p>
        You must have aiida installed with the REST dependencies:
      </p>
      <SyntaxHighlighter language="bash">
        {"$ pip install aiida-core[rest]~=1.6.3"}
      </SyntaxHighlighter>
      <p>
        Then (after setting up a profile) you can start your REST server:
      </p>
      <SyntaxHighlighter language="bash">
        {"$ verdi -p myprofile restapi\n * REST API running on http://127.0.0.1:5000/api/v4"}
      </SyntaxHighlighter>
      <p>
        Take this URL and paste it into the "REST URL" box at the top-right of this page.
        If a connection is available, then you should see the icon turn to:  <MuiIcons.CheckCircle className={classes.InlineIcon} />
      </p>
      <p>
        Now try the tabs on the left of this page!
      </p>
    </div>
  )
}

