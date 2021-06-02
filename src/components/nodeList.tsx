import React, { useContext, useState } from 'react'

import {
  Button,
  CircularProgress,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  // Tooltip,
  Typography
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import * as MuiIcons from '@material-ui/icons'

import { Alert, Pagination, Skeleton } from '@material-ui/lab'

import { useQuery } from 'react-query'

import {
  AiidaSettingsContext,
  getNodes,
  getNodeIncoming,
  getNodeOutgoing,
  getNodeRepoList,
  IAiidaRestNodeRepoListItem,
  IAiidaRestNodeLinkItem
} from '../clients/aiidaClient'
import { useStyles } from '../styles'
import { AiidaNodeListItem } from './aiidaListItems'

/**
 * A component housing a list of AiiDA elements
 */
export function AiidaNodeTree({ nodePrefix }: { nodePrefix: string }): JSX.Element {
  const classes = useStyles()
  const theme = useTheme()

  const [page, setPage] = useState(1)
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }
  const aiidaSettings = useContext(AiidaSettingsContext)

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
          <Divider />
          {result.data.nodes.map(value => {
            const process = {
              label: value.attributes?.process_label,
              state: value.attributes?.process_state,
              exitStatus: value.attributes?.exit_status
            }
            return (
              <AiidaNodeListItem
                key={`aiida-tree-el-${value.uuid}`}
                pk={value.id}
                uuid={value.uuid}
                mtime={value.mtime}
                node_type={value.node_type}
                process_type={value.process_type}
                label={value.label}
                process={value.attributes?.process_state ? process : undefined}
                child={AiidaNodeChildren}
              />
            )
          })}
        </List>
      )
    }
  } else if (result.isError) {
    const error = result.error as { message: string }
    element = <Alert severity="error">{error.message}</Alert>
    // TODO if we don't reset the page here, then changing the filter parameters
    // can query for a page that does not exist,
    // but ideally a change in filters would always reset the page number
    setPage(1)
  }
  let updateInfo = null
  if (!!result.dataUpdatedAt) {
    const date = new Date(result.dataUpdatedAt)
    updateInfo = (
      <Typography display="inline" noWrap>
        Updated: {date.toLocaleString()}
      </Typography>
    )
  }

  return (
    <div className={classes.nodeTree}>
      <Button
        variant="outlined"
        color="default"
        style={{ marginRight: theme.spacing(1) }}
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
      <div className={classes.independentScroll}>{element}</div>
    </div>
  )
}

function AiidaNodeChildren({
  uuid,
  indent
}: {
  uuid: string | null
  indent: number
}): JSX.Element {
  const theme = useTheme()
  const aiidaSettings = useContext(AiidaSettingsContext)

  // TODO use https://react-query.tanstack.com/guides/infinite-queries
  const resultRepo = useQuery(
    [aiidaSettings.baseUrl, 'nodeRepolist', uuid],
    () => getNodeRepoList(aiidaSettings.baseUrl, uuid),
    { enabled: aiidaSettings.baseUrl !== null }
  )
  const resultIncoming = useQuery(
    [aiidaSettings.baseUrl, 'nodeIncoming', uuid],
    () => getNodeIncoming(aiidaSettings.baseUrl, uuid),
    { enabled: aiidaSettings.baseUrl !== null }
  )
  const resultOutgoing = useQuery(
    [aiidaSettings.baseUrl, 'nodeOutgoing', uuid],
    () => getNodeOutgoing(aiidaSettings.baseUrl, uuid),
    { enabled: aiidaSettings.baseUrl !== null }
  )

  const marginStyle = { marginLeft: theme.spacing(indent + 4) }

  return (
    <List component="div" disablePadding>
      {resultRepo.data?.length ? (
        <AiidaRepoList data={resultRepo.data} indent={indent + 4} />
      ) : resultRepo.isError ? (
        <Alert
          severity="error"
          style={marginStyle}
        >{`Repository error: ${resultRepo.error}`}</Alert>
      ) : null}
      {resultIncoming.data?.length ? (
        <AiidaLinksList
          direction="incoming"
          data={resultIncoming.data}
          indent={indent + 4}
        />
      ) : resultIncoming.isError ? (
        <Alert
          severity="error"
          style={marginStyle}
        >{`Incoming error: ${resultIncoming.error}`}</Alert>
      ) : null}
      {resultOutgoing.data?.length ? (
        <AiidaLinksList
          direction="outgoing"
          data={resultOutgoing.data}
          indent={indent + 4}
        />
      ) : resultOutgoing.isError ? (
        <Alert
          severity="error"
          style={marginStyle}
        >{`Outgoing error: ${resultOutgoing.error}`}</Alert>
      ) : null}
      {resultRepo.isLoading || resultIncoming.isLoading || resultOutgoing.isLoading ? (
        <Typography variant="h3">
          <Skeleton style={marginStyle} />
        </Typography>
      ) : null}
    </List>
  )
}

function AiidaRepoList({
  data,
  indent
}: {
  data: IAiidaRestNodeRepoListItem[]
  indent: number
}): JSX.Element {
  const theme = useTheme()

  const [open, setOpen] = useState(false)
  const handleRepoClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <ListItem
        button
        onClick={handleRepoClick}
        style={indent ? { paddingLeft: theme.spacing(indent) } : {}}
      >
        <ListItemIcon>
          <MuiIcons.Inbox />
        </ListItemIcon>
        <ListItemText primary="Repository" />
        {open ? <MuiIcons.ExpandMore /> : <MuiIcons.ExpandLess />}
      </ListItem>
      <Collapse in={open}>
        <List component="nav" aria-label="main aiida repo">
          {data.map(value => {
            return (
              <ListItem style={{ paddingLeft: theme.spacing(indent + 4) }}>
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
      </Collapse>
    </>
  )
}

function AiidaLinksList({
  direction,
  data,
  indent
}: {
  direction: 'incoming' | 'outgoing'
  data: IAiidaRestNodeLinkItem[]
  indent: number
}): JSX.Element {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const handleIncomingClick = () => {
    setOpen(!open)
  }

  return (
    <>
      {' '}
      <ListItem
        button
        onClick={handleIncomingClick}
        style={indent ? { paddingLeft: theme.spacing(indent) } : {}}
      >
        <ListItemIcon>
          {direction === 'incoming' ? (
            <MuiIcons.ArrowForward />
          ) : (
            <MuiIcons.ArrowBack />
          )}
        </ListItemIcon>
        <ListItemText primary={direction} style={{ textTransform: 'capitalize' }} />
        {open ? <MuiIcons.ExpandMore /> : <MuiIcons.ExpandLess />}
      </ListItem>
      <Collapse in={open}>
        <List component="nav" aria-label="main aiida links">
          {data.map(value => {
            return (
              <AiidaNodeListItem
                key={`aiida-tree-el-${value.uuid}`}
                pk={value.id}
                uuid={value.uuid}
                mtime={value.mtime}
                node_type={value.node_type}
                process_type={value.process_type}
                label={value.label}
                link={{
                  direction: direction,
                  type: value.link_type,
                  label: value.link_label
                }}
                indent={indent + 2}
              />
            )
          })}
        </List>
      </Collapse>
    </>
  )
}
