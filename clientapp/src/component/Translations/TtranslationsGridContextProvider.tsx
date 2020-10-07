import {default as React, FunctionComponent, ReactNode, useEffect, useState} from "react";
import {parseError} from "../common/form/ResourceErrorComponent";
import {container} from "tsyringe";
import {messageService} from "../../service/messageService";
import {TranslationActions} from "../../store/repository/TranslationActions";
import {useRepository} from "../../hooks/useRepository";
import {Loadable} from "../../store/AbstractLoadableActions";
import {RepositoryPermissionType, TranslationsDataResponse} from "../../service/response.types";
import {T, useTranslate} from "polygloat-react";
import {FullPageLoading} from "../common/FullPageLoading";

export const TranslationListContext = React.createContext<TranslationListContextType>(null);

const actions = container.resolve(TranslationActions);

export type TranslationListContextType = {
    listLanguages: string[],
    resetEdit: () => void,
    cellWidths: number[],
    headerCells: ReactNode[]
    refreshList: () => void
    loadData: (search?: string, limit?: number, offset?: number) => void,
    listLoadable: Loadable<TranslationsDataResponse>
    perPage: number,
    checkAllToggle: () => void,
    isSourceChecked: (id: number) => boolean,
    toggleSourceChecked: (id: number) => void,
    isAllChecked: () => boolean,
    isSomeChecked: () => boolean
    checkedSources: Set<number>
    showCheckBoxes: boolean
}

export const TranslationGridContextProvider: FunctionComponent = (props) => {

    let repositoryDTO = useRepository();

    let listLoadable = actions.useSelector(s => s.loadables.translations);
    let selectedLanguages = actions.useSelector(s => s.selectedLanguages);
    let translationSaveLoadable = actions.useSelector(s => s.loadables.setTranslations);

    const t = useTranslate();

    const [perPage, setPerPage] = useState(20);

    let messaging = container.resolve(messageService);

    const loadData = (search?: string, limit?: number, offset?: number) => {
        setPerPage(limit || perPage);
        actions.loadableActions.translations.dispatch(
            repositoryDTO.id, selectedLanguages.length ? selectedLanguages : null, search, limit || perPage, offset
        );
    };

    useEffect(() => {
        if (!listLoadable.data || (selectedLanguages !== listLoadable.data.params.languages && selectedLanguages.length)) {
            loadData();
        }
    }, [selectedLanguages]);

    const [checkedSources, setCheckedSources] = useState(new Set<number>());

    //set state accepts also a function, thats why the funcion returns function - to handle the react call
    const [_resetEdit, setResetEdit] = useState(() => () => {
    });

    let sourceSaveLoadable = actions.useSelector(s => s.loadables.editSource);
    let deleteLoadable = actions.useSelector(s => s.loadables.delete);


    useEffect(() => {
        if (listLoadable.loaded && !listLoadable.loading) {
            //reset edit just when its loaded and its not reloading after edit
            _resetEdit();
        }
    }, [listLoadable.loading]);

    useEffect(() => {
        if (translationSaveLoadable.error) {
            actions.loadableReset.setTranslations.dispatch();
            for (const error of parseError(translationSaveLoadable.error)) {
                messaging.error(<T>{error}</T>);
            }
        }

        if (translationSaveLoadable.loaded) {
            messaging.success(<T>Translation grid - translation saved</T>);
            contextValue.refreshList();
            actions.loadableReset.setTranslations.dispatch();
        }

        if (sourceSaveLoadable.error) {
            for (const error of parseError(sourceSaveLoadable.error)) {
                messaging.error(<T>{error}</T>);
            }
            actions.loadableReset.editSource.dispatch();
        }

        if (sourceSaveLoadable.loaded) {
            actions.loadableReset.editSource.dispatch();
            messaging.success(<T>Translation grid - Successfully edited!</T>);
            contextValue.refreshList();
        }

        if (deleteLoadable.error) {
            actions.loadableReset.delete.dispatch();
            for (const error of parseError(deleteLoadable.error)) {
                messaging.error(<T>{error}</T>);
            }
        }

        if (deleteLoadable.loaded) {
            actions.loadableReset.delete.dispatch();
            messaging.success(<T>Translation grid - Successfully deleted!</T>);
            contextValue.refreshList();
        }

    }, [translationSaveLoadable, sourceSaveLoadable, deleteLoadable]);

    if (!listLoadable.touched || (listLoadable.loading && !listLoadable.data)) {
        return <FullPageLoading/>
    }

    const headerCells = [t("translation_grid_source_text"), ...listLoadable.data.params.languages].map((h, index) => <b key={index}>{h}</b>);

    const isSourceChecked = (name) => checkedSources.has(name);

    const isAllChecked = () => {
        return listLoadable.data.data.filter(i => !isSourceChecked(i.id)).length === 0;
    };

    const isSomeChecked = () => {
        return listLoadable.data.data.filter(i => isSourceChecked(i.id)).length > 0;
    };

    const contextValue: TranslationListContextType = {
        checkAllToggle: () => {
            isAllChecked() ? setCheckedSources(new Set()) : setCheckedSources(new Set<number>(listLoadable.data.data.map(d => d.id)));
        },
        listLanguages: listLoadable.data.params.languages,
        headerCells,
        cellWidths: headerCells.map(_ => 100 / headerCells.length),
        set resetEdit(resetEdit: () => void) {
            setResetEdit(() => resetEdit);
        },
        //set state accepts also a function, thats why the funcin returns function - to handle the react call
        get resetEdit() {
            return _resetEdit;
        },
        refreshList: () => actions.loadableActions.translations.dispatch(...listLoadable.dispatchParams),
        loadData,
        listLoadable,
        perPage: perPage,
        isSourceChecked: isSourceChecked,
        toggleSourceChecked: (id) => {
            let copy = new Set<number>(checkedSources);
            if (isSourceChecked(id)) {
                copy.delete(id);
            } else {
                copy.add(id);
            }
            setCheckedSources(copy);
        },
        isAllChecked,
        isSomeChecked,
        checkedSources,
        showCheckBoxes: repositoryDTO.permissionType === RepositoryPermissionType.MANAGE
    };

    return (
        <TranslationListContext.Provider value={contextValue}>
            {props.children}
        </TranslationListContext.Provider>
    );
};