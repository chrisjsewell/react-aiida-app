import React, { useContext, useState } from 'react'

import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  List,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip
} from '@material-ui/core'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import * as MuiIcons from '@material-ui/icons'

import { Alert, Pagination } from '@material-ui/lab'

import { useQuery } from 'react-query'
import copy from 'copy-to-clipboard'

import {
  AiidaSettingsContext,
  getNodes,
  getNodeIncoming,
  getNodeOutgoing,
  getNodeRepoList
} from '../clients/aiidaClient'
import { GitBranchIcon, RocketIcon } from '../icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tree: {
      width: '100%',
      maxWidth: 520,
      backgroundColor: theme.palette.background.paper
    },
    refresh: {
      marginRight: theme.spacing(1)
    },
    pagination: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1)
    },
    listChip: {
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(1),
      float: 'right'
    },
    item: {
      maxWidth: 480,
      overflow: 'hidden'
    },
    nested1: {
      paddingLeft: theme.spacing(4)
    },
    nested2: {
      paddingLeft: theme.spacing(8)
    }
  })
)

const initialMouseState = {
  mouseX: null,
  mouseY: null
} as { mouseX: null | number; mouseY: null | number }

interface IAiidaTreeElementProps {
  pk: number
  uuid: string
  elementName?: string
  header: string
  info?: string
  tooltip?: string
  procLabel?: string
  procState?: 'created' | 'running' | 'waiting' | 'finished' | 'excepted' | 'killed'
  procExit?: number
  nested?: boolean
}

export function AiidaNodeTree({ nodePrefix }: { nodePrefix: string }): JSX.Element {
  /**
   * a React component housing a list of AiiDA elements
   */

  const classes = useStyles()
  const [page, setPage] = useState(1)
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }
  const aiidaSettings = useContext(AiidaSettingsContext)
  // TODO usePaginationQuery
  const result = useQuery(
    [aiidaSettings.baseUrl, 'nodes', nodePrefix, page],
    () => getNodes(aiidaSettings.baseUrl, nodePrefix, page),
    { enabled: aiidaSettings.baseUrl !== null, keepPreviousData: true }
  )

  let element = <CircularProgress />
  let pages = 1
  if (result.isIdle || result.data === null) {
    element = (
      <Alert severity="info" icon={<MuiIcons.SyncDisabled />}>
        Disabled
      </Alert>
    )
  } else if (result.data !== undefined) {
    pages = Math.ceil(result.data.totalCount / result.data.perPage)
    if (!result.isPreviousData) {
      element = (
        <List component="nav" aria-label="main aiida tree">
          {result.data.nodes.map(value => {
            return (
              <AiidaTreeElement
                key={`aiida-tree-el-${value.uuid}`}
                pk={value.id}
                uuid={value.uuid}
                header={`${value.id} ${
                  value.attributes?.process_label || value.label || ''
                }`}
                elementName={value.node_type.split('.').slice(0, 2).join('.')}
                info={`${value.mtime}, ${value.node_type}, ${value.process_type || ''}`}
                tooltip={`UUID: ${value.uuid}`}
                procLabel={value.attributes?.process_label}
                procState={value.attributes?.process_state}
                procExit={value.attributes?.exit_status}
              />
            )
          })}
        </List>
      )
    }
  } else if (result.isError) {
    const error = result.error as { message: string }
    element = <Alert severity="error">{error.message}</Alert>
  }
  let updateInfo = <span></span>
  if (!!result.dataUpdatedAt) {
    const date = new Date(result.dataUpdatedAt)
    updateInfo = <span>Updated: {date.toLocaleString()}</span>
  }

  return (
    <div className={classes.tree}>
      <Button
        variant="outlined"
        color="primary"
        className={classes.refresh}
        startIcon={<MuiIcons.Refresh />}
        onClick={() => {
          result.refetch()
        }}
      >
        Refresh
      </Button>
      {updateInfo}
      <Pagination
        disabled={result.isPreviousData}
        className={classes.pagination}
        color="primary"
        count={pages}
        page={page}
        onChange={handlePageChange}
      />
      {element}
    </div>
  )
}

// TODO better value type, custom icons (https://primer.style/octicons/packages/react)
const ElementIconMap: { [key: string]: JSX.Element } = {
  default: <MuiIcons.DeviceUnknown />,
  folder: <MuiIcons.Inbox />,
  'data.array': <MuiIcons.GridOn />,
  'data.bool': <MuiIcons.CheckCircle />,
  'data.cif': <MuiIcons.ScatterPlot />,
  'data.code': <MuiIcons.Code />,
  'data.dict': <MuiIcons.ViewList />,
  'data.float': <MuiIcons.AllInclusive />,
  'data.folder': <MuiIcons.Inbox />,
  'data.int': <MuiIcons.LooksOne />,
  'data.list': <MuiIcons.List />,
  'data.numeric': <MuiIcons.PlusOne />,
  'data.orbital': <MuiIcons.BlurOn />,
  'data.remote': <MuiIcons.OpenInNew />,
  'data.str': <MuiIcons.FormatColorText />,
  'data.structure': <MuiIcons.Grain />,
  'process.calculation': <RocketIcon />,
  'process.process': <RocketIcon />,
  'process.workflow': <GitBranchIcon /> // <MuiIcons.Share />,
}

function AiidaTreeElement(props: IAiidaTreeElementProps): JSX.Element {
  const classes = useStyles()

  const key = props.elementName === undefined ? 'default' : props.elementName
  let icon = ElementIconMap[key] || <MuiIcons.DeviceUnknown />

  const [open, setOpen] = React.useState(false)
  const handleClick = () => {
    setOpen(!open)
  }

  const [contextPosition, setContextPosition] =
    React.useState<{
      mouseX: null | number
      mouseY: null | number
    }>(initialMouseState)

  // TODO currently if you right-click a second time,
  // it will simply move the current open menu,
  // not close it and open the "correct" context-menu for the position on the screen
  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setContextPosition({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4
    })
  }

  const handleContextClose = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setContextPosition(initialMouseState)
  }
  const copyUUIDtoClipboard = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setContextPosition(initialMouseState)
    copy(`${props.uuid}`)
  }

  // TODO react-markdown for tooltip
  if (props.tooltip !== undefined) {
    icon = (
      <Tooltip title={<p>{props.tooltip}</p>}>
        <span>{icon}</span>
      </Tooltip>
    )
  }

  let title = <span>{props.header}</span>
  if (['excepted', 'killed'].includes(props.procState || '')) {
    title = (
      <span>
        {props.header}
        <Chip
          className={classes.listChip}
          label={`${props.procState} [${props.procExit}]`}
          variant="outlined"
          color="secondary"
        />
      </span>
    )
  } else if (!!props.procState) {
    title = (
      <span>
        {props.header}
        <Chip
          className={classes.listChip}
          label={`${props.procState} [${props.procExit}]`}
          variant="outlined"
          color="primary"
        />
      </span>
    )
  }

  return (
    <React.Fragment>
      <ListItem
        button
        onClick={handleClick}
        onContextMenu={handleRightClick}
        className={props.nested ? classes.nested2 : undefined}
      >
        <ListItemAvatar>
          <Avatar>{icon}</Avatar>
        </ListItemAvatar>
        <ListItemText className={classes.item} primary={title} secondary={props.info} />
        {/* TODO context menu does not close on a right-click not over the node */}
        <Menu
          keepMounted
          open={contextPosition.mouseY !== null}
          onClose={handleContextClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextPosition.mouseY !== null && contextPosition.mouseX !== null
              ? { top: contextPosition.mouseY, left: contextPosition.mouseX }
              : undefined
          }
        >
          <ListItem>
            <b>PK {props.pk} Menu</b>
          </ListItem>
          <MenuItem onClick={copyUUIDtoClipboard}>Copy UUID to Clipboard</MenuItem>
          <MenuItem onClick={handleContextClose}>Close</MenuItem>
          {/* <MenuItem onClick={handleContextClose}>Open Data</MenuItem>
                    <MenuItem onClick={handleContextClose}>Add to Group</MenuItem> */}
        </Menu>
        {props.nested ? null : open ? <MuiIcons.ExpandMore /> : <MuiIcons.ExpandLess />}
      </ListItem>
      {props.nested ? null : <AiidaNodeChildren nodeUUID={props.uuid} open={open} />}
      <Divider light />
    </React.Fragment>
  )
}

function AiidaNodeChildren({
  nodeUUID,
  open
}: {
  nodeUUID: string | null
  open: boolean
}): JSX.Element {
  const classes = useStyles()
  const [openRepo, setOpenRepo] = React.useState(false)
  const handleRepoClick = () => {
    setOpenRepo(!openRepo)
  }
  const [openIncoming, setOpenIncoming] = React.useState(false)
  const handleIncomingClick = () => {
    setOpenIncoming(!openIncoming)
  }
  const [openOutgoing, setOpenOutgoing] = React.useState(false)
  const handleOutgoingClick = () => {
    setOpenOutgoing(!openOutgoing)
  }
  return (
    <Collapse in={open} timeout="auto">
      <List component="div" disablePadding>
        <ListItem button onClick={handleRepoClick} className={classes.nested1}>
          <ListItemIcon>
            <MuiIcons.Inbox />
          </ListItemIcon>
          <ListItemText primary="Repository" />
          {openRepo ? <MuiIcons.ExpandMore /> : <MuiIcons.ExpandLess />}
        </ListItem>
        <Collapse in={openRepo} mountOnEnter>
          <AiidaRepoList nodeUUID={nodeUUID} />
        </Collapse>
        <ListItem button onClick={handleIncomingClick} className={classes.nested1}>
          <ListItemIcon>
            <MuiIcons.ArrowForward />
          </ListItemIcon>
          <ListItemText primary="Incoming" />
          {openIncoming ? <MuiIcons.ExpandMore /> : <MuiIcons.ExpandLess />}
        </ListItem>
        <Collapse in={openIncoming} mountOnEnter>
          <AiidaLinkIncomingList nodeUUID={nodeUUID} />
        </Collapse>
        <ListItem button onClick={handleOutgoingClick} className={classes.nested1}>
          <ListItemIcon>
            <MuiIcons.ArrowBack />
          </ListItemIcon>
          <ListItemText primary="Outgoing" />
          {openOutgoing ? <MuiIcons.ExpandMore /> : <MuiIcons.ExpandLess />}
        </ListItem>
        <Collapse in={openOutgoing} mountOnEnter>
          <AiidaLinkOutgoingList nodeUUID={nodeUUID} />
        </Collapse>
      </List>
    </Collapse>
  )
}

function AiidaRepoList({ nodeUUID }: { nodeUUID: string | null }): JSX.Element {
  const classes = useStyles()
  const aiidaSettings = useContext(AiidaSettingsContext)
  // TODO usePaginationQuery
  const result = useQuery(
    [aiidaSettings.baseUrl, 'nodeRepolist', nodeUUID],
    () => getNodeRepoList(aiidaSettings.baseUrl, nodeUUID),
    { enabled: aiidaSettings.baseUrl !== null }
  )

  let element = <CircularProgress />
  if (result.isIdle || result.data === null) {
    element = (
      <Alert severity="info" icon={<MuiIcons.SyncDisabled />}>
        Disabled
      </Alert>
    )
  } else if (result.data !== undefined) {
    element = (
      <List component="nav" aria-label="main aiida repo">
        {result.data.map(value => {
          return (
            <ListItem className={classes.nested2}>
              <ListItemIcon>
                {value.type === 'DIRECTORY' ? (
                  <MuiIcons.Folder />
                ) : (
                  <MuiIcons.Description />
                )}
              </ListItemIcon>
              <ListItemText primary={value.name} />
            </ListItem>
          )
        })}
      </List>
    )
  } else if (result.isError) {
    const error = result.error as { message: string }
    element = <Alert severity="error">{error.message}</Alert>
  }

  return element
}

function AiidaLinkIncomingList({ nodeUUID }: { nodeUUID: string | null }): JSX.Element {
  const aiidaSettings = useContext(AiidaSettingsContext)
  const result = useQuery(
    [aiidaSettings.baseUrl, 'nodeIncoming', nodeUUID],
    () => getNodeIncoming(aiidaSettings.baseUrl, nodeUUID),
    { enabled: aiidaSettings.baseUrl !== null }
  )

  let element = <CircularProgress />
  if (result.isIdle || result.data === null) {
    element = (
      <Alert severity="info" icon={<MuiIcons.SyncDisabled />}>
        Disabled
      </Alert>
    )
  } else if (result.data !== undefined) {
    element = (
      <List component="nav" aria-label="main aiida incoming">
        {result.data.map(value => {
          return (
            <AiidaTreeElement
              nested={true}
              pk={value.id}
              uuid={value.uuid}
              header={`${value.id} ${value.link_type.toUpperCase()} ${
                value.link_label
              }`}
              elementName={value.node_type.split('.').slice(0, 2).join('.')}
              info={`${value.mtime}, ${value.node_type}, ${value.process_type || ''}`}
              tooltip={`UUID: ${value.uuid}`}
            />
          )
        })}
      </List>
    )
  } else if (result.isError) {
    const error = result.error as { message: string }
    element = <Alert severity="error">{error.message}</Alert>
  }

  return element
}

function AiidaLinkOutgoingList({ nodeUUID }: { nodeUUID: string | null }): JSX.Element {
  const aiidaSettings = useContext(AiidaSettingsContext)
  const result = useQuery(
    [aiidaSettings.baseUrl, 'nodeOutgoing', nodeUUID],
    () => getNodeOutgoing(aiidaSettings.baseUrl, nodeUUID),
    { enabled: aiidaSettings.baseUrl !== null }
  )

  let element = <CircularProgress />
  if (result.isIdle || result.data === null) {
    element = (
      <Alert severity="info" icon={<MuiIcons.SyncDisabled />}>
        Disabled
      </Alert>
    )
  } else if (result.data !== undefined) {
    element = (
      <List component="nav" aria-label="main aiida incoming">
        {result.data.map(value => {
          return (
            <AiidaTreeElement
              nested={true}
              pk={value.id}
              uuid={value.uuid}
              header={`${value.id} ${value.link_type.toUpperCase()} ${
                value.link_label
              }`}
              elementName={value.node_type.split('.').slice(0, 2).join('.')}
              info={`${value.mtime}, ${value.node_type}, ${value.process_type || ''}`}
              tooltip={`UUID: ${value.uuid}`}
            />
          )
        })}
      </List>
    )
  } else if (result.isError) {
    const error = result.error as { message: string }
    element = <Alert severity="error">{error.message}</Alert>
  }

  return element
}
