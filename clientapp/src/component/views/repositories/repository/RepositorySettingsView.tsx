import * as React from 'react';
import {FunctionComponent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../store';
import {container} from 'tsyringe';
import {RepositoryActions} from '../../../../store/repository/RepositoryActions';
import {LINKS} from '../../../../constants/links';
import {Redirect} from 'react-router-dom';
import * as Yup from 'yup';
import {TextField} from '../../../common/form/fields/TextField';
import {BaseFormView} from '../../BaseFormView';
import {useRepository} from "../../../../hooks/useRepository";
import {RepositoryPage} from "../RepositoryPage";
import {Button} from "@material-ui/core";
import {useConfirmation} from "../../../../hooks/useConfirmation";

const actions = container.resolve(RepositoryActions);

type ValueType = {
    name: string,
}

export const RepositorySettingsView: FunctionComponent = () => {

    const loadable = useSelector((state: AppState) => state.repositories.loadables.editRepository);
    const saveLoadable = useSelector((state: AppState) => state.repositories.loadables.editRepository);
    const deleteLoadable = useSelector((state: AppState) => state.repositories.loadables.deleteRepository);

    let repository = useRepository();

    let confirmation = useConfirmation({title: "Delete repository"});

    const onSubmit = (values) => {
        actions.loadableActions.editRepository.dispatch(repository.id, values);
    };

    useEffect(() => {
        if (saveLoadable.loaded) {
            actions.loadableReset.repository.dispatch();
        }
        return () => actions.loadableReset.editRepository.dispatch();
    }, [saveLoadable.loaded]);


    useEffect(() => {
        return () => {
            actions.loadableReset.deleteRepository.dispatch();
        }
    }, []);

    const initialValues: ValueType = {name: repository.name};

    const [cancelled, setCancelled] = useState(false);

    if (cancelled) {
        return <Redirect to={LINKS.REPOSITORIES.build()}/>
    }

    return (
        <RepositoryPage>
            <BaseFormView lg={6} md={8} title={"Repository settings"} initialValues={initialValues} onSubmit={onSubmit}
                          onCancel={() => setCancelled(true)}
                          saveActionLoadable={loadable}
                          validationSchema={Yup.object().shape(
                              {
                                  name: Yup.string().required().min(3).max(100)
                              })}
                          customActions={
                              <Button color="secondary" variant="outlined" onClick={() => {
                                  confirmation({
                                      message: "Are you sure you want to delete repository: " + repository.name + "?",
                                      onConfirm: () => actions.loadableActions.deleteRepository.dispatch(repository.id),
                                      hardModeText: repository.name.toUpperCase()
                                  })
                              }}>Delete repository</Button>
                          }
            >
                <TextField label="Name" name="name" required={true}/>
            </BaseFormView>
        </RepositoryPage>
    );
};