import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import * as MuiIcons from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'

import SyntaxHighlighter from 'react-syntax-highlighter'

import { useStyles } from './styles'

export function PageHome(): JSX.Element {
  const classes = useStyles()
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
      <Grid item xs={12} sm={12} md={12}>
        <Paper variant="outlined" className={classes.paper}>
          <DetailedBox />
        </Paper>
      </Grid>
    </Grid>
  )
}

export function IntroBox(): JSX.Element {
  return (
    <div>
      <h2>Introduction</h2>
      <p>
        This is a demonstration of the AiiDA Dashboard:
        <br />A web-based UI for interfacing with AiiDA, that can also act as an
        extension for JupyterLab.
      </p>
      <p>
        AiiDA Dashboard uses industry leading libraries, to create a beautiful and
        responsive UI:
      </p>
      <ul>
        <li>
          <ExternalLink href="https://reactjs.org/">React</ExternalLink>: A library for
          building user interfaces, maintained by Facebook and with users including
          Whatsapp, Dropbox, Uber and Netflix.
        </li>
        <li>
          <ExternalLink href="https://material-ui.com">Material-UI</ExternalLink>: A
          React component library that implements{' '}
          <ExternalLink href="https://material.io/design">
            Google’s Material Design
          </ExternalLink>{' '}
          guidelines.
        </li>
        <li>
          <ExternalLink href="https://react-query.tanstack.com/">
            react-query
          </ExternalLink>
          : A React component for synchronizing server data (from AiiDA) with the UI.
        </li>
      </ul>
      <p>
        AiiDA Dashboard can be used as a standalone Web UI, or it also provides React
        components and facilitates wrapping into a JupyterLab{' '}
        <ExternalLink href="https://jupyterlab.readthedocs.io/en/stable/extension/virtualdom.html">
          extension widget
        </ExternalLink>
        .
      </p>
      <p>
        Alongside work on an{' '}
        <ExternalLink href="https://github.com/aiidateam/AEP/pull/24">
          Extended REST API
        </ExternalLink>
        , it is hoped that this will offer not just ways to explore your profiles, but
        also to actively interact them: creating/adding to groups, composing/running
        workchains, etc.
      </p>
    </div>
  )
}

function ExternalLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>
): JSX.Element {
  return (
    <a href={props.href} target="_blank" rel="noopener">
      {props.children}
    </a>
  )
}

export function GettingStartedBox(): JSX.Element {
  const classes = useStyles()
  return (
    <div>
      <h2 id="getting-started">Getting Started</h2>
      <p>
        To use this application, you need to be able to connect to a running AiiDA REST
        API server.
      </p>
      <Alert variant="outlined" severity="info">
        If you want to try out this app but don't have your own AiiDA profile, you can
        use this demonstration server:{' '}
        <ExternalLink href="https://15.188.110.176:5000/api/v4">
          https://15.188.110.176:5000/api/v4
        </ExternalLink>
        , although note currently you will first need to open this address in a separate
        tab and accept the security certificate (under Advanced).
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
      <h2>Project Discussion</h2>
      <p>
        Source repository:{' '}
        <ExternalLink href="https://github.com/chrisjsewell/react-aiida-app">
          https://github.com/chrisjsewell/react-aiida-app
        </ExternalLink>
      </p>
      <p>
        This project is a continuation of{' '}
        <ExternalLink href="https://github.com/chrisjsewell/jlab_aiidatree">
          jlab_aiidatree
        </ExternalLink>
        , in which we built a working prototype for a JupyterLab extension to interact
        with AiiDA.
      </p>
      <p>
        During development of <code>jlab_aiidatree</code> it was noted that you can
        embed <a href="https://reactjs.org/">React components</a> inside of JupyterLab
        (see{' '}
        <ExternalLink href="https://jupyterlab.readthedocs.io/en/stable/extension/virtualdom.html">
          JupyterLab/React
        </ExternalLink>
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
      <h3 id="about-react">About React</h3>
      <p>
        React is an industry leading library, for creating beautiful and responsive UIs,
        maintained by Facebook and with users including Whatsapp, Dropbox, Uber and
        Netflix. We also utilise other “best-practice” React components:
      </p>
      <ul>
        <li>
          <a href="https://material-ui.com">Material-UI</a>: A React component library
          that implements Google’s{' '}
          <a href="https://material.io/design">Material Design guidelines</a>
        </li>
        <li>
          <a href="https://react-query.tanstack.com/">react-query</a>: A React component
          for synchronizing server data (from AiiDA) with the UI.
        </li>
      </ul>
      <p>
        React itself is really user-friendly to get started with, even with only a small
        familiarity with HTML and JavaScript, see{' '}
        <a href="https://reactjs.org/tutorial/tutorial.html">
          https://reactjs.org/tutorial/tutorial.html
        </a>
        . Once learned, it is also incredibly intuitive to generate web elements with,
        using the{' '}
        <a href="https://reactjs.org/docs/introducing-jsx.html">
          <code>.jsx</code> file format
        </a>
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
        <b>Update:</b> Materials Cloud is in fact now looking to move to React.
      </p>
      <p>
        Note, initial features of this app are quite similar to{' '}
        <a href="https://www.materialscloud.org/explore/connect">
          https://www.materialscloud.org/explore/connect
        </a>
        : using the AiiDA REST API as a backend for visualising its data. However, this
        is built with <a href="https://angularjs.org/">https://angularjs.org/</a> which,
        although also well used in industry, has two major drawbacks for our use case:
      </p>
      <ol type="1">
        <li>You cannot integrate it with JupyterLab (see benefits above)</li>
        <li>
          It does not have the re-usable component infrastructure of React, which should
          allow us to eventually build an extensible app with “pluggable” extensions.
        </li>
      </ol>
      <h3 id="this-app-vs-aiidalab">This app vs AiiDALab</h3>
      <p>
        <a href="https://www.materialscloud.org/work/aiidalab">AiiDALab</a> uses the
        Jupyter Notebook server to build its frontend, via{' '}
        <a href="https://ipywidgets.readthedocs.io">ipywidgets</a>, which dynamically
        generates the HTML/Javascript from python code cells, and appmode/voila which
        executes the Notebook on page load, then converts the notebook interface to look
        more like a web app (hiding code cells, etc). Note, despite its name, it does
        not use JupyterLab per se.
      </p>
      <p>The benefits of this approach, is that:</p>
      <ol type="1">
        <li>
          You can code everything in Python/Jupyter Notebooks, which is obviously the
          background of many working on AiiDA (being a Python package), albeit that, if
          you want to do anything substantial with these apps you inevitably have to
          learn some HTML/JavaScript.
        </li>
        <li>You can interface directly with the AiiDA Python API</li>
      </ol>
      <p>
        The disadvantage though is that the apps which it creates are substantially
        limited in the user interfaces (UI) and user experience (UX) they can create.
      </p>
      <ol type="1">
        <li>
          On every page load you need to first execute the notebook, then render it,
          meaning loads times are extremely poor by web standards.
        </li>
        <li>
          You are restricted by the semantics/layout of the Notebook, i.e. each app has
          to be a set of separate pages and in each page you have a set of vertically
          sequential cells.
        </li>
        <li>
          You are restricted by the semantics/functionality of ipywidgets, by industry
          standard, a very niche/bespoke tool. In practice, you end up taking a lot of
          time to learn/create a lot of HTML widgets that have little to no practical
          reusability, rather than being able to utilise the massive React ecosystem of
          libraries and components.
        </li>
      </ol>
    </div>
  )
}
