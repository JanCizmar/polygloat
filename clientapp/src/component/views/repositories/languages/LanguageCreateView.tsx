import * as React from 'react';
import {useState} from 'react';
import {container} from 'tsyringe';
import {LINKS, PARAMS} from '../../../../constants/links';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import * as Yup from 'yup';
import {TextField} from '../../../common/form/fields/TextField';
import {RepositoryPage} from '../RepositoryPage';
import {BaseFormView} from '../../BaseFormView';
import {LanguageActions} from '../../../../store/languages/LanguageActions';
import {LanguageDTO} from "../../../../service/response.types";
import {useRedirect} from "../../../../hooks/useRedirect";

const actions = container.resolve(LanguageActions);

export const LanguageCreateView = () => {
    let match = useRouteMatch();

    const repositoryId = match.params[PARAMS.REPOSITORY_ID];

    const [cancelled, setCancelled] = useState(false);

    let createLoadable = actions.useSelector(s => s.loadables.create);

    const onSubmit = (values) => {
        const dto: LanguageDTO = {
            ...values,
        };
        actions.loadableActions.create.dispatch(repositoryId, dto);
    };

    if (createLoadable.loaded || cancelled) {
        setCancelled(false);
        actions.loadableReset.create.dispatch();
        useRedirect(LINKS.REPOSITORY_LANGUAGES, {[PARAMS.REPOSITORY_ID]: repositoryId});
    }

    return (
        <RepositoryPage>
            <BaseFormView
                lg={6} md={8} xs={12}
                title={'Add language'}
                initialValues={{name: "", abbreviation: ""}}
                onSubmit={onSubmit}
                onCancel={() => setCancelled(true)}
                saveActionLoadable={createLoadable}
                validationSchema={Yup.object().shape(
                    {
                        name: Yup.string().required().max(100),
                        abbreviation: Yup.string().required().max(20)
                    })}
            >
                <>
                    <TextField label="Name" name="name" required={true}/>
                    <TextField label="Abbreviation" name="abbreviation" required={true}/>
                </>
            </BaseFormView>
            <Switch>
                <Route exact path={LINKS.REPOSITORY_TRANSLATIONS_ADD.template}>

                </Route>
            </Switch>
        </RepositoryPage>
    );
};
