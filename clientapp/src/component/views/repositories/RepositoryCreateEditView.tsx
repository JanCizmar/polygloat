import * as React from 'react';
import {FunctionComponent, ReactElement, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../../store';
import {container} from 'tsyringe';
import {RepositoryActions} from '../../../store/repository/RepositoryActions';
import {RepositoryDTO} from '../../../service/response.types';
import {LINKS} from '../../../constants/links';
import {Redirect, useRouteMatch} from 'react-router-dom';
import * as Yup from 'yup';
import {TextField} from '../../common/form/fields/TextField';
import {RepositoryPage} from './RepositoryPage';
import {BaseFormView} from '../BaseFormView';
import {DashboardPage} from '../../layout/DashboardPage';
import {FieldArray, useField} from 'formik';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {Box} from '@material-ui/core';

const actions = container.resolve(RepositoryActions);

export enum Action {
    CREATE, EDIT
}

interface Props {
    repositories: RepositoryDTO[];
    loading: boolean;
    saving: boolean,
    saved: boolean,
}

export const RepositoryCreateEditView = connect((state: AppState) =>
    ({
        repositories: state.repositories.repositories,
        loading: state.repositories.repositoriesLoading,
        saving: state.repositories.repositorySaving,
        saved: state.repositories.repositorySaved,
    }))(
    ({repositories, loading, saving, saved}: Props) => {

        let match = useRouteMatch();

        const isEdit = match.path === LINKS.REPOSITORY_EDIT.template;
        let id: number;
        let onSubmit;
        let repository;
        let title: string;
        let initialValues: Partial<RepositoryDTO>;

        if (!loading) {
            if (isEdit) {
                title = 'Repository settings';
                id = parseInt(match.params['repositoryId']);
                onSubmit = (values) => {
                    actions.editRepository.dispatch(id, values);
                };
                repository = repositories !== undefined ? repositories.find(r => r.id === id) : null;
                initialValues = {...repository};
            } else {
                title = 'Create repository';
                onSubmit = (values) => {
                    actions.createRepository.dispatch(values);
                };
                initialValues = {name: ''};
            }
        }

        const [cancelled, setCancelled] = useState(false);

        useEffect(() => {
            if (repositories === undefined) {
                actions.loadRepositories.dispatch();
            }
        }, [repositories]);


        if (saved || cancelled) {
            actions.resetEdit.dispatch();
            return <Redirect to={LINKS.REPOSITORIES.build()}/>;
        }

        return (
            <Page id={id}>
                <BaseFormView title={title} initialValues={initialValues} onSubmit={onSubmit}
                              onCancel={() => setCancelled(true)}
                              saving={saving}
                              loading={loading}
                              validationSchema={Yup.object().shape(
                                  {
                                      name: Yup.string().required().min(3).max(100)
                                  })}
                >
                    <>
                        <TextField label="Name" name="name" required={true}/>

                        <FA name="languages">
                            {(n) => (
                                <>
                                    <TextField fullWidth={false} label="Language name" name={n('name')} required={true}/>
                                    <TextField fullWidth={false} label='Abbreviation' name={n('abbreviation')} required={true}/>
                                </>
                            )}
                        </FA>
                    </>
                </BaseFormView>
            </Page>
        );
    });

const Page: FunctionComponent<{ id: number }> = props =>
    props.id ? <RepositoryPage id={props.id}>{props.children}</RepositoryPage> : <DashboardPage>{props.children}</DashboardPage>;

interface FAProps {
    name: string,
    children: (nameCallback: (fieldName: string) => string) => ReactElement;
}

const FA: FunctionComponent<FAProps> = (props) => {
    const [field, meta, helpers] = useField(props.name);
    const values = field.value;
    return (
        <FieldArray
            name={props.name}
            render={arrayHelpers => (
                <div>
                    {values && values.length > 0 ? (
                        values.map((value, index) => (
                            <Box key={index} display="flex">
                                <Box flexGrow={1}>
                                    {props.children((name) => `${props.name}.${index}.${name}`)}
                                </Box>
                                <Box>
                                    <IconButton
                                        type="button"
                                        onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                    >
                                        <RemoveIcon/>
                                    </IconButton>
                                    <IconButton
                                        type="button"
                                        onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                                    >
                                        <AddIcon/>

                                    </IconButton>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <button type="button" onClick={() => arrayHelpers.push('')}>
                            {/* show this when user has removed all friends from the list */}
                            Add a friend
                        </button>
                    )}
                </div>
            )}
        />);
};
