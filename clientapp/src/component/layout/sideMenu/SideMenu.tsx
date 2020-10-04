import * as React from 'react';
import {FunctionComponent} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {MenuItem, Select} from "@material-ui/core";
import {T, useCurrentLanguage, useSetLanguage} from "polygloat-react";


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
}));

interface SideMenuProps {
    onSideMenuToggle: () => void;
    open: boolean;
}

export const SideMenu: FunctionComponent<SideMenuProps> = ({onSideMenuToggle, open, children}) => {
    const classes = useStyles({});

    const setLanguage = useSetLanguage();
    const getCurrentLanguage = useCurrentLanguage();

    return (
        <Drawer
            variant="permanent"
            classes={{
                paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
            color="secondary"
        >
            <div className={classes.toolbarIcon}>
                <Select label={<T>language_select_label</T>}
                        onChange={e => setLanguage(e.target.value as string)}
                        value={getCurrentLanguage()}
                        renderValue={() => getCurrentLanguage()}
                >
                    <MenuItem value="cz">Česky</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                </Select>
                <IconButton onClick={onSideMenuToggle}>
                    {open ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButton>
            </div>
            {children}
        </Drawer>
    );
};
