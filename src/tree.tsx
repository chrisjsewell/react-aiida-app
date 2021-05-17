import React, { useContext } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';

import CircularProgress from '@material-ui/core/CircularProgress'
import SvgIcon from '@material-ui/core/SvgIcon';
import { DeviceUnknown, Inbox, Refresh, SyncDisabled } from '@material-ui/icons';

import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { useQuery } from 'react-query'


import { AiidaSettingsContext, fetchProcesses } from './aiidaClient'

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
        }
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
        element = <Typography color="error">{error.message}</Typography>
    } else if (result.isIdle) {
        element = (
            <span>
                <SyncDisabled />
                <Typography>Disabled</Typography>
            </span>
        )
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
    'process': (<SvgIcon>
        <path fillRule="evenodd" d="M14.064 0a8.75 8.75 0 00-6.187 2.563l-.459.458c-.314.314-.616.641-.904.979H3.31a1.75 1.75 0 00-1.49.833L.11 7.607a.75.75 0 00.418 1.11l3.102.954c.037.051.079.1.124.145l2.429 2.428c.046.046.094.088.145.125l.954 3.102a.75.75 0 001.11.418l2.774-1.707a1.75 1.75 0 00.833-1.49V9.485c.338-.288.665-.59.979-.904l.458-.459A8.75 8.75 0 0016 1.936V1.75A1.75 1.75 0 0014.25 0h-.186zM10.5 10.625c-.088.06-.177.118-.266.175l-2.35 1.521.548 1.783 1.949-1.2a.25.25 0 00.119-.213v-2.066zM3.678 8.116L5.2 5.766c.058-.09.117-.178.176-.266H3.309a.25.25 0 00-.213.119l-1.2 1.95 1.782.547zm5.26-4.493A7.25 7.25 0 0114.063 1.5h.186a.25.25 0 01.25.25v.186a7.25 7.25 0 01-2.123 5.127l-.459.458a15.21 15.21 0 01-2.499 2.02l-2.317 1.5-2.143-2.143 1.5-2.317a15.25 15.25 0 012.02-2.5l.458-.458h.002zM12 5a1 1 0 11-2 0 1 1 0 012 0zm-8.44 9.56a1.5 1.5 0 10-2.12-2.12c-.734.73-1.047 2.332-1.15 3.003a.23.23 0 00.265.265c.671-.103 2.273-.416 3.005-1.148z"></path>
    </SvgIcon>)
}


function AiidaXElement(props: IAiidaXElementProps): JSX.Element {

    const classes = useStyles();

    const key = props.elementName === undefined ? 'default' : props.elementName
    let icon = ElementIconMap[key] || <DeviceUnknown />

    const [open, setOpen] = React.useState(true);
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
    )
}
