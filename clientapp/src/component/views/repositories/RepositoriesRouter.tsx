import {Route, Switch, useRouteMatch} from 'react-router-dom';
import * as React from 'react';
import {RepositoryListView} from './RepositoryListView';
import {RepositoryCreateEditView} from './RepositoryCreateEditView';
import {LanguageListView} from './languages/LanguageListView';
import {LINKS} from '../../../constants/links';
import {LanguageEditView} from './languages/LanguageEditView';

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
                <RepositoryCreateEditView/>
            </Route>

            <Route exact path={`${LINKS.REPOSITORY_ADD.template}`}>
                <RepositoryCreateEditView/>
            </Route>

            <Route exact path={`${LINKS.REPOSITORY_LANGUAGES.template}`}>
                <LanguageListView/>
            </Route>

            <Route exact path={`${LINKS.REPOSITORY_LANGUAGE_EDIT.template}`}>
                <LanguageEditView/>
            </Route>

        </Switch>
    );
};
