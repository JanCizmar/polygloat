import {default as React, FunctionComponent} from 'react';
import {DashboardPage} from '../layout/DashboardPage';
import {Button} from '@material-ui/core';
import {useSelector} from 'react-redux';
import {AppState} from '../../store';
import {LINKS} from '../../constants/links';
import {Redirect} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import {container} from 'tsyringe';
import {SetPasswordFields} from './SetPasswordFields';
import {SignUpActions} from '../../store/global/signUpActions';
import {TextField} from '../common/form/fields/TextField';
import {useConfig} from "../../hooks/useConfig";
import {Validation} from "../../constants/GlobalValidationSchema";
import {BaseFormView} from "../views/BaseFormView";

const actions = container.resolve(SignUpActions);

export type SignUpType = {
    name: string,
    email: string,
    password: string;
    passwordRepeat: string;
    invitationCode?: string;
}

const SignUpView: FunctionComponent = () => {
    const security = useSelector((state: AppState) => state.global.security);
    const state = useSelector((state: AppState) => state.signUp.loadables.signUp);

    const remoteConfig = useConfig();

    if (!remoteConfig.authentication || security.allowPrivate || !security.allowRegistration) {
        return (<Redirect to={LINKS.AFTER_LOGIN.build()}/>);
    }

    return (
        <DashboardPage>
            <BaseFormView title="Sign up" lg={6} md={8} xs={12} saveActionLoadable={state}
                          initialValues={{password: '', passwordRepeat: '', name: '', email: ''} as SignUpType}
                          validationSchema={Validation.SIGN_UP}
                          submitButtons={
                              <Box display="flex" justifyContent="flex-end">
                                  <Button color="primary" type="submit">SignUp</Button>
                              </Box>
                          }
                          onSubmit={(v: SignUpType) => {
                              actions.loadableActions.signUp.dispatch(v);
                          }}>
                <TextField name="name" label="Full name"/>
                <TextField name="email" label="E-mail"/>
                <SetPasswordFields/>
            </BaseFormView>
        </DashboardPage>
    );
};

export default SignUpView;
