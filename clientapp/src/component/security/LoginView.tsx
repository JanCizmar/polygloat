import {default as React, FunctionComponent} from 'react';
import {DashboardPage} from '../layout/DashboardPage';
import {BaseView} from '../views/BaseView';
import GitHubIcon from '@material-ui/icons/GitHub';
import {Button} from '@material-ui/core';
import {useSelector} from 'react-redux';
import {AppState} from '../../store';
import {LINKS, PARAMS} from '../../constants/links';
import {Link, Redirect, useHistory} from 'react-router-dom';
import {StandardForm} from '../common/form/StandardForm';
import {TextField} from '../common/form/fields/TextField';
import Box from '@material-ui/core/Box';
import {container} from 'tsyringe';
import {GlobalActions} from '../../store/global/globalActions';
import {Alert} from '../common/Alert';
import {securityService} from '../../service/securityService';
import {useConfig} from "../../hooks/useConfig";

interface LoginProps {

}

const globalActions = container.resolve(GlobalActions);
const securityServiceIns = container.resolve(securityService);

export const LoginView: FunctionComponent<LoginProps> = (props) => {

    const security = useSelector((state: AppState) => state.global.security);
    const remoteConfig = useConfig();

    if (!remoteConfig.authentication || security.allowPrivate) {
        return (<Redirect to={LINKS.AFTER_LOGIN.build()}/>);
    }

    const githubBase = 'https://github.com/login/oauth/authorize';
    const githubRedirectUri = LINKS.OAUTH_RESPONSE.buildWithOrigin({[PARAMS.SERVICE_TYPE]: 'github'});
    const clientId = remoteConfig.authMethods.github.clientId;
    const gitHubUrl = githubBase + `?client_id=${clientId}&redirect_uri=${githubRedirectUri}&scope=user%3Aemail`;

    const history = useHistory();
    if (history.location.state && history.location.state.from) {
        securityServiceIns.saveAfterLoginLink(history.location.state.from);
    }

    return (
        <DashboardPage>
            <BaseView title="Login" lg={6} md={8} xs={12}>
                {security.loginErrorCode &&
                <Box mt={1}>
                    <Alert severity="error">{security.loginErrorCode}</Alert>
                </Box>
                }
                <StandardForm initialValues={{username: '', password: ''}}
                              submitButtons={
                                  <>
                                      <Box display="flex" justifyContent="space-between">
                                          {security.allowRegistration &&
                                          <Button size="large" component={Link} to={LINKS.SIGN_UP.build()}>
                                              Sign up
                                          </Button>
                                          }
                                          {remoteConfig.passwordResettable &&
                                          <Button component={Link} to={LINKS.RESET_PASSWORD_REQUEST.build()}>Reset password</Button>
                                          }
                                      </Box>
                                      <Box display="flex">
                                          <Box flexGrow={1}>
                                              {remoteConfig.authMethods.github !== null && remoteConfig.authMethods.github.enabled &&
                                              (
                                                  <Button component="a" href={gitHubUrl} size="large" endIcon={<GitHubIcon/>}>
                                                      Github login
                                                  </Button>
                                              )}
                                          </Box>
                                          <Box display="flex" flexGrow={0}>
                                              <Button color="primary" type="submit">Login</Button>
                                          </Box>
                                      </Box>
                                  </>}
                              onSubmit={(v) => {
                                  globalActions.login.dispatch(v);
                              }}>
                    <TextField name="username" label="Username"/>
                    <TextField name="password" type="password" label="Password"/>
                </StandardForm>


            </BaseView>
        </DashboardPage>
    );
};
