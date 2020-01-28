import * as React from 'react';
import {useEffect} from 'react';
import {GlobalActions} from '../store/global/globalActions';
import SnackBar from './common/SnackBar';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {RepositoriesRouter} from './views/repositories/RepositoriesRouter';
import {container} from 'tsyringe';
import {connect, useSelector} from 'react-redux';
import {AppState} from '../store';
import {FullPageLoading} from './common/FullPageLoading';
import {LINKS} from '../constants/links';
import {PrivateRoute} from './common/PrivateRoute';
import {LoginRouter} from './security/LoginRouter';
import {ErrorActions} from '../store/global/errorActions';
import {RedirectionActions} from '../store/global/redirectionActions';
import {PasswordResetView} from './security/ResetPasswordView';
import {PasswordResetSetView} from './security/ResetPasswordSetView';
import {SignUpView} from './security/SignUpView';
import {AcceptInvitationHandler} from './security/AcceptInvitationHandler';
import ConfirmationDialog from './common/ConfirmationDialog';

interface Props {
    authentication: boolean,
    configLoading: boolean
}

const globalActions = container.resolve(GlobalActions);
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


    return (<ConfirmationDialog open={state.open} title={state.title} message={state.content} onCancel={onCancel} onConfirm={onConfirm}/>);
};

export class AppImp extends React.Component<Props, null> {
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        errorActions.globalError.dispatch(error);
        throw error;
    }

    componentDidMount(): void {
        globalActions.loadRemoteConfig.dispatch();
    }

    render() {

        if (this.props.configLoading) {
            return <FullPageLoading/>;
        }

        return (
            <BrowserRouter>
                <Redirection/>
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
                    <PrivateRoute exact path="/">
                        <Redirect to={LINKS.REPOSITORIES.template}/>
                    </PrivateRoute>
                    <PrivateRoute path={LINKS.REPOSITORIES.template}>
                        <RepositoriesRouter/>
                    </PrivateRoute>
                    <PrivateRoute path={LINKS.ACCEPT_INVITATION.template}>
                        <AcceptInvitationHandler/>
                    </PrivateRoute>
                </Switch>
                <SnackBar/>
                <GlobalConfirmation/>
            </BrowserRouter>
        );
    }
};

export const App = connect((state: AppState) => (
    {
        authentication: state.global.remoteConfig && state.global.remoteConfig.authentication,
        configLoading: state.global.remoteConfigLoading
    }))(AppImp);
