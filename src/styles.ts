import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const drawerWidth = 240;

// TODO use a spacer component instead of margins etc

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    inputRestUrlIcon: {
      marginRight: theme.spacing(1)
    },
    inputRestUrl: {
      marginRight: theme.spacing(2),
      minWidth: 200,
    },
    inputRestUrlText: {
      color: "white"
    },
    hide: {
      display: 'none',
    },
    overflowAuto: {
      overflow: 'auto',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    mainGrid: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(10),
      paddingRight: theme.spacing(10)
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    InlineIcon: {
      verticalAlign: 'middle',
      display: 'inline-flex',
    },
    padTop: {
      paddingTop: theme.spacing(2),
    }
  }),
);
