import {Route, Switch, useRouteMatch} from 'react-router-dom';
import * as React from 'react';
import {RepositoryListView} from './RepositoryListView';
import {RepositoryEditView} from './RepositoryEditView';
import {LanguageListView} from './languages/LanguageListView';
import {LINKS} from '../../../constants/links';

export const RepositoriesRouter = () => {
    let match = useRouteMatch();

    const TranslationsView = React.lazy(() => import(/* webpackChunkName: "translationsView" */ './TranslationsView'));

    return (
        <Switch>
            <Route exact path={`${match.path}/:repositoryId/translations`}>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <TranslationsView/>
                </React.Suspense>
            </Route>
            <Route exact path={`${match.path}`}>
                <RepositoryListView/>
            </Route>
            <Route exact path={`${match.path}/edit/:repositoryId`}>
                <RepositoryEditView/>
            </Route>

            <Route exact path={`${LINKS.REPOSITORY_LANGUAGES.template}`}>
                <LanguageListView/>
            </Route>


        </Switch>
    );
};
