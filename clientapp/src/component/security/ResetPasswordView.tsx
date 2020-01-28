import {default as React, FunctionComponent} from 'react';
import {DashboardPage} from '../layout/DashboardPage';
import {BaseView} from '../views/BaseView';
import {Button} from '@material-ui/core';
import {useSelector} from 'react-redux';
import {AppState} from '../../store';
import {LINKS} from '../../constants/links';
import {Redirect} from 'react-router-dom';
import {StandardForm} from '../common/form/StandardForm';
import {TextField} from '../common/form/fields/TextField';
import Box from '@material-ui/core/Box';
import {container} from 'tsyringe';
import {GlobalActions} from '../../store/global/globalActions';
import {Alert} from '../common/Alert';
import * as Yup from 'yup';


interface LoginProps {

}

const globalActions = container.resolve(GlobalActions);

type ValueType = {
    email: string;
}

export const PasswordResetView: FunctionComponent<LoginProps> = (props) => {

    const security = useSelector((state: AppState) => state.global.security);
    const remoteConfig = useSelector((state: AppState) => state.global.remoteConfig);

    const loading = useSelector((state: AppState) => state.global.passwordResetLoading);
    const error = useSelector((state: AppState) => state.global.passwordResetError);
    const sent = useSelector((state: AppState) => state.global.passwordResetSent);

    console.log(sent);

    if (!remoteConfig.authentication || security.allowPrivate || !remoteConfig.passwordResettable) {
        return (<Redirect to={LINKS.AFTER_LOGIN.build()}/>);
    }

    return (
        <DashboardPage>
            <BaseView title="Reset password" lg={6} md={8} xs={12} loading={loading}>
                {error || sent &&
                <Box mt={1}>
                    {sent && <Alert severity="success">Request successfully sent</Alert>
                    ||
                    error &&
                    <Alert severity="error">{error}</Alert>}
                </Box>}

                {!sent &&
                <StandardForm initialValues={{email: ''} as ValueType}
                              validationSchema={Yup.object().shape({
                                  email: Yup.string().email().required()
                              })}
                              submitButtons={
                                  <>
                                      <Box display="flex">
                                          <Box flexGrow={1}>
                                          </Box>
                                          <Box display="flex" flexGrow={0}>
                                              <Button color="primary" type="submit">Send request</Button>
                                          </Box>
                                      </Box>
                                  </>}
                              onSubmit={(v: ValueType) => {
                                  globalActions.resetPasswordRequest.dispatch(v.email);
                              }}>
                    <TextField name="email" label="E-mail"/>
                </StandardForm>}
            </BaseView>
        </DashboardPage>
    );
};
