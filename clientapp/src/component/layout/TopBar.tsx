import * as React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {UserMenu} from '../security/UserMenu';
import {Link} from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
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
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1
    },
    polygloatLink: {
        color: "inherit",
        textDecoration: "inherit"
    }
}));

interface TopBarProps {
    onSideMenuOpen: () => void;
    open: boolean
    isSideMenu: Boolean
    subtitle?: string
}

export function TopBar({onSideMenuOpen, open, isSideMenu, ...props}: TopBarProps) {
    const classes = useStyles({});


    return (
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
            <Toolbar className={classes.toolbar}>
                {isSideMenu &&
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={onSideMenuOpen}
                    className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                >
                    <MenuIcon/>
                </IconButton>}
                {/*
                        // @ts-ignore */}
                <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                    <Link className={classes.polygloatLink} to={"/"}>Polygloat</Link> {props.subtitle && '- ' + props.subtitle}
                </Typography>
                <UserMenu/>
            </Toolbar>
        </AppBar>
    );
}
