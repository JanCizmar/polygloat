import {default as React, FunctionComponent} from 'react';
import {DashboardPage} from '../layout/DashboardPage';
import {BaseView} from '../views/BaseView';
import {Button} from '@material-ui/core';
import {useSelector} from 'react-redux';
import {AppState} from '../../store';
import {LINKS} from '../../constants/links';
import {Redirect} from 'react-router-dom';
import {StandardForm} from '../common/form/StandardForm';
import Box from '@material-ui/core/Box';
import {container} from 'tsyringe';
import {Alert} from '../common/Alert';
import * as Yup from 'yup';
import {SetPasswordFields, setPasswordValidationSchema} from './SetPasswordFields';
import {SignUpActions} from '../../store/global/signUpActions';
import {TextField} from '../common/form/fields/TextField';
import {signUpService} from '../../service/signUpService';
import {useConfig} from "../../hooks/useConfig";

const actions = container.resolve(SignUpActions);
const service = container.resolve(signUpService);

export type SignUpType = {
    name: string,
    email: string,
    password: string;
    passwordRepeat: string
}

let timer = null;

const validationSchema = Yup.object().shape({
    ...setPasswordValidationSchema,
    name: Yup.string().required(),
    email: Yup.string().email().required()
        .test('checkEmailUnique', 'User with this e-mail already exists.', v => {
            clearTimeout(timer);
            return new Promise((resolve) => {
                timer = setTimeout(
                    () => v && Yup.string().email().validateSync(v) && resolve(service.validateEmail(v)),
                    500,
                );
            });
        })
});

const SignUpView: FunctionComponent = () => {
    const security = useSelector((state: AppState) => state.global.security);
    const state = useSelector((state: AppState) => state.signUp);

    const remoteConfig = useConfig();

    if (!remoteConfig.authentication || security.allowPrivate || !remoteConfig.allowRegistrations) {
        return (<Redirect to={LINKS.AFTER_LOGIN.build()}/>);
    }

    return (
        <DashboardPage>
            <BaseView title="Sign up" lg={6} md={8} xs={12} loading={state.signUpLoading}>
                {state.signUpError &&
                <Box mt={1}>
                    <Alert severity="error">{state.signUpError}</Alert>
                </Box>
                }
                <StandardForm initialValues={{password: '', passwordRepeat: '', name: '', email: ''} as SignUpType}
                              validationSchema={validationSchema}
                              submitButtons={
                                  <>
                                      <Box display="flex">
                                          <Box flexGrow={1}>
                                          </Box>
                                          <Box display="flex" flexGrow={0}>
                                              <Button color="primary" type="submit">SignUp</Button>
                                          </Box>
                                      </Box>
                                  </>}
                              onSubmit={(v: SignUpType) => {
                                  actions.signUpSubmit.dispatch(v);
                              }}>
                    <TextField name="name" label="Full name"/>
                    <TextField name="email" label="E-mail"/>
                    <SetPasswordFields/>
                </StandardForm>
            </BaseView>
        </DashboardPage>
    );
};

export default SignUpView;
