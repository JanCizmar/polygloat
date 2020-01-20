import {default as React, FunctionComponent} from 'react';
import MUITextField, {TextFieldProps} from '@material-ui/core/TextField';
import {useField} from 'formik';

interface PGTextFieldProps {
    name: string;
}

type Props = PGTextFieldProps & TextFieldProps

export const TextField: FunctionComponent<Props> = (props) => {
    const [field, meta, helpers] = useField(props.name);
    return <MUITextField {...field} {...props} helperText={meta.error} error={!!meta.error}/>;
};
