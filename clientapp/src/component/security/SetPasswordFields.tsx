import {default as React, FunctionComponent} from 'react';
import {TextField} from '../common/form/fields/TextField';
import * as Yup from 'yup';

interface SetPasswordFieldsProps {

}

export const setPasswordValidationSchema = {
    password: Yup.string().min(8).max(100).required(),
    passwordRepeat: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required()
};

export const SetPasswordFields: FunctionComponent<SetPasswordFieldsProps> = (props) => {
    return (
        <>
            <TextField name="password" type="password" label="Password"/>
            <TextField name="passwordRepeat" type="password" label="Password confirmation"/>
        </>
    );
};
