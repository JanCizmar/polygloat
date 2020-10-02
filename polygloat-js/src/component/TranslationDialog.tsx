import * as React from "react";
import {FunctionComponent, useEffect, useState} from "react";
import {TranslationData} from "../DTOs/TranslationData";
import {container} from "tsyringe";
import {PolygloatService} from "../services/polygloatService";
import {Properties} from "../Properties";
import {EventService} from "../services/EventService";
import TranslationDialogInner from "./TranslatonDialogInner";

type DialogProps = {
    input: string,
    open: boolean
    onClose: () => void
}

export type DialogContextType = {
        loading: boolean,
        saving: boolean,
        error: string
        success: boolean,
        availableLanguages: Set<string>,
        selectedLanguages: Set<string>,
        onSelectedLanguagesChange: (val: Set<string>) => void,
        editDisabled: boolean,
        onTranslationInputChange: (abbr) => (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
        translations: TranslationData,
        onSave: () => void
    }
    & DialogProps

export const TranslationDialogContext = React.createContext<DialogContextType>(undefined);

export const TranslationDialog: FunctionComponent<DialogProps> = (props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [translations, setTranslations] = useState<TranslationData>(null);
    const service = container.resolve(PolygloatService);
    const properties = container.resolve(Properties);

    const onTranslationInputChange = (abbr) => (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSuccess(false);
        translations.translations[abbr] = event.target.value;
        setTranslations({...translations});
    };

    const loadTranslations = (languages?: Set<string>) => {
        service.getSourceTranslations(props.input, languages).then(result => {
            setTranslations(result);
            setLoading(false);
        });
    }

    useEffect(() => {
        if (props.open) {
            setLoading(true);
            setSuccess(false);
            setError(null);
            loadTranslations(service.preferredLanguages);
            if (availableLanguages === undefined) {
                service.getLanguages().then(l => {
                    setAvailableLanguages(l);
                });
            }
        }
    }, [props.open]);

    const onSave = async () => {
        setSaving(true);
        try {
            setSaving(true);
            await service.setTranslations(translations);
            container.resolve(EventService).TRANSLATION_CHANGED.emit(translations);
            setSuccess(true);
            await new Promise((resolve => setTimeout(resolve, 500)));
            setError(null);
            props.onClose();
        } catch (e) {
            setError("Unexpected error occurred :(");
            throw e;
        } finally {
            setSaving(false);
        }
    };

    const editDisabled = loading || !service.isKeyAllowed("translations.edit");

    const [availableLanguages, setAvailableLanguages] = useState(undefined);

    const [selectedLanguages, setSelectedLanguages] = useState(service.preferredLanguages || new Set([properties.currentLanguage]));

    const onSelectedLanguagesChange = (value: Set<string>) => {
        if (value.size) {
            setSelectedLanguages(value);
            service.preferredLanguages = value;
            loadTranslations(value);
        }
    };

    const contextValue: DialogContextType = {
        ...props,
        loading, saving, success, error,
        availableLanguages, selectedLanguages, onSelectedLanguagesChange, editDisabled, onTranslationInputChange, translations, onSave
    };

    return (
        <TranslationDialogContext.Provider value={contextValue}>
            <div style={{fontFamily: "Rubik, Roboto, Arial"}}>
                <TranslationDialogInner/>
            </div>
        </TranslationDialogContext.Provider>
    )
};