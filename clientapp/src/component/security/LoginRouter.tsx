import {default as React, FunctionComponent} from 'react';
import {Route, Switch} from 'react-router-dom';
import {LINKS} from '../../constants/links';
import {LoginView} from './LoginView';
import {OAuthRedirectionHandler} from './OAuthRedirectionHandler';

interface LoginRouterProps {

}

export const LoginRouter: FunctionComponent<LoginRouterProps> = (props) => {
    return (
        <Switch>
            <Route exact path={LINKS.LOGIN.template}>
                <LoginView/>
            </Route>
            <Route path={LINKS.OAUTH_RESPONSE.template}>
                <OAuthRedirectionHandler/>
            </Route>
        </Switch>
    );
};
