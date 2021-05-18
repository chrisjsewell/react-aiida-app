import React, { useContext } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import * as MuiIcons from '@material-ui/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import Typography from '@material-ui/core/Typography';

import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';

import CircularProgress from '@material-ui/core/CircularProgress'

import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useQuery } from 'react-query'

import { AiidaSettingsContext, fetchNodes } from './aiidaClient'
import { GitBranchIcon, RocketIcon } from './icons'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tree: {
            width: '100%',
            maxWidth: 520,
            backgroundColor: theme.palette.background.paper,
        },
        refresh: {
            marginRight: theme.spacing(1),
        },
        pagination: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(1)
        },
        listChip: {
            marginLeft: theme.spacing(1),
            marginBottom: theme.spacing(1),
            float: "right"
        },
        item: {
            maxWidth: 480,
            overflow: "hidden",
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
    }),
);


const initialMouseState = {
    mouseX: null,
    mouseY: null
} as { mouseX: null | number; mouseY: null | number }


interface IAiidaXElementProps {
    pk: number
    elementName?: string
    info?: string
    tooltip?: string
    procLabel?: string
    procState?:
    | 'created'
    | 'running'
    | 'waiting'
    | 'finished'
    | 'excepted'
    | 'killed'
    procExit?: number
}


export function AiidaXNodeTree({ nodePrefix }: { nodePrefix: string }): JSX.Element {
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
    const result = useQuery([aiidaSettings.baseUrl, 'nodes', nodePrefix, page], () => fetchNodes(aiidaSettings.baseUrl, nodePrefix, page), {enabled: aiidaSettings.baseUrl !== null})

    let element = <CircularProgress />
    let pages = 1
    if (result.isIdle || result.data === null) {
        element = <Alert severity="info" icon={<MuiIcons.SyncDisabled />}>Disabled</Alert>
    } else if (result.data !== undefined) {
        pages = Math.ceil(result.data.totalCount / result.data.perPage)
        element = (
            <List component="nav" aria-label="main aiida tree">
                {result.data.nodes.map((value) => {
                    return <AiidaXElement
                        pk={value.id}
                        elementName={value.node_type.split(".").slice(0, 2).join(".")}
                        info={`${value.mtime}, ${value.node_type}, ${value.process_type || ''}`}
                        tooltip={`${value.label}`}
                        procLabel={value.attributes?.process_label}
                        procState={value.attributes?.process_state}
                        procExit={value.attributes?.exit_status}
                    />
                })}
            </List>
        )
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
                onClick={() => { result.refetch() }}
            >
                Refresh
            </Button>
            {updateInfo}
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
    'default': <MuiIcons.DeviceUnknown />,
    'folder': <MuiIcons.Inbox />,
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
    'process.workflow': <GitBranchIcon />,  // <MuiIcons.Share />,
}


function AiidaXElement(props: IAiidaXElementProps): JSX.Element {

    const classes = useStyles();

    const key = props.elementName === undefined ? 'default' : props.elementName
    let icon = ElementIconMap[key] || <MuiIcons.DeviceUnknown />

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

    let title = <span>{props.pk} {props.procLabel || ''}</span>
    if (['excepted', 'killed'].includes(props.procState || '')) {
        title = <span>{props.pk} {props.procLabel || ''}<Chip className={classes.listChip} label={`${props.procState} [${props.procExit}]`} variant="outlined" color="secondary" /></span>
    } else if (!!props.procState) {
        title = <span>{props.pk} {props.procLabel || ''}<Chip className={classes.listChip} label={`${props.procState} [${props.procExit}]`} variant="outlined" color="primary" /></span>
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
                {open ? <MuiIcons.ExpandMore /> : <MuiIcons.ExpandLess />}
            </ListItem>
            <Collapse in={open} timeout="auto">
                <List component="div" disablePadding>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <MuiIcons.Inbox />
                        </ListItemIcon>
                        <ListItemText primary="Repository" />
                    </ListItem>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <MuiIcons.ArrowForward />
                        </ListItemIcon>
                        <ListItemText primary="Incoming" />
                    </ListItem>
                    <ListItem button className={classes.nested}>
                        <ListItemIcon>
                            <MuiIcons.ArrowBack />
                        </ListItemIcon>
                        <ListItemText primary="Outgoing" />
                    </ListItem>
                </List>
            </Collapse>
            <Divider light />
        </React.Fragment>
    )
}
