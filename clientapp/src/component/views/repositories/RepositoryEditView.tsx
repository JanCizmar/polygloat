import * as React from 'react';
import {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../../store';
import {container} from 'tsyringe';
import {RepositoryActions} from '../../../store/repository/RepositoryActions';
import {RepositoryResponse} from '../../../service/response.types';
import {LINKS} from '../../../constants/links';
import {Redirect, useRouteMatch} from 'react-router-dom';
import * as Yup from 'yup';
import {TextField} from '../../common/form/fields/TextField';
import {RepositoryPage} from './RepositoryPage';
import {BaseFormView} from '../BaseFormView';

const actions = container.resolve(RepositoryActions);

interface Props {
    repositories: RepositoryResponse[];
    loading: boolean;
    saving: boolean,
    saved: boolean
}

export const RepositoryEditView = connect((state: AppState) =>
    ({
        repositories: state.repositories.repositories,
        loading: state.repositories.repositoriesLoading,
        saving: state.repositories.repositorySaving,
        saved: state.repositories.repositorySaved,
    }))(
    ({repositories, loading, saving, saved}: Props) => {

        let match = useRouteMatch();

        const id = match.params['repositoryId'];

        const repository = repositories !== undefined ? repositories.find(r => r.id === parseInt(id)) : null;


        const [cancelled, setCancelled] = useState(false);

        useEffect(() => {
            if (repositories === undefined) {
                actions.loadRepositories.dispatch();
            }
        }, [repositories]);

        const onSubmit = (values) => {
            actions.editRepository.dispatch(id, values);
        };

        if (saved || cancelled) {
            actions.resetEdit.dispatch();
            return <Redirect to={LINKS.REPOSITORIES.build()}/>;
        }

        return (
            <RepositoryPage id={id}>
                <BaseFormView title={'Edit repository'} initialValues={{name: !loading && repository.name}} onSubmit={onSubmit}
                              onCancel={() => setCancelled(true)}
                              saving={saving}
                              loading={loading}
                              validationSchema={Yup.object().shape(
                                  {
                                      name: Yup.string().required().min(3).max(100)
                                  })}
                >
                    <TextField label="Name" name="name" required={true}/>
                </BaseFormView>
            </RepositoryPage>
        );
    });
