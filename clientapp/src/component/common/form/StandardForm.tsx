import {default as React, FunctionComponent, ReactNode} from 'react';
import {Form, Formik, FormikBag, FormikProps} from 'formik';
import {Box, Button} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import {ObjectSchema} from 'yup';
import {useHistory} from 'react-router-dom';

interface FormProps<T = { [key: string]: any }> {
    initialValues: T;
    onSubmit: (values: T, formikBag: FormikBag<any, any>) => void | Promise<any>;
    onCancel?: () => void;
    loading?: boolean;
    validationSchema?: ObjectSchema;
    submitButtons?: ReactNode
    customActions?: ReactNode
    submitButtonInner?: ReactNode
}

export const StandardForm: FunctionComponent<FormProps> = ({initialValues, validationSchema, ...props}) => {

    let history = useHistory();

    const onCancel = () => typeof props.onCancel === "function" ? props.onCancel() : history.goBack();

    return (
        <Formik initialValues={initialValues} onSubmit={props.onSubmit} validationSchema={validationSchema} enableReinitialize>
            {(formikProps: FormikProps<any>) => (
                <Form>
                    {typeof props.children === "function" && (!props.loading && props.children(formikProps)) || props.children}
                    {props.loading && <CircularProgress size="small"/>}
                    {(props.submitButtons || (
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <React.Fragment>
                                {props.customActions && <Box flexGrow={1}>{props.customActions}</Box>}
                                <Box>
                                    <Button color="primary" disabled={props.loading || !formikProps.isValid} type="submit">
                                        {props.submitButtonInner || "Save"}
                                    </Button>
                                    <Button disabled={props.loading}
                                            onClick={onCancel}>Cancel</Button>
                                </Box>
                            </React.Fragment>
                        </Box>))}
                </Form>
            )}
        </Formik>
    );
};
