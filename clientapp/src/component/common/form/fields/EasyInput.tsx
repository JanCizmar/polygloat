import {default as React, FunctionComponent} from 'react';
import {Input, InputProps} from '@material-ui/core';
import {useField} from 'formik';

interface EasyInputProps {
    name: string;
}

type Props = EasyInputProps & InputProps


export const EasyInput: FunctionComponent<Props> = (props) => {

    const [field, meta, helpers] = useField(props.name);
    return <Input fullWidth={props.fullWidth ? props.fullWidth : true} {...field} {...props} error={!!meta.error}/>;
};
