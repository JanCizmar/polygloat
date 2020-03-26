import * as React from 'react';
import {useEffect} from 'react';
import {GlobalActions} from '../store/global/globalActions';
import SnackBar from './common/SnackBar';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {container} from 'tsyringe';
import {useSelector} from 'react-redux';
import {AppState} from '../store';
import {LINKS} from '../constants/links';
import {PrivateRoute} from './common/PrivateRoute';
import {ErrorActions} from '../store/global/errorActions';
import {RedirectionActions} from '../store/global/redirectionActions';
import {RemoteConfigurationDTO} from "../service/response.types";
import {useConfig} from "../hooks/useConfig";
import {useUser} from "../hooks/useUser";
import FullPageLoadingView from "./common/FullPageLoadingView";
import {ApiKeysView} from "./security/apiKeys/ApiKeysView";

const LoginRouter = React.lazy(() => import(/* webpackChunkName: "login-router" */'./security/LoginRouter'));
const SignUpView = React.lazy(() => import(/* webpackChunkName: "login-router" */'./security/SignUpView'));

const PasswordResetSetView = React.lazy(() => import(/* webpackChunkName: "reset-password-set-view" */'./security/ResetPasswordSetView'));
const PasswordResetView = React.lazy(() => import(/* webpackChunkName: "reset-password-view" */'./security/ResetPasswordView'));
const ConfirmationDialog = React.lazy(() => import(/* webpackChunkName: "confirmation-dialog" */'./common/ConfirmationDialog'));
const RepositoriesRouter = React.lazy(() => import(/* webpackChunkName: "repositories" */'./views/repositories/RepositoriesRouter'));
const AcceptInvitationHandler = React.lazy(() => import(/* webpackChunkName: "accept-invitation-handler" */'./security/AcceptInvitationHandler'));

interface Props {
    remoteConfig: RemoteConfigurationDTO
}

const errorActions = container.resolve(ErrorActions);
const redirectionActions = container.resolve(RedirectionActions);

const Redirection = () => {
    let redirectionState = useSelector((state: AppState) => state.redirection);

    useEffect(() => {
        if (redirectionState.to) {
            redirectionActions.redirectDone.dispatch();
        }
    });

    if (redirectionState.to) {
        return <Redirect to={redirectionState.to}/>;
    }

    return null;
};

const MandatoryDataProvider = (props) => {
    let config = useConfig();
    let userData = useUser();

    let allowPrivate = useSelector((state: AppState) => state.global.security.allowPrivate);

    if (!config || (!userData && allowPrivate) && config.authentication) {
        return <FullPageLoadingView/>
    } else {
        return props.children;
    }
};

const GlobalConfirmation = () => {
    let state = useSelector((state: AppState) => state.global.confirmationDialog);

    let actions = container.resolve(GlobalActions);

    const onCancel = () => {
        actions.closeConfirmation.dispatch();
    };

    const onConfirm = () => {
        actions.closeConfirmation.dispatch();
        state.onConfirm();
    };


    return (<ConfirmationDialog open={!!state} {...state} onCancel={onCancel} onConfirm={onConfirm}/>);
};

export default class App extends React.Component {
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        errorActions.globalError.dispatch(error);
        throw error;
    }

    render() {
        return (
            <BrowserRouter>
                <Redirection/>
                <MandatoryDataProvider>
                    <Switch>
                        <Route exact path={LINKS.RESET_PASSWORD_REQUEST.template}>
                            <PasswordResetView/>
                        </Route>
                        <Route exact path={LINKS.RESET_PASSWORD_WITH_PARAMS.template}>
                            <PasswordResetSetView/>
                        </Route>
                        <Route exact path={LINKS.SIGN_UP.template}>
                            <SignUpView/>
                        </Route>
                        <Route path={LINKS.LOGIN.template}>
                            <LoginRouter/>
                        </Route>
                        <Route path={LINKS.ACCEPT_INVITATION.template}>
                            <AcceptInvitationHandler/>
                        </Route>
                        <PrivateRoute exact path="/">
                            <Redirect to={LINKS.REPOSITORIES.template}/>
                        </PrivateRoute>
                        <PrivateRoute path={LINKS.REPOSITORIES.template}>
                            <RepositoriesRouter/>
                        </PrivateRoute>
                        <PrivateRoute path={`${LINKS.USER_API_KEYS.template}`}>
                            <ApiKeysView/>
                        </PrivateRoute>
                    </Switch>
                    <SnackBar/>
                    <GlobalConfirmation/>
                </MandatoryDataProvider>
            </BrowserRouter>
        );
    }
};