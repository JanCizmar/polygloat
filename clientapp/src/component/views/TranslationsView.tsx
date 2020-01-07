import * as React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
//import TranslationsTable from '../Translations/TranslationsTable';
import {makeStyles} from '@material-ui/core/styles';
import {DashboardPage} from '../layout/DashboardPage';
import {Divider} from '@material-ui/core';
import List from '@material-ui/core/List';
import {SideMenuItem} from '../layout/sideMenu/SideMenuItem';
import {LINKS} from '../../constants/links';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';

const TranslationsTable = React.lazy(() => import(/* webpackChunkName: "translationsTable" */'../Translations/TranslationsTable'));


const useStyles = makeStyles(theme => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

const SideMenuItems = () => (
    <div>
        <Divider/>
        <List>
            <SideMenuItem linkTo={LINKS.REPOSITORIES.build({repositoryId: 1})} icon={<FormatListBulletedIcon/>} text="Repositories"/>
        </List>
        {/*<Divider/>
        <List>{secondaryListItems}</List>*/}
    </div>
);


export default function TranslationView() {
    const classes = useStyles({});


    return (
        <DashboardPage sideMenuItems={<SideMenuItems/>}>
            <Container maxWidth="lg" className={classes.container}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={12}>
                        <TranslationsTable/>
                    </Grid>
                </Grid>
            </Container>
        </DashboardPage>
    );
};
