import React from 'react';
import clsx from 'clsx';

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import HomeIcon from '@material-ui/icons/Home'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Omit } from '@material-ui/types';

import { HashRouter as Router, Switch, Route, Link as RouterLink, LinkProps as RouterLinkProps, Redirect } from 'react-router-dom';
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import './App.css';
import logo from './aiida-logo.svg';
import { AiidaSettingsContext, queryClient } from './aiidaClient';
import { RocketIcon } from './icons'
import { PageHome } from './PageHome';
import { PageProcesses } from './PageProcesses';
import { useStyles } from './styles';

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink} >
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}


export function App() {
  const classes = useStyles();
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const urlPattern = new RegExp('^https?:\\/\\/')
  let [baseUrl, setBaseUrl] = React.useState({ value: 'http://0.0.0.0:5000', error: false });
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaseUrl({ value: event.target.value, error: !urlPattern.test(event.target.value) });
  };

  return (
    <Router>

      <div className={classes.root}>

        <AppBar
          position="sticky"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: drawerOpen,
          })}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, {
                [classes.hide]: drawerOpen,
              })}
              color="inherit"
              aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>AiiDA Dashboard</Typography>
            <TextField
              id="rest-url"
              className={classes.inputRestUrl}
              label="REST URL"
              value={baseUrl.value}
              error={baseUrl.error}
              onChange={handleUrlChange}
              autoComplete="http://0.0.0.0:5000"
              InputProps={{
                className: classes.inputRestUrlText
              }}
            />
            <img src={logo} alt="AiiDA" className={classes.toolbarLogo} />
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: drawerOpen,
              [classes.drawerClose]: !drawerOpen,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />

          {/* TODO signify which page is selected */}
          <List>
            <ListItemLink to="/" primary="Home" icon={<HomeIcon />} />
            <ListItemLink to="/process" primary="Processes" icon={<RocketIcon />} />
          </List>

        </Drawer>

        <QueryClientProvider client={queryClient}>

          <AiidaSettingsContext.Provider value={{ baseUrl: baseUrl.value, enabled: !baseUrl.error }}>
            <Switch>
              <Route exact path="/" component={PageHome} />
              <Route path="/process" component={() => PageProcesses(baseUrl)} />
              <Route path="/404" component={NotFound} />
              <Redirect to="/404" />
            </Switch>
          </AiidaSettingsContext.Provider>

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>

      </div>

    </Router>
  );
}

function NotFound(): JSX.Element {
  // TODO Offset
  return (
    <div>
      <h1>404 - Not Found!</h1>
      <RouterLink to="/">
        Go Home
      </RouterLink>
    </div>
  )
}
