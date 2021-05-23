import React from 'react'
import clsx from 'clsx'

import { useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import * as MuiIcons from '@material-ui/icons'
import { Omit } from '@material-ui/types'

import {
  Switch,
  Route,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  Redirect,
  useLocation
} from 'react-router-dom'
import { QueryClientProvider, useQuery } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import {
  AiidaSettingsContext,
  defaultRestUrl,
  isConnected,
  queryAiidaClient,
  urlPattern
} from './clients/aiidaClient'
import { useStyles } from './styles'
import { AiiDAIcon200, GitBranchIcon, OptimadeIcon } from './icons'
import PageKeys from './pages'
import { PageHome } from './PageHome'
import { PageNodeExplorer } from './PageNodeExplorer'
import { PageProvenanceGraph } from './PageProvenanceGraph'
import { PageStructures } from './PageStructures'
import { useLocalStorage } from './hooks'

interface ListItemLinkProps {
  icon?: React.ReactElement
  primary: string
  to: string
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props
  const location = useLocation()

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  )

  return (
    <li>
      <ListItem button component={renderLink} selected={to === location.pathname}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}

export function App({ showDevTools = true }: { showDevTools?: boolean }): JSX.Element {
  // style hooks
  const classes = useStyles()
  const theme = useTheme()

  // component state for the left menu
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const handleDrawerOpen = () => {
    setDrawerOpen(true)
  }
  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  // component state for the AiiDA REST URL
  // the URL is is stored, so that it persists between sessions and page refreshes
  // we also validate to only allow http/https schema, and no ? which start the query string
  // TODO better URL validation (to guard against attacks)
  const [restUrlBase, setRestUrlBase] = useLocalStorage(
    'react-aiida-rest-url',
    defaultRestUrl
  )
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRestUrlBase(event.target.value)
  }

  return (
    <div className={classes.root}>
      <QueryClientProvider client={queryAiidaClient}>
        <AppBar
          position="sticky"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: drawerOpen
          })}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, {
                [classes.hide]: drawerOpen
              })}
              color="inherit"
              aria-label="open drawer"
            >
              <MuiIcons.Menu />
            </IconButton>
            <Typography variant="h6" className={classes.title} id="app-header">
              AiiDA Dashboard
            </Typography>
            {/* TODO periodically update connection status */}
            <RestUrlConnection
              url={urlPattern.test(restUrlBase) ? restUrlBase : null}
              className={classes.inputRestUrlIcon}
            />
            <TextField
              id="rest-url"
              className={classes.inputRestUrl}
              label="REST URL"
              value={restUrlBase}
              error={!urlPattern.test(restUrlBase)}
              helperText={urlPattern.test(restUrlBase) ? undefined : 'Invalid URL'}
              onChange={handleUrlChange}
              autoComplete={defaultRestUrl}
              InputProps={{
                className: classes.inputRestUrlText
              }}
            />
            <AiiDAIcon200 width={40} height={40} />
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: drawerOpen,
              [classes.drawerClose]: !drawerOpen
            })
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? (
                <MuiIcons.ChevronRight />
              ) : (
                <MuiIcons.ChevronLeft />
              )}
            </IconButton>
          </div>
          <Divider />

          <List>
            <ListItemLink to={PageKeys.home} primary="Home" icon={<MuiIcons.Home />} />
            <ListItemLink
              to={PageKeys.nodeExplorer}
              primary="Node Explorer"
              icon={<MuiIcons.Explore />}
            />
            <ListItemLink
              to={PageKeys.provenanceGraph}
              primary="Provenance Graph"
              icon={<GitBranchIcon />}
            />
            <ListItemLink
              to={PageKeys.structures}
              primary="Structure Explorer"
              icon={<OptimadeIcon />}
            />
          </List>
        </Drawer>

        <AiidaSettingsContext.Provider
          value={{ baseUrl: urlPattern.test(restUrlBase) ? restUrlBase : null }}
        >
          <Switch>
            <Route exact path={PageKeys.home} component={PageHome} />
            <Route path={PageKeys.nodeExplorer} component={PageNodeExplorer} />
            <Route path={PageKeys.provenanceGraph} component={PageProvenanceGraph} />
            <Route path={PageKeys.structures} component={PageStructures} />
            <Route path={PageKeys.unknown} component={NotFound} />
            <Redirect to={PageKeys.unknown} />
          </Switch>
        </AiidaSettingsContext.Provider>

        {showDevTools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </div>
  )
}

function NotFound(): JSX.Element {
  // TODO Offset
  return (
    <div>
      <h1>404 - Not Found!</h1>
      <RouterLink to="/">Go Home</RouterLink>
    </div>
  )
}

function RestUrlConnection({
  url,
  className = undefined
}: {
  url: string | null
  className?: string
}): JSX.Element {
  const result = useQuery([url, 'connected'], () => isConnected(url))
  // TODO hover over info/error?
  if (result.data) {
    return <MuiIcons.CheckCircle className={className} />
  }
  return <MuiIcons.Cancel color="error" className={className} />
}

export default App
