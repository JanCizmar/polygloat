import {default as React, FunctionComponent} from 'react';
import {Form, Formik, FormikBag, FormikProps} from 'formik';
import {ObjectSchema} from 'yup';

interface MicroFormProps<T = { [key: string]: any }> {
    initialValues: T;
    onSubmit: (values: T, formikBag: FormikBag<any, any>) => void | Promise<any>;
    validationSchema?: ObjectSchema;
}

export const MicroForm: FunctionComponent<MicroFormProps> = ({initialValues, validationSchema, ...props}) => {
    return (
        <Formik initialValues={initialValues} onSubmit={props.onSubmit} validationSchema={validationSchema}>
            {(formikProps: FormikProps<any>) => (
                <Form {...formikProps}>
                    {props.children}
                </Form>
            )}
        </Formik>
    );
};
