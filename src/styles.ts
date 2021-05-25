import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const drawerWidth = 240

// TODO use a spacer component instead of margins etc

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flexGrow: {
      flexGrow: 1
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginRight: theme.spacing(0),
      [theme.breakpoints.up('sm')]: {
        marginRight: theme.spacing(2)
      }
    },
    aiidaIcon: {
      marginRight: theme.spacing(1)
    },
    inputRestUrl: {
      position: 'relative',
      marginRight: theme.spacing(1),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
        minWidth: 250
      },
      [theme.breakpoints.up('md')]: {
        minWidth: 300
      }
    },
    inputRestUrlText: {
      color: theme.palette.primary.contrastText
    },
    hide: {
      display: 'none'
    },
    overflowAuto: {
      overflow: 'auto'
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap'
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      overflowX: 'hidden',
      width: theme.spacing(9) + 1,
      [theme.breakpoints.down('sm')]: {
        width: theme.spacing(7) + 1
      },
      [theme.breakpoints.down('xs')]: {
        width: 0
      }
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar
    },
    mainGrid: {
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(10),
      [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(8)
      },
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(1)
      },
      paddingRight: theme.spacing(1)
    },
    paper: {
      padding: theme.spacing(2)
      // color: theme.palette.text.secondary
    },
    accordSumContent: {
      margin: '0 12px!important'
    },
    InlineIcon: {
      verticalAlign: 'middle',
      display: 'inline-flex'
    },
    padTop: {
      paddingTop: theme.spacing(2)
    },
    pagination: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1)
    },
    nodeTree: {
      width: '100%',
      backgroundColor: theme.palette.background.paper
    },
    nodeItemChip: {
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(1),
      float: 'right'
    },
    nodeListItem: {
      // maxWidth: 480,
      overflow: 'hidden'
    }
  })
)
