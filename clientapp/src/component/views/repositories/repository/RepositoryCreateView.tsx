import * as React from 'react';
import {FunctionComponent, useState} from 'react';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../store';
import {container} from 'tsyringe';
import {RepositoryActions} from '../../../../store/repository/RepositoryActions';
import {LanguageDTO} from '../../../../service/response.types';
import {LINKS} from '../../../../constants/links';
import {Redirect} from 'react-router-dom';
import * as Yup from 'yup';
import {TextField} from '../../../common/form/fields/TextField';
import {BaseFormView} from '../../BaseFormView';
import {DashboardPage} from '../../../layout/DashboardPage';
import {FieldArray} from "../../../common/form/fields/FieldArray";

const actions = container.resolve(RepositoryActions);


type ValueType = {
    name: string,
    languages: Partial<LanguageDTO>[];
}

export const RepositoryCreateView: FunctionComponent = () => {

    const loadable = useSelector((state: AppState) => state.repositories.loadables.createRepository);

    const onSubmit = (values) => {
        actions.loadableActions.createRepository.dispatch(values);
    };

    const initialValues: ValueType = {name: '', languages: [{abbreviation: "", name: ""}]};

    const [cancelled, setCancelled] = useState(false);

    if (cancelled) {
        return <Redirect to={LINKS.REPOSITORIES.build()}/>
    }

    return (
        <DashboardPage>
            <BaseFormView lg={6} md={8} title={"Create repository"} initialValues={initialValues} onSubmit={onSubmit}
                          onCancel={() => setCancelled(true)}
                          saveActionLoadable={loadable}
                          validationSchema={Yup.object().shape(
                              {
                                  name: Yup.string().required().min(3).max(100),
                                  languages: Yup.array().required().of(Yup.object().shape({
                                      name: Yup.string().label("name").required("This field is required").min(2).max(50),
                                      abbreviation: Yup.string().label("name").required("This field is required").min(2).max(10)
                                  }))
                              })}
            >
                <>
                    <TextField label="Name" name="name" required={true}/>

                    <FieldArray name="languages">
                        {(n) => (
                            <>
                                <TextField fullWidth={false} label="Language name" name={n('name')} required={true}/>
                                <TextField fullWidth={false} label='Abbreviation' name={n('abbreviation')} required={true}/>
                            </>
                        )}
                    </FieldArray>
                </>
            </BaseFormView>
        </DashboardPage>
    );
};