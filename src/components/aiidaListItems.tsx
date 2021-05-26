import React, { useState } from 'react'

import {
  Avatar,
  Chip,
  Collapse,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import * as MuiIcons from '@material-ui/icons'
import { Alert } from '@material-ui/lab'

import copy from 'copy-to-clipboard'

import { LocalStorageKeys } from '../constants'
import { useSnackbar } from '../hooks'
import { ElementIconMap } from '../icons'
import { useStyles } from '../styles'

export interface IAiidaNodeListItemProps {
  pk: number
  uuid: string
  mtime: string
  node_type: string
  process_type?: string
  label: string
  process?: {
    label: string
    state: 'created' | 'running' | 'waiting' | 'finished' | 'excepted' | 'killed'
    exitStatus?: number
  }
  link?: {
    direction: 'incoming' | 'outgoing'
    type: string
    label: string
  }
  indent: number
  contextMenu: (props: IContextMenuNodeProps) => JSX.Element
  child?: (props: { uuid: string; indent: number }) => JSX.Element
}

/** A list item for a single AiiDA Node (with prefetched data) */
export function AiidaNodeListItem(props: IAiidaNodeListItemProps): JSX.Element {
  // setup style hooks
  const theme = useTheme()
  const classes = useStyles()

  // setup context menu state
  const [menuOpen, setmenuOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setmenuOpen(true)
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(null)
    setmenuOpen(false)
  }

  // setup child state
  const [childOpen, setchildOpen] = useState(false)
  const handleChildrenOpen = () => {
    setchildOpen(!childOpen)
  }

  // set the node icon
  const elementName = props.node_type.split('.').slice(0, 2).join('.')
  const icon = ElementIconMap[!elementName ? 'default' : elementName] || (
    <MuiIcons.DeviceUnknown />
  )

  // set the primary text
  const variant = 'subtitle1'
  let title = (
    <Typography variant={variant}>{`${props.pk} ${props.label || ''}`}</Typography>
  )
  if (props.process) {
    let color = theme.palette.primary.main
    if (['excepted', 'killed'].includes(props.process.state || '')) {
      color = theme.palette.error.main
    } else if (props.process.exitStatus === 0) {
      color = theme.palette.success.main
    }

    title = (
      <Typography variant={variant}>
        {`${props.pk} ${props.process.label || props.label || ''}`}
        <Chip
          className={classes.nodeItemChip}
          label={
            props.process.exitStatus === 0 || props.process.exitStatus
              ? `${(props.process.state || '').toUpperCase()} [${
                  props.process.exitStatus
                }]`
              : `${(props.process.state || '').toUpperCase()}`
          }
          variant="outlined"
          // note only primary/secondary allow for actual color attribute
          style={{
            color: color,
            borderColor: color
          }}
        />
      </Typography>
    )
  }
  if (props.link) {
    title = (
      <Typography variant={variant}>{`${props.pk} ${props.link.type.toUpperCase()} ${
        props.link.label
      }`}</Typography>
    )
  }

  // set the secondary text
  let info = `${props.mtime}, ${props.node_type}`
  if (props.process_type) {
    info = info + `, ${props.process_type}`
  }

  let child
  let LisItemProps = {}
  if (props.child) {
    LisItemProps = { button: true, onClick: handleChildrenOpen }
    child = (
      <Collapse in={childOpen} timeout="auto" mountOnEnter unmountOnExit>
        <props.child uuid={props.uuid} indent={props.indent + 4} />
      </Collapse>
    )
  }

  return (
    <>
      <ListItem
        {...LisItemProps}
        style={props.indent ? { paddingLeft: theme.spacing(props.indent) } : {}}
      >
        <ListItemAvatar>
          <IconButton onClick={handleMenuOpen}>
            <Avatar>{icon}</Avatar>
          </IconButton>
        </ListItemAvatar>
        <props.contextMenu
          open={menuOpen}
          uuid={props.uuid}
          anchorEl={anchorEl}
          handleClose={handleMenuClose}
        />
        <ListItemText
          className={classes.nodeListItem}
          primary={title}
          secondary={info}
        />
        {!child ? null : childOpen ? (
          <MuiIcons.ExpandMore style={{ marginLeft: theme.spacing(1) }} />
        ) : (
          <MuiIcons.ExpandLess style={{ marginLeft: theme.spacing(1) }} />
        )}
      </ListItem>
      {child}
      <Divider light />
    </>
  )
}

AiidaNodeListItem.defaultProps = {
  contextMenu: contextMenuNode,
  indent: 0
}

export interface IContextMenuNodeProps {
  uuid: string
  open: boolean
  anchorEl: Element | ((element: Element) => Element) | null | undefined
  handleClose: React.MouseEventHandler<HTMLElement>
}

/** A context menu for a node */
function contextMenuNode({
  open,
  uuid,
  anchorEl,
  handleClose
}: IContextMenuNodeProps): JSX.Element {
  const snackbarMessenger = useSnackbar()

  const copyUUIDtoClipboard = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    copy(`${uuid}`)
    snackbarMessenger(<Alert severity="success">{`Copied ${uuid}`}</Alert>)
    handleClose(event)
  }

  const bookmarkUUID = (event: React.MouseEvent<HTMLElement>) => {
    let current = new Set()
    try {
      const value = window.localStorage.getItem(LocalStorageKeys.aiidaUUIDbookmarks)
      if (!value) {
        throw new Error()
      }
      current = new Set(JSON.parse(value))
    } catch (err) {}
    current.add(uuid)
    window.localStorage.setItem(
      LocalStorageKeys.aiidaUUIDbookmarks,
      JSON.stringify(Array.from(current))
    )
    snackbarMessenger(<Alert severity="success">{`Bookmarked ${uuid}`}</Alert>)
    handleClose(event)
  }

  return (
    <Menu
      keepMounted
      open={open}
      onClose={handleClose}
      anchorEl={anchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      // transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      <MenuItem onClick={copyUUIDtoClipboard}>Copy UUID to Clipboard</MenuItem>
      <MenuItem onClick={bookmarkUUID}>Bookmark UUID</MenuItem>
      <MenuItem onClick={handleClose}>
        <b>Close</b>
      </MenuItem>
      {/* Open Data, Add to Group */}
    </Menu>
  )
}
