import * as React from 'react';
import {useEffect} from 'react';
import {container} from 'tsyringe';
import {LINKS, PARAMS} from '../../../../constants/links';
import {useRouteMatch} from 'react-router-dom';
import {TextField} from '../../../common/form/fields/TextField';
import {RepositoryPage} from '../RepositoryPage';
import {BaseFormView} from '../../BaseFormView';
import {LanguageActions} from '../../../../store/languages/LanguageActions';
import {Button} from "@material-ui/core";
import {useConfirmation} from "../../../../hooks/useConfirmation";
import {LanguageDTO} from "../../../../service/response.types";
import {Validation} from "../../../../constants/GlobalValidationSchema";
import {useRedirect} from "../../../../hooks/useRedirect";

const actions = container.resolve(LanguageActions);

export const LanguageEditView = () => {

    let confirmation = useConfirmation({title: "Delete language"});

    let match = useRouteMatch();

    const repositoryId = match.params[PARAMS.REPOSITORY_ID];
    const languageId = match.params[PARAMS.LANGUAGE_ID];

    let languageLoadable = actions.useSelector(s => s.loadables.language);
    let editLoadable = actions.useSelector(s => s.loadables.edit);
    let deleteLoadable = actions.useSelector(s => s.loadables.delete);

    useEffect(() => {
        if (!languageLoadable.loaded && !languageLoadable.loading) {
            actions.loadableActions.language.dispatch(repositoryId, languageId);
        }
        return () => {
            actions.loadableReset.edit.dispatch();
            actions.loadableReset.language.dispatch();
        }
    }, []);


    useEffect(() => {
        if (deleteLoadable.loaded) {
            useRedirect(LINKS.REPOSITORY_LANGUAGES, {[PARAMS.REPOSITORY_ID]: repositoryId});
        }
        return () => actions.loadableReset.delete.dispatch();
    }, [deleteLoadable.loaded]);

    const onSubmit = (values) => {
        const dto: LanguageDTO = {
            ...values,
            id: languageId
        };
        actions.loadableActions.edit.dispatch(repositoryId, dto);
    };

    return (
        <RepositoryPage>
            <BaseFormView
                lg={6} md={8} xs={10}
                title={'Language settings'}
                initialValues={languageLoadable.data}
                onSubmit={onSubmit}
                saveActionLoadable={editLoadable}
                resourceLoadable={languageLoadable}
                validationSchema={Validation.LANGUAGE}
                customActions={
                    <Button variant="outlined" color="secondary"
                            onClick={() => confirmation({
                                message: "Are you sure you want to delete languageLoadable " + languageLoadable.data.name + "?",
                                hardModeText: languageLoadable.data.name.toUpperCase(),
                                confirmButtonText: "Delete",
                                confirmButtonColor: "secondary",
                                onConfirm: () => {
                                    actions.loadableActions.delete.dispatch(repositoryId, languageId)
                                }
                            })}
                    >
                        Delete language
                    </Button>}
            >
                {() => <>
                    <TextField label="Name" name="name" required={true}/>
                    <TextField label="Abbreviation" name="abbreviation" required={true}/>
                </>}
            </BaseFormView>
        </RepositoryPage>
    );
};
