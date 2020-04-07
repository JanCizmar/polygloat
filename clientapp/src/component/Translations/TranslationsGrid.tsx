import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {useRepository} from "../../hooks/useRepository";
import {Box} from "@material-ui/core";
import {TranslationsRow} from "./TranslationsRow";
import {Header} from "./Header";
import Paper from "@material-ui/core/Paper";
import {BoxLoading} from "../common/BoxLoading";
import {Pagination} from "./Pagination";
import {LINKS, PARAMS} from "../../constants/links";
import {Route, Switch} from "react-router-dom";
import {TranslationCreationDialog} from "./TranslationCreationDialog";
import {TranslationListContext} from "./TtranslationsGridContextProvider";
import {EmptyListMessage} from "../common/EmptyListMessage";
import {FabAddButtonLink} from "../common/buttons/FabAddButtonLink";
import {MenuBar} from "./MenuBar";


export const TranslationsGrid: FunctionComponent = (props) => {
    let repositoryDTO = useRepository();

    const listContext = useContext(TranslationListContext);


    return (
        <>
            {listContext.listLoadable.data.paginationMeta.allCount === 0 &&
            <>
                {listContext.listLoadable.data.params.search &&
                <>
                    <MenuBar/>
                    <EmptyListMessage/>
                </>
                ||
                <>
                    <EmptyListMessage/>
                    <Box display="flex" justifyContent="center">
                        <FabAddButtonLink to={LINKS.REPOSITORY_TRANSLATIONS_ADD.build({[PARAMS.REPOSITORY_ID]: repositoryDTO.id})}/>
                    </Box>
                </>
                }
            </>
            ||
            <>
                <MenuBar/>
                <Paper>
                    {listContext.listLoadable.data ?
                        <Box p={1} display="flex" justifyContent="flex-end">
                            <Box display="flex" flexDirection="column" flexGrow={1} maxWidth="100%" fontSize={14}>
                                <Header/>
                                {listContext.listLoadable.data.data.map(t => <TranslationsRow key={t.name} data={t}/>)}
                            </Box>
                        </Box>
                        :
                        <BoxLoading/>
                    }
                </Paper>
                <Pagination/>
            </>}
            <Switch>
                <Route path={LINKS.REPOSITORY_TRANSLATIONS_ADD.template}>
                    <TranslationCreationDialog/>
                </Route>
            </Switch>
        </>
    )
};