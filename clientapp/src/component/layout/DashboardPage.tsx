import * as React from 'react';
import {FunctionComponent, ReactElement} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import MaterialLink from '@material-ui/core/Link';
import {MainMenu} from './MainMenu';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <MaterialLink color="inherit" href="https://polygloat.com">
                Polygloat
            </MaterialLink>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

interface DashboardPageProps {
    sideMenuItems?: ReactElement;
}

export const DashboardPage: FunctionComponent<DashboardPageProps> = ({children, sideMenuItems}) => {
    const classes = useStyles({});

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <MainMenu sideMenuItems={sideMenuItems}/>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        {children}
                    </Grid>
                </Container>
                <Box pt={4}>
                    <Copyright/>
                </Box>
            </main>
        </div>
    );
};
