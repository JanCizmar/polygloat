import {default as React, FunctionComponent} from 'react';
import {BaseView, BaseViewProps} from './BaseView';
import {StandardForm} from '../common/form/StandardForm';
import {ObjectSchema} from 'yup';

interface BaseFormViewProps {
    onInit?: () => {};
    saving: boolean;
    initialValues: object;
    onSubmit: (v: object) => void,
    onCancel: () => void,
    validationSchema: ObjectSchema;
}

export const BaseFormView: FunctionComponent<BaseFormViewProps & BaseViewProps> = (props) => {

    return (
        <BaseView {...props}>
            <StandardForm initialValues={props.initialValues} onSubmit={props.onSubmit}
                          onCancel={props.onCancel}
                          loading={props.saving}
                          validationSchema={props.validationSchema}>
                {props.children}
            </StandardForm>
        </BaseView>
    );
};
