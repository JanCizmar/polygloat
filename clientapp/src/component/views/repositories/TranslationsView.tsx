import * as React from 'react';
import Grid from '@material-ui/core/Grid';
//import TranslationsTable from '../Translations/TranslationsTable';
import {Divider} from '@material-ui/core';
import List from '@material-ui/core/List';
import {SideMenuItem} from '../../layout/sideMenu/SideMenuItem';
import {LINKS} from '../../../constants/links';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import {RepositoryPage} from './RepositoryPage';
import {useRouteMatch} from 'react-router-dom';

const TranslationsTable = React.lazy(() => import(/* webpackChunkName: "translationsTable" */'../../Translations/TranslationsTable'));

const SideMenuItems = () => (
    <div>
        <Divider/>
        <List>
            <SideMenuItem linkTo={LINKS.REPOSITORIES.build()} icon={<FormatListBulletedIcon/>} text="Repositories"/>
        </List>
        {/*<Divider/>
        <List>{secondaryListItems}</List>*/}
    </div>
);


export default function TranslationView() {
    let match = useRouteMatch();
    const id = match.params['repositoryId'];

    return (
        <RepositoryPage id={id}>
            <Grid item xs={12} md={12} lg={12}>
                <TranslationsTable/>
            </Grid>
        </RepositoryPage>
    );
};
