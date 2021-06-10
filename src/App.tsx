import React, { useState } from 'react'
import clsx from 'clsx'

import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/core/styles'
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery
} from '@material-ui/core'
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
import { PageKeys, LocalStorageKeys } from './constants'
import { PageHome } from './PageHome'
import { NotFoundPage } from './PageNotFound'
import { PageNodeExplorer } from './PageNodeExplorer'
import { PageProvenanceGraph } from './PageProvenanceGraph'
import { PageStructures } from './PageStructures'
import { PageGroups } from './PageGroups'
import { SnackbarProvider, useLocalStorage } from './hooks'

interface ListItemLinkProps {
  icon?: React.ReactElement
  primary: string
  to: string
  onClick: React.MouseEventHandler<HTMLAnchorElement>
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to, onClick } = props
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
      <ListItem
        button
        component={renderLink}
        selected={to === location.pathname}
        onClick={onClick}
      >
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}

export function App({ showDevTools = true }: { showDevTools?: boolean }): JSX.Element {
  // style hooks
  const classes = useStyles()

  const [darkMode, setDarkMode] = useLocalStorage(LocalStorageKeys.darkMode, false)
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light'
        }
      }),
    [darkMode]
  )
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // component state for the left menu
  const [drawerOpen, setDrawerOpen] = useState(false)
  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  // component state for the AiiDA REST URL
  // the URL is is stored, so that it persists between sessions and page refreshes
  // we also validate to only allow http/https schema, and no ? which start the query string
  // TODO better URL validation (to guard against attacks)
  const [restUrlBase, setRestUrlBase] = useLocalStorage(
    LocalStorageKeys.restUrlBase,
    defaultRestUrl
  )

  const tabs = (
    <List>
      <ListItemLink
        to={PageKeys.home}
        primary="Home"
        icon={<MuiIcons.Home />}
        onClick={handleDrawerClose}
      />
      <ListItemLink
        to={PageKeys.nodeExplorer}
        primary="Node Explorer"
        icon={<MuiIcons.Explore />}
        onClick={handleDrawerClose}
      />
      <ListItemLink
        to={PageKeys.provenanceGraph}
        primary="Provenance Graph"
        icon={<GitBranchIcon />}
        onClick={handleDrawerClose}
      />
      <ListItemLink
        to={PageKeys.groups}
        primary="Node Groups"
        icon={<MuiIcons.Bookmarks />}
        onClick={handleDrawerClose}
      />
      <ListItemLink
        to={PageKeys.structures}
        primary="Structure Explorer"
        icon={<OptimadeIcon />}
        onClick={handleDrawerClose}
      />
    </List>
  )

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: '100vh', overflow: 'auto' }}>
        <QueryClientProvider client={queryAiidaClient}>
          <SnackbarProvider
            SnackbarProps={{
              autoHideDuration: 4000,
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
            }}
          >
            <TopBar
              restUrlBase={restUrlBase}
              setRestUrlBase={setRestUrlBase}
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
            />
            {/* TODO use the temporary drawer on mobile */}
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
                <Tooltip title="Toggle light/dark theme">
                  <IconButton onClick={toggleDarkMode}>
                    {darkMode ? <MuiIcons.Brightness4 /> : <MuiIcons.BrightnessHigh />}
                  </IconButton>
                </Tooltip>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'rtl' ? (
                    <MuiIcons.ChevronRight />
                  ) : (
                    <MuiIcons.ChevronLeft />
                  )}
                </IconButton>
              </div>
              <Divider />
              {tabs}
            </Drawer>

            <AiidaSettingsContext.Provider
              value={{ baseUrl: urlPattern.test(restUrlBase) ? restUrlBase : null }}
            >
              <Switch>
                <Route exact path={PageKeys.home} component={PageHome} />
                <Route path={PageKeys.nodeExplorer} component={PageNodeExplorer} />
                <Route
                  path={PageKeys.provenanceGraph}
                  component={PageProvenanceGraph}
                />
                <Route path={PageKeys.structures} component={PageStructures} />
                <Route path={PageKeys.groups} component={PageGroups} />

                <Route path={PageKeys.unknown} component={NotFoundPage} />
                <Redirect to={PageKeys.unknown} />
              </Switch>
            </AiidaSettingsContext.Provider>

            {showDevTools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
          </SnackbarProvider>
        </QueryClientProvider>
      </Paper>
    </ThemeProvider>
  )
}

function TopBar({
  restUrlBase,
  setRestUrlBase,
  drawerOpen,
  setDrawerOpen
}: {
  restUrlBase: string
  setRestUrlBase: React.Dispatch<React.SetStateAction<string>>
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

  const handleDrawerOpen = () => {
    setDrawerOpen(true)
  }
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRestUrlBase(event.target.value)
  }

  const title = isDesktop ? (
    <Typography id="app-header" variant="h6" noWrap>
      AiiDA Dashboard
    </Typography>
  ) : null

  return (
    <AppBar
      position="sticky"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: drawerOpen
      })}
      style={{ opacity: 0.9 }}
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
        <div className={classes.aiidaIcon}>
          <AiiDAIcon200 width={40} height={40} arcColor={theme.palette.text.primary} />
        </div>
        {title}
        <div className={classes.flexGrow} />
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
            className: classes.inputRestUrlText,
            endAdornment: (
              <InputAdornment position="end">
                <RestUrlConnection
                  url={urlPattern.test(restUrlBase) ? restUrlBase : null}
                />
              </InputAdornment>
            )
          }}
        />
      </Toolbar>
    </AppBar>
  )
}

// TODO periodically update connection status
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
