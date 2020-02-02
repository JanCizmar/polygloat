import * as React from 'react';
import {ContextType, FunctionComponent, ReactNode, useEffect, useState} from 'react';
import {container} from "tsyringe";
import {TranslationActions} from "../../store/repository/TranslationActions";
import {useRepository} from "../../hooks/useRepository";
import FullPageLoading from "../common/FullPageLoading";
import {Box, TextField} from "@material-ui/core";
import {SourceTranslations} from "./SourceTranslations";
import {Header} from "./Header";
import Paper from "@material-ui/core/Paper";
import {LanguagesMenu} from "../common/form/LanguagesMenu";
import {BoxLoading} from "../common/BoxLoading";
import {Loadable} from "../../store/AbstractLoadableActions";
import {TranslationsDataResponse} from "../../service/response.types";
import {SearchField} from "./SearchField";
import {TablePagination} from '@material-ui/core';
import {Pagination} from "./Pagination";

export interface TranslationsGridProps {

}

const actions = container.resolve(TranslationActions);

export type TranslationListContextType = {
    listLanguages: string[],
    resetEdit: () => void,
    cellWidths: number[],
    headerCells: ReactNode[]
    refreshList: () => void
    loadData: (search?: string, limit?: number, offset?: number) => void,
    listLoadable: Loadable<TranslationsDataResponse>
    defaultPerPage: number
}

export const TranslationListContext = React.createContext<TranslationListContextType>(null);

export const TranslationsGrid: FunctionComponent<TranslationsGridProps> = (props) => {
    let repositoryDTO = useRepository();

    let listLoadable = actions.useSelector(s => s.loadables.translations);

    let selectedLanguages = actions.useSelector(s => s.selectedLanguages);

    const defaultPerPage = 10;

    const loadData = (search?: string, limit?: number, offset?: number) => {
        actions.loadableActions.translations.dispatch(repositoryDTO.id, selectedLanguages.length ? selectedLanguages : null, search, defaultPerPage, offset);
    };

    useEffect(() => {
        if (!listLoadable.data || (selectedLanguages !== listLoadable.data.params.languages && selectedLanguages.length)) {
            loadData();
        }
    }, [selectedLanguages]);


    if (!listLoadable.touched || (listLoadable.loading && !listLoadable.data)) {
        return <FullPageLoading/>
    }

    const headerCells = ["Source text", ...listLoadable.data.params.languages].map(h => <b>{h}</b>);

    const contextValue: TranslationListContextType = {
        listLanguages: listLoadable.data.params.languages,
        headerCells,
        cellWidths: headerCells.map(_ => 100 / headerCells.length),
        resetEdit: () => {
        },
        refreshList: () => actions.loadableActions.translations.dispatch(...listLoadable.dispatchParams),
        loadData,
        listLoadable,
        defaultPerPage: defaultPerPage
    };

    return (
        <TranslationListContext.Provider value={contextValue}>
            <Box mb={2}>
                <Paper>
                    <Box display="flex">
                        <Box p={3}>
                            <LanguagesMenu/>
                        </Box>
                        <SearchField/>
                    </Box>
                </Paper>
            </Box>
            <Paper>
                {!listLoadable.loading ?
                    <Box p={3} display="flex" justifyContent="flex-end">
                        <Box display="flex" flexDirection="column" flexGrow={1}>
                            <Header/>
                            {listLoadable.data.data.map(t => <SourceTranslations data={t}/>)}
                        </Box>
                    </Box>
                    :
                    <BoxLoading/>
                }
            </Paper>
            <Pagination/>
        </TranslationListContext.Provider>
    )
};