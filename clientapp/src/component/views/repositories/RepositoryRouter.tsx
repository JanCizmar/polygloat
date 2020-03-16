import {Route, Switch, useRouteMatch} from 'react-router-dom';
import * as React from 'react';
import {LanguageListView} from './languages/LanguageListView';
import {LINKS, PARAMS} from '../../../constants/links';
import {LanguageEditView} from './languages/LanguageEditView';
import {RepositoryInviteView} from './invitations/RepositoryInviteView';
import {RepositoryPermissionsView} from './permissions/RepositoryPermissionsVIew';
import {RepositorySettingsView} from "./repository/RepositorySettingsView";
import {RepositoryProvider} from "../../../hooks/RepositoryProvider";
import {LanguageCreateView} from "./languages/LanguageCreateView";
import {ApiKeysView} from "../../security/apiKeys/ApiKeysView";

export const RepositoryRouter = () => {
    let match = useRouteMatch();

    const TranslationsView = React.lazy(() => import(/*
    webpackChunkName: "translationsView"
    */ './translations/TranslationsView'));

    return (
        <Switch>
            <RepositoryProvider id={match.params[PARAMS.REPOSITORY_ID]}>
                <Route path={LINKS.REPOSITORY_TRANSLATIONS.template}>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <TranslationsView/>
                    </React.Suspense>
                </Route>
                <Route exact path={LINKS.REPOSITORY_EDIT.template}>
                    <RepositorySettingsView/>
                </Route>

                <Route exact path={`${LINKS.REPOSITORY_LANGUAGES.template}`}>
                    <LanguageListView/>
                </Route>

                <Route exact path={`${LINKS.REPOSITORY_LANGUAGES_CREATE.template}`}>
                    <LanguageCreateView/>
                </Route>

                <Route exact path={`${LINKS.REPOSITORY_LANGUAGE_EDIT.template}`}>
                    <LanguageEditView/>
                </Route>

                <Route exact path={`${LINKS.REPOSITORY_INVITATION.template}`}>
                    <RepositoryInviteView/>
                </Route>

                <Route exact path={`${LINKS.REPOSITORY_PERMISSIONS.template}`}>
                    <RepositoryPermissionsView/>
                </Route>
            </RepositoryProvider>
        </Switch>
    );
};
