import React, { useContext, useState } from 'react'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import * as MuiIcons from '@material-ui/icons'
import { Alert } from '@material-ui/lab'

import { useQuery } from 'react-query'

import { LocalStorageKeys } from './constants'
import { useStyles } from './styles'
import { AiidaSettingsContext, getGroups, getNode } from './clients/aiidaClient'
import { AiidaNodeListItem } from './components/aiidaListItems'

export function PageGroups(): JSX.Element {
  const classes = useStyles()
  return (
    <Grid container spacing={2} className={classes.mainGrid} direction="row-reverse">
      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<MuiIcons.ExpandMore />}>
              <h3>Node Bookmarks</h3>
            </AccordionSummary>
            <AccordionDetails>
              <Bookmarks />
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <Paper variant="outlined" className={classes.paper}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<MuiIcons.ExpandMore />}>
              <h3>Node Groups</h3>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <p>
                  Here you can view the <code>Groups</code> in your database.
                </p>
                <p>
                  the REST API does not yet support retrieving the nodes in a{' '}
                  <code>Group</code>. It is envisaged this will be implemented soon,
                  alongside <code>Group</code> creation/deletion and adding nodes to
                  groups.
                </p>
              </div>
            </AccordionDetails>
            <GroupTree />
          </Accordion>
        </Paper>
      </Grid>
    </Grid>
  )
}

function Bookmarks(): JSX.Element {
  const [openWipeDialog, setOpenWipeDialog] = useState(false)
  const result = useQuery(
    ['bookmarks'],
    () =>
      JSON.parse(
        window.localStorage.getItem(LocalStorageKeys.aiidaUUIDbookmarks) || '[]'
      ) as string[]
  )
  let bookmarkTable = (
    <List>
      <Divider />
    </List>
  )
  if (result.data) {
    bookmarkTable = (
      <List>
        <Divider />
        {result.data.map(val => (
          <BookmarkItem uuid={val} />
        ))}
      </List>
    )
  } else if (result.isFetching) {
    bookmarkTable = <CircularProgress />
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <p>This is a list of nodes that you have previously bookmarked.</p>
        <p>
          Currently these are held in your local browser storage, but eventually they
          will be directly created as a <code>Group</code> on your database.
        </p>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenWipeDialog(true)
          }}
        >
          Wipe Bookmarks
        </Button>
        <Dialog
          open={openWipeDialog}
          onClose={() => {
            setOpenWipeDialog(false)
          }}
        >
          <DialogTitle>Wipe Bookmarks</DialogTitle>
          <DialogContent>Are you sure?</DialogContent>
          <DialogActions>
            {' '}
            <Button
              onClick={() => {
                window.localStorage.removeItem(LocalStorageKeys.aiidaUUIDbookmarks)
                result.refetch()
                setOpenWipeDialog(false)
              }}
              color="primary"
            >
              YES
            </Button>
            <Button
              onClick={() => {
                setOpenWipeDialog(false)
              }}
              color="primary"
              autoFocus
            >
              NO
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Grid item xs={12}>
        {bookmarkTable}
      </Grid>
    </Grid>
  )
}

function BookmarkItem({ uuid }: { uuid: string }): JSX.Element {
  const theme = useTheme()
  const classes = useStyles()
  const [childOpen, setchildOpen] = useState(false)
  const handleChildrenOpen = () => {
    setchildOpen(!childOpen)
  }
  return (
    <>
      <ListItem button onClick={handleChildrenOpen}>
        <ListItemText className={classes.nodeListItem} primary={uuid} />
        {childOpen ? (
          <MuiIcons.ExpandMore style={{ marginLeft: theme.spacing(1) }} />
        ) : (
          <MuiIcons.ExpandLess style={{ marginLeft: theme.spacing(1) }} />
        )}
      </ListItem>
      <Collapse in={childOpen} timeout="auto" mountOnEnter>
        <BookmarkNodeItem uuid={uuid} />
      </Collapse>
      <Divider />
    </>
  )
}

function BookmarkNodeItem({ uuid }: { uuid: string }): JSX.Element {
  const aiidaSettings = useContext(AiidaSettingsContext)
  const result = useQuery(
    [aiidaSettings.baseUrl, 'node', uuid],
    () => getNode(aiidaSettings.baseUrl, uuid),
    { enabled: aiidaSettings.baseUrl !== null }
  )
  if (result.data) {
    return (
      <AiidaNodeListItem
        key={`aiida-tree-el-${result.data.uuid}`}
        pk={result.data.id}
        uuid={result.data.uuid}
        mtime={result.data.mtime}
        node_type={result.data.node_type}
        process_type={result.data.process_type}
        label={result.data.label}
        indent={2}
      />
    )
  } else if (result.isFetching) {
    return <CircularProgress />
  } else if (result.isError) {
    return <Alert severity="error">{`${result.error ? result.error : ''}`}</Alert>
  }
  return <Alert severity="info">Disabled</Alert>
}

function GroupTree(): JSX.Element {
  const theme = useTheme()
  const classes = useStyles()

  const aiidaSettings = useContext(AiidaSettingsContext)
  const result = useQuery(
    [aiidaSettings.baseUrl, 'groups'],
    () => getGroups(aiidaSettings.baseUrl),
    { enabled: aiidaSettings.baseUrl !== null }
  )
  let updateInfo = null
  if (!!result.dataUpdatedAt) {
    const date = new Date(result.dataUpdatedAt)
    updateInfo = (
      <Typography display="inline" noWrap>
        Updated: {date.toLocaleString()}
      </Typography>
    )
  }
  let groupTable = (
    <List>
      <Divider />
    </List>
  )
  if (result.data) {
    groupTable = (
      <List>
        <Divider />
        {result.data.map(val => {
          const icon = <MuiIcons.Group />
          const title = `${val.id} ${val.label}`
          let info = `${val.time}, ${val.type_string}`
          if (val.description) {
            info = info + `, ${val.description}`
          }
          return (
            <>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{icon}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  className={classes.nodeListItem}
                  primary={title}
                  secondary={info}
                />
              </ListItem>
              <Divider />
            </>
          )
        })}
      </List>
    )
  } else if (result.isFetching) {
    groupTable = <CircularProgress />
  } else if (result.isError) {
    groupTable = <Alert severity="error">{`${result.error ? result.error : ''}`}</Alert>
  }
  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        style={{ marginRight: theme.spacing(1) }}
        startIcon={<MuiIcons.Refresh />}
        onClick={() => {
          result.refetch()
        }}
      >
        Refresh
      </Button>
      {updateInfo}
      {groupTable}
    </div>
  )
}
