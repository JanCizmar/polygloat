import {Route, Switch, useRouteMatch} from 'react-router-dom';
import * as React from 'react';

export const RepositoriesView = () => {
    let match = useRouteMatch();

    console.log(match);

    const TranslationsView = React.lazy(() => import(/* webpackChunkName: "translationsView" */ './TranslationsView'));

    return (
        <Switch>
            <Route path={`${match.path}/:repositoryId`}>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <TranslationsView/>
                </React.Suspense>
            </Route>
            <Route path={`${match.path}`}>
                <h1>Repositories</h1>
            </Route>
        </Switch>
    );
};
