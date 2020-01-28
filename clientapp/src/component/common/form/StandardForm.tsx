import {default as React, FunctionComponent, ReactNode} from 'react';
import {Form, Formik, FormikBag, FormikProps} from 'formik';
import {Box, Button} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import {ObjectSchema} from 'yup';

interface FormProps<T = { [key: string]: any }> {
    initialValues: T;
    onSubmit: (values: T, formikBag: FormikBag<any, any>) => void | Promise<any>;
    onCancel?: () => void;
    loading?: boolean;
    validationSchema?: ObjectSchema;
    submitButtons?: ReactNode
}

export const StandardForm: FunctionComponent<FormProps> = ({initialValues, validationSchema, ...props}) => {
    return (
        <Formik initialValues={initialValues} onSubmit={props.onSubmit} validationSchema={validationSchema}>
            {(formikProps: FormikProps<any>) => (
                <Form>
                    {props.children}
                    {props.loading && <CircularProgress/>}
                    {!props.loading && (props.submitButtons || (
                        <Box mt={2} display="flex" justifyContent="flex-end" flexDirection="row">

                            <>
                                <Button color="primary" disabled={props.loading} type="submit">Save</Button>
                                <Button disabled={props.loading || Object.values(formikProps.errors).length > 0}
                                        onClick={props.onCancel}>Cancel</Button>
                            </>
                        </Box>))}
                </Form>
            )}
        </Formik>
    );
};
