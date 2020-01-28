import {default as React, FunctionComponent, ReactNode} from 'react';
import MUISelect from '@material-ui/core/Select';
import {useField} from 'formik';
import {createStyles, FormControlProps, makeStyles, Theme} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

interface PGSelectProps {
    name: string;
    label?: string;
    renderValue?: (v: any) => ReactNode;
}

type Props = PGSelectProps & FormControlProps

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        select: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            minWidth: 120
        },
    }),
);


export const Select: FunctionComponent<Props> = (props) => {
    const classes = useStyles({});

    const [field, meta, helpers] = useField(props.name);


    return (
        <FormControl className={classes.select} error={!!meta.error} {...props} >
            {props.label && <InputLabel id={'select_' + field.name + '_label'}>{props.label}</InputLabel>}
            <MUISelect
                name={field.name}
                labelId={'select_' + field.name + '_label'}
                value={field.value}
                onChange={e => helpers.setValue(e.target.value)}
                renderValue={typeof props.renderValue === 'function' ? props.renderValue : value => value}
            >
                {props.children}
            </MUISelect>
            {meta.error &&
            <FormHelperText>{meta.error}</FormHelperText>}
        </FormControl>
    );
};
