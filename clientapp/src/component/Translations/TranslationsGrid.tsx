import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {container} from "tsyringe";
import {TranslationActions} from "../../store/repository/TranslationActions";
import {useRepository} from "../../hooks/useRepository";
import {Box, Button, IconButton, makeStyles, Slide, Theme, Tooltip} from "@material-ui/core";
import {TranslationsRow} from "./TranslationsRow";
import {Header} from "./Header";
import Paper from "@material-ui/core/Paper";
import {LanguagesMenu} from "../common/form/LanguagesMenu";
import {BoxLoading} from "../common/BoxLoading";
import {SearchField} from "./SearchField";
import {Pagination} from "./Pagination";
import {LINKS, PARAMS} from "../../constants/links";
import {Link, Route, Switch} from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import {TranslationCreationDialog} from "./TranslationCreationDialog";
import {useConfirmation} from "../../hooks/useConfirmation";
import {TranslationListContext} from "./TtranslationsGridContextProvider";
import {createStyles} from "@material-ui/core/styles";
import {grey} from "@material-ui/core/colors";

const actions = container.resolve(TranslationActions);

export const TranslationsGrid: FunctionComponent = (props) => {
    let repositoryDTO = useRepository();

    const listContext = useContext(TranslationListContext);

    return (
        <>
            <Box mb={2}>
                <Paper>
                    <Box display="flex" p={3}>
                        <Box flexGrow={1} display="flex">
                            <Box pr={2}>
                                <Slide in={listContext.isSomeChecked()} direction="right" mountOnEnter unmountOnExit>
                                    <Tooltip title="Delete selected">
                                        <IconButton color="secondary"
                                                    onClick={() =>
                                                        useConfirmation()({
                                                            onConfirm: () => actions.loadableActions.delete.dispatch(repositoryDTO.id, Array.from(listContext.checkedSources)),
                                                            confirmButtonText: "Delete",
                                                            confirmButtonColor: "secondary",
                                                            message: `Are you sure you want to delete all checked (${listContext.checkedSources.size}) translation sources?`,
                                                            title: "Delete confirmation"
                                                        })
                                                        //
                                                    }>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </Slide>
                            </Box>
                            <Box pr={2}>
                                <LanguagesMenu/>
                            </Box>
                            <SearchField/>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Button component={Link} variant="outlined" color="primary"
                                    to={LINKS.REPOSITORY_TRANSLATIONS_ADD.build({[PARAMS.REPOSITORY_ID]: repositoryDTO.id})}
                                    startIcon={<AddIcon/>}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <Paper>
                {listContext.listLoadable.data ?
                    <Box p={1} display="flex" justifyContent="flex-end">
                        <Box display="flex" flexDirection="column" flexGrow={1} maxWidth="100%">
                            <Header/>
                            {listContext.listLoadable.data.data.map(t => <TranslationsRow key={t.name} data={t}/>)}
                        </Box>
                    </Box>
                    :
                    <BoxLoading/>
                }
            </Paper>
            <Pagination/>
            <Switch>
                <Route path={LINKS.REPOSITORY_TRANSLATIONS_ADD.template}>
                    <TranslationCreationDialog/>
                </Route>
            </Switch>
        </>
    )
};