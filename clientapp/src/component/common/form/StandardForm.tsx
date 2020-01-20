import {default as React, FunctionComponent} from 'react';
import {Form, Formik, FormikBag, FormikProps} from 'formik';
import {Box, Button} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import {ObjectSchema} from 'yup';

interface FormProps {
    initialValues: object;
    onSubmit: (values: {}, formikBag: FormikBag<any, any>) => void | Promise<any>;
    onCancel: () => void;
    saving?: boolean;
    validationSchema: ObjectSchema;
}

export const StandardForm: FunctionComponent<FormProps> = ({initialValues, validationSchema, ...props}) => {
    return (
        <Formik initialValues={initialValues} onSubmit={props.onSubmit} validationSchema={validationSchema}>
            {(formikProps: FormikProps<any>) => (
                <Form>
                    {props.children}
                    <Box mt={4}>
                        {props.saving && <CircularProgress/>}
                        <Button color="primary" disabled={props.saving} type="submit">Save</Button>
                        <Button disabled={props.saving || Object.values(formikProps.errors).length > 0}
                                onClick={props.onCancel}>Cancel</Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};
