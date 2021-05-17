import React, { useContext } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Pagination from '@material-ui/lab/Pagination';
// import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Alert from '@material-ui/lab/Alert';

import CircularProgress from '@material-ui/core/CircularProgress'
import { ArrowBack, ArrowForward, DeviceUnknown, Inbox, Refresh, SyncDisabled } from '@material-ui/icons';

import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useQuery } from 'react-query'


import { AiidaSettingsContext, fetchProcesses } from './aiidaClient'
import { RocketIcon } from './icons'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tree: {
            width: '100%',
            maxWidth: 420,
            backgroundColor: theme.palette.background.paper,
        },
        pagination: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(1)
        },
        listChip: {
            marginLeft: theme.spacing(1),
            marginBottom: theme.spacing(1)
        },
        item: {
            maxWidth: 380,
            overflow: "hidden",
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
    }),
);

const initialMouseState = {
    mouseX: null,
    mouseY: null,
};


interface IAiidaXElementProps {
    pk: number
    elementName?: string
    info?: string
    tooltip?: string
    state?:
    | 'created'
    | 'running'
    | 'waiting'
    | 'finished'
    | 'excepted'
    | 'killed'
}


export function AiidaXTree(): JSX.Element {
    /**
     * a React component housing a list of AiiDA elements
    */

    const classes = useStyles();
    const [page, setPage] = React.useState(1);
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    const aiidaSettings = useContext(AiidaSettingsContext)
    // TODO usePaginationQuery
    const result = useQuery([aiidaSettings.baseUrl, 'processes', page], () => fetchProcesses(aiidaSettings.baseUrl, page), { enabled: aiidaSettings.enabled })

    let element = <CircularProgress />
    let pages = 1
    if (result.data !== undefined) {
        pages = Math.ceil(result.data.totalCount / result.data.perPage)
        element = (
            <List component="nav" aria-label="main aiida tree">
                {result.data.nodes.map((value) => {
                    return <AiidaXElement
                        pk={value.id}
                        elementName='process'
                        info={`${value.mtime}, ${value.node_type}, ${value.process_type}`}
                        tooltip={`${value.label}`}
                        state={value.attributes?.process_state}
                    />
                })}
            </List>
        )
    } else if (result.isError) {
        const error = result.error as { message: string }
        element = <Alert severity="error">{error.message}</Alert>
    } else if (result.isIdle) {
        element = <Alert severity="info" icon={<SyncDisabled />}>Disabled</Alert>
    }

    return (
        <div className={classes.tree}>
            <Button
                variant="outlined"
                color="primary"
                startIcon={<Refresh />}
                onClick={() => { result.refetch() }}
            >
                Refresh
            </Button>
            <Pagination
                className={classes.pagination}
                color="primary"
                count={pages} page={page}
                onChange={handlePageChange}
            />
            {element}
        </div>
    )
}

// TODO better value type, custom icons (https://primer.style/octicons/packages/react)
const ElementIconMap: { [key: string]: JSX.Element } = {
    'default': <DeviceUnknown />,
    'folder': <Inbox />,
    'process': <RocketIcon />
}


function AiidaXElement(props: IAiidaXElementProps): JSX.Element {

    const classes = useStyles();

    const key = props.elementName === undefined ? 'default' : props.elementName
    let icon = ElementIconMap[key] || <DeviceUnknown />

    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    const [contextPosition, setContextPosition] = React.useState<{
        mouseX: null | number;
        mouseY: null | number;
    }>(initialMouseState);

    // TODO currently if you right-click a second time,
    // it will simply move the current open menu,
    // not close it and open the "correct" context-menu for the position on the screen
    const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setContextPosition({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleContextClose = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setContextPosition(initialMouseState);
    };

    // TODO react-markdown for tooltip
    if (props.tooltip) {
        icon = (
            <Tooltip title={
                <React.Fragment>
                    <p>{props.tooltip}</p>
                </React.Fragment>
            }>
                {icon}
            </Tooltip>
        )
    }

    let title = <span>{props.pk}</span>
    if (['excepted', 'killed'].includes(props.state || '')) {
        title = <span>{props.pk}<Chip className={classes.listChip} label={props.state} variant="outlined" color="secondary" /></span>
    } else if (props.state !== undefined) {
        title = <span>{props.pk}<Chip className={classes.listChip} label={props.state} variant="outlined" color="primary" /></span>
    }


    return (
        <React.Fragment>
            <ListItem key={props.pk} button onClick={handleClick} onContextMenu={handleRightClick} >
                <ListItemAvatar>
                    <Avatar>
                        {icon}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    className={classes.item}
                    primary={title}
                    secondary={props.info}
                />
                <Menu
                    hidden
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
                    <ListItem><b>PK {props.pk} Menu</b></ListItem>
                    <MenuItem onClick={handleContextClose}>Open Data</MenuItem>
                    <MenuItem onClick={handleContextClose}>Add to Group</MenuItem>
                </Menu>
                {open ? <ExpandMore /> : <ExpandLess />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <Inbox />
                        </ListItemIcon>
                        <ListItemText primary="Repository" />
                    </ListItem>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <ArrowForward />
                        </ListItemIcon>
                        <ListItemText primary="Incoming" />
                    </ListItem>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <ArrowBack />
                        </ListItemIcon>
                        <ListItemText primary="Outgoing" />
                    </ListItem>
                </List>
            </Collapse>
            <Divider light />
        </React.Fragment>
    )
}
