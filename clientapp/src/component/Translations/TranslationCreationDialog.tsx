import * as React from 'react';
import {useContext, useEffect} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useRepository} from "../../hooks/useRepository";
import {LINKS, PARAMS} from '../../constants/links';
import {container} from "tsyringe";
import {RedirectionActions} from "../../store/global/redirectionActions";
import {StandardForm} from "../common/form/StandardForm";
import {LanguagesMenu} from "../common/form/LanguagesMenu";
import {TranslationActions} from "../../store/repository/TranslationActions";
import {TextField} from "../common/form/fields/TextField";
import {ResourceErrorComponent} from "../common/form/ResourceErrorComponent";
import {messageService} from "../../service/messageService";
import {Validation} from "../../constants/GlobalValidationSchema";
import {TranslationListContext} from "./TtranslationsGridContextProvider";

export type TranslationCreationValue = {
    source: string;
    translations: { [abbreviation: string]: string }
}

const redirectionActions = container.resolve(RedirectionActions);
const translationActions = container.resolve(TranslationActions);
const messaging = container.resolve(messageService);

export function TranslationCreationDialog() {

    const repositoryDTO = useRepository();

    let selectedLanguages = translationActions.useSelector(s => s.selectedLanguages);

    let saveLoadable = translationActions.useSelector(s => s.loadables.createSource);

    let listContext = useContext(TranslationListContext);

    function onClose() {
        translationActions.loadableReset.createSource.dispatch();
        redirectionActions.redirect.dispatch(LINKS.REPOSITORY_TRANSLATIONS.build({[PARAMS.REPOSITORY_ID]: repositoryDTO.id}));
    }

    useEffect(() => {
        if (saveLoadable.loaded && !saveLoadable.error) {
            messaging.success("Translation created");
            listContext.loadData();
            onClose();
        }
    }, [saveLoadable.error, saveLoadable.loaded]);

    function onSubmit(v) {
        translationActions.loadableActions.createSource.dispatch(repositoryDTO.id, v);
    }

    const initialTranslations = selectedLanguages.reduce((res, l) => ({...res, [l]: ''}), {});

    return (
        <Dialog
            open
            onClose={() => onClose()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">Add translation</DialogTitle>
            <DialogContent>
                {saveLoadable && saveLoadable.error && <ResourceErrorComponent error={saveLoadable.error}/>}

                <LanguagesMenu/>
                <StandardForm onSubmit={onSubmit}
                              initialValues={{source: "", translations: initialTranslations}}
                              validationSchema={Validation.SOURCE_TRANSLATION_CREATION(selectedLanguages)}
                              onCancel={() => onClose()}>
                    <TextField multiline name="source" label="Source text" fullWidth/>

                    {selectedLanguages.map(s => (
                        <TextField multiline key={s} name={"translations." + s} label={s}/>
                    ))}

                </StandardForm>
            </DialogContent>
        </Dialog>
    );
}
