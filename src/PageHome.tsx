import React from 'react'

import {
  Avatar,
  Box,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  useMediaQuery
} from '@material-ui/core'
// import { blue } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/core/styles'
import * as MuiIcons from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'

import SyntaxHighlighter from 'react-syntax-highlighter'

import { useStyles } from './styles'
import { LinkExternal } from './hooks'
import {
  AiiDAIcon200,
  aiidaBlue,
  aiidaGreen,
  aiidaOrange,
  OptimadeIcon
  // ReactIcon
} from './icons'

export function PageHome(): JSX.Element {
  const classes = useStyles()
  return (
    <Grid container spacing={2} className={classes.mainGrid}>
      <Grid item xs={12} alignItems="center">
        <Header />
      </Grid>
      <Grid item xs={12}>
        <Features />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Paper variant="outlined" className={classes.paper}>
          <GettingStartedBox />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Paper variant="outlined" className={classes.paper}>
          <DetailedBox />
        </Paper>
      </Grid>
    </Grid>
  )
}

function Header(): JSX.Element {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('xs'))
  return (
    <>
      <Grid container alignItems="center" spacing={matches ? 1 : 2}>
        <Grid item xs={12} sm={4}>
          <Box className={classes.landingIcon}>
            <AiiDAIcon200 arcColor={theme.palette.text.primary} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography
            variant={matches ? 'h6' : 'h4'}
            align={matches ? 'center' : 'left'}
          >
            A web-based UI for interfacing with AiiDA.
          </Typography>
        </Grid>
      </Grid>
    </>
  )
}

const featuresList = [
  {
    name: 'Quick Setup',
    description: 'Start AiiDA REST, connect and go',
    icon: <MuiIcons.FlashOn />,
    color: aiidaOrange
  },
  {
    name: 'Access anywhere',
    description: 'Access AiiDA from any cloud/HPC service',
    icon: <MuiIcons.CloudOutlined />,
    color: aiidaGreen
  },
  {
    name: 'Cached queries',
    description: 'Fast access to data as you work',
    icon: <MuiIcons.Cached />,
    color: aiidaBlue
  },
  {
    name: 'Persisted inputs',
    description: 'Key fields saved over page changes and multiple sessions',
    icon: <MuiIcons.Bookmarks />,
    color: aiidaOrange
  },
  {
    name: 'Optimade Integration',
    description: 'For structure searching and visualisation',
    icon: <OptimadeIcon width={200} height={200} singleColor="black" />,
    color: aiidaGreen
  },
  {
    name: 'Mobile Friendly',
    description: 'Responsive layout that adapts to any window size',
    icon: <MuiIcons.MobileFriendly />,
    color: aiidaBlue
  },
  {
    name: 'Dark Mode',
    description: 'Accessed in the menu bar.',
    icon: <MuiIcons.Brightness4 />,
    color: aiidaOrange
  }
  // {
  //   name: 'Server-less App',
  //   description: 'Means quick and inexpensive deployment',
  //   icon: <ReactIcon />,
  //   color: aiidaGreen
  // }
]

function Features(): JSX.Element {
  return (
    <Grid container spacing={1} justify="center">
      {featuresList.map(value => (
        <FeatureCard {...value} />
      ))}
    </Grid>
  )
}

function FeatureCard({
  icon,
  name,
  description,
  color
}: {
  icon: JSX.Element
  name: string
  description: string
  color: string
}): JSX.Element {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('xs'))
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Paper variant="outlined" className={classes.featureCard}>
        <ListItem>
          <ListItemAvatar>
            <Avatar
              alt={name}
              style={{
                color: theme.palette.getContrastText(color),
                backgroundColor: color,
                width: theme.spacing(matches ? 5 : 7),
                height: theme.spacing(matches ? 5 : 7),
                marginRight: theme.spacing(2)
              }}
            >
              {icon}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={name} secondary={matches ? undefined : description} />
        </ListItem>
      </Paper>
    </Grid>
  )
}

export function GettingStartedBox(): JSX.Element {
  const classes = useStyles()
  return (
    <div>
      <h2 id="getting-started">Getting Started</h2>
      <p>
        To use this application, you simply need to be able to connect to a running
        AiiDA REST API server.
      </p>
      <Alert variant="outlined" severity="info">
        <p>
          If you want to try out this app but don't have your own AiiDA profile, you can
          use this demonstration server:{' '}
          <LinkExternal href="https://15.188.110.176:5000/api/v4">
            https://15.188.110.176:5000/api/v4
          </LinkExternal>
        </p>
        <p>
          Although note currently you will first need to open this address in a separate
          tab and accept the security certificate (under Advanced).
        </p>
      </Alert>
      <p>
        To start a server for your own profile, you must have aiida-core installed with
        the REST dependencies:
      </p>
      <SyntaxHighlighter language="bash">
        {'$ pip install aiida-core[rest]~=1.6.3'}
      </SyntaxHighlighter>
      <p>Then you can start your REST server:</p>
      <SyntaxHighlighter language="bash">
        {
          '$ verdi -p myprofile restapi\n * REST API running on http://127.0.0.1:5000/api/v4'
        }
      </SyntaxHighlighter>
      <p>
        Take this URL and paste it into the "REST URL" box at the top-right of this
        page. If a connection is available, then you should see the icon turn to:{' '}
        <MuiIcons.CheckCircle className={classes.InlineIcon} />
      </p>
      <p>Now try the tabs on the left of this page!</p>
    </div>
  )
}

export function DetailedBox(): JSX.Element {
  return (
    <div>
      <h2>Project Details</h2>
      <p>
        <b>Source repository:</b>{' '}
        <LinkExternal href="https://github.com/chrisjsewell/react-aiida-app">
          https://github.com/chrisjsewell/react-aiida-app
        </LinkExternal>
      </p>
      <h3>Project History</h3>
      <p>
        This project is a continuation of{' '}
        <LinkExternal href="https://github.com/chrisjsewell/jlab_aiidatree">
          jlab_aiidatree
        </LinkExternal>
        , in which we built a working prototype for a JupyterLab extension to interact
        with AiiDA.
      </p>
      <p>
        During development of <code>jlab_aiidatree</code> it was noted that you can
        embed <a href="https://reactjs.org/">React components</a> inside of JupyterLab
        (see{' '}
        <LinkExternal href="https://jupyterlab.readthedocs.io/en/stable/extension/virtualdom.html">
          JupyterLab/React
        </LinkExternal>
        ).
      </p>
      <p>
        The goal, therefore, is that we can develop this package as a standalone app
        (which could also be utilised directly via a web server), but also use it as a
        dependency to generate most of the JupyterLab extension, via React components.
      </p>
      <p>The benefit of also using th app within JupyterLab, is:</p>
      <ol type="1">
        <li>
          It provides a platform within which to run the app locally, without having to
          host it directly
        </li>
        <li>
          It allows us an alternate route to interface with AiiDA: via the “private”
          REST API interface between the JupyterLab backend and frontend. Using this
          REST API, will allow us easy access to parts of the AiiDA API that are yet to
          be exposed in REST, whilst maintaining that formal protocol (enforcing
          separation of concerns). We can then use this to essentially prototype
          additions to the AiiDA REST API.
        </li>
        <li>
          It provides the possible to integrate with other aspects of the Jupyter
          framework (e.g. Notebooks)
        </li>
      </ol>
      <p>
        Alongside work on an{' '}
        <LinkExternal href="https://github.com/aiidateam/AEP/pull/24">
          Extended REST API
        </LinkExternal>
        , it is hoped that this will offer not just ways to explore your profiles, but
        also to actively interact them: creating/adding to groups, composing/running
        workchains, etc.
      </p>
      <h3 id="about-react">App Technologies</h3>
      <p>
        AiiDA Dashboard uses React, an industry leading library, for creating beautiful
        and responsive UIs, maintained by Facebook and with users including Whatsapp,
        Dropbox, Uber and Netflix. We also utilise other “best-practice” React
        components:
      </p>
      <ul>
        <li>
          <LinkExternal href="https://material-ui.com">Material-UI</LinkExternal>: A
          React component library that implements Google’s{' '}
          <LinkExternal href="https://material.io/design">
            Material Design guidelines
          </LinkExternal>
        </li>
        <li>
          <LinkExternal href="https://react-query.tanstack.com/">
            react-query
          </LinkExternal>
          : A React component for synchronizing server data (from AiiDA) with the UI.
        </li>
      </ul>
      <p>
        React itself is really user-friendly to get started with, even with only a small
        familiarity with HTML and JavaScript, see{' '}
        <LinkExternal href="https://reactjs.org/tutorial/tutorial.html">
          https://reactjs.org/tutorial/tutorial.html
        </LinkExternal>
        . Once learned, it is also incredibly intuitive to generate web elements with,
        using the{' '}
        <LinkExternal href="https://reactjs.org/docs/introducing-jsx.html">
          <code>.jsx</code> file format
        </LinkExternal>
        . For example a simple React component would look like:
      </p>
      <SyntaxHighlighter language="jsx">
        {`function MyComponent(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <p>Here is a dynamic value: {props.value}</p>
    </div>
  )
}`}
      </SyntaxHighlighter>
      <h3 id="this-app-vs-materials-cloud-explore">
        This app vs Materials Cloud Explore
      </h3>
      <p>
        <b>Update:</b> Materials Cloud is in fact now also looking to move to React.
      </p>
      <p>
        Note, initial features of this app are quite similar to{' '}
        <LinkExternal href="https://www.materialscloud.org/explore/connect">
          https://www.materialscloud.org/explore/connect
        </LinkExternal>
        : using the AiiDA REST API as a backend for visualising its data. However, this
        is built with{' '}
        <LinkExternal href="https://angularjs.org/">
          https://angularjs.org/
        </LinkExternal>{' '}
        which, although also well used in industry, has two major drawbacks for our use
        case:
      </p>
      <ol type="1">
        <li>You cannot integrate it with JupyterLab (see benefits above)</li>
        <li>
          It does not have the re-usable component infrastructure of React, which should
          allow us to eventually build an extensible app with “pluggable” extensions.
        </li>
      </ol>
      <p>
        Materials Cloud is also more focussed on access to pre-existing data (stored in
        their archive), whereas this application is focussed on interaction with
        "in-use" databases.
      </p>
      <h3 id="this-app-vs-aiidalab">This app vs AiiDALab</h3>
      <p>
        <LinkExternal href="https://www.materialscloud.org/work/aiidalab">
          AiiDALab
        </LinkExternal>{' '}
        uses the Jupyter Notebook server to build its frontend, via{' '}
        <LinkExternal href="https://ipywidgets.readthedocs.io">ipywidgets</LinkExternal>
        , which dynamically generates the HTML/Javascript from python code cells, and
        appmode/voila which executes the Notebook on page load, then converts the
        notebook interface to look more like a web app (hiding code cells, etc). Note,
        despite its name, it does not use JupyterLab per se.
      </p>
      <p>The benefits of this approach, is that:</p>
      <ol type="1">
        <li>
          You can, in theory, code everything in Python/Jupyter Notebooks, the same
          language which aiida itself is written in (in practice some HTML/JavaScript is
          required).
        </li>
        <li>You can interface directly with the AiiDA Python API</li>
      </ol>
      <p>The disadvantage though are:</p>
      <ol type="1">
        <li>
          AiiDALab is strongly coupled to an aiida python environment, making
          deployments more complex and costly, compared to the free and unlimited
          scaling of this apps deployment on Github Pages.
        </li>
        <li>
          Because the notebooks must first be executed, then rendered, on every page
          load, page load times are very poor, negatively impacting the user experience.
        </li>
        <li>
          The user interface is restricted by the semantics/layout of the Notebook,
          i.e. each app has to be a set of separate pages and in each page you have a
          set of vertically sequential cells.
        </li>
        <li>
          ipywidgets is a relatively niche/bespoke tool (by industry standard), meaning
          limited user/developer support and existing packages, in comparison to the
          massive React ecosystem of libraries and components.
        </li>
      </ol>
    </div>
  )
}
