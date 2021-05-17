import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import './App.css';
import logo from './aiida-logo.svg';
import { queryClient, AiidaSettingsContext } from './aiidaClient';
import { AiidaXTree } from './tree';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
    input: {
      marginRight: theme.spacing(2)
    },
    logo: {
      maxHeight: 40
    },
    mainGrid: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10)
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    }
  }),
);


export function App() {
  const classes = useStyles();

  const urlPattern = new RegExp('^https?:\\/\\/')
  let [baseUrl, setBaseUrl] = React.useState({ value: 'http://0.0.0.0:5000', error: false });
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaseUrl({ value: event.target.value, error: !urlPattern.test(event.target.value) });
  };

  return (
    <div className={classes.root}>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>AiiDA Dashboard</Typography>
          <TextField
            id="rest-url"
            className={classes.input}
            label="REST URL"
            value={baseUrl.value}
            error={baseUrl.error}
            onChange={handleUrlChange}
          />
          <img src={logo} alt="aiida-logo" className={classes.logo} />
        </Toolbar>
      </AppBar>

      <QueryClientProvider client={queryClient}>

        <Grid container spacing={2} className={classes.mainGrid}>

          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" className={classes.paper}>
              <InfoBox />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" className={classes.paper}>
              <h2>AiiDA Processes</h2>
              <AiidaSettingsContext.Provider value={{ baseUrl: baseUrl.value, enabled: !baseUrl.error }}>
                <AiidaXTree />
              </AiidaSettingsContext.Provider>
            </Paper>
          </Grid>

        </Grid>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>

    </div>
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
