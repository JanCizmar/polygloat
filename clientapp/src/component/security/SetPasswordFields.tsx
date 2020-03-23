import {default as React, FunctionComponent} from 'react';
import {TextField} from '../common/form/fields/TextField';
import * as Yup from 'yup';

interface SetPasswordFieldsProps {

}

export const SetPasswordFields: FunctionComponent<SetPasswordFieldsProps> = (props) => {
    return (
        <>
            <TextField name="password" type="password" label="Password"/>
            <TextField name="passwordRepeat" type="password" label="Password confirmation"/>
        </>
    );
};
