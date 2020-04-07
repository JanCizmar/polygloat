import {default as React, FunctionComponent, useContext} from "react";
import {Box, Button, IconButton, Slide, Tooltip} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {useConfirmation} from "../../hooks/useConfirmation";
import DeleteIcon from "@material-ui/icons/Delete";
import {LanguagesMenu} from "../common/form/LanguagesMenu";
import {SearchField} from "./SearchField";
import {Link} from "react-router-dom";
import {LINKS, PARAMS} from "../../constants/links";
import AddIcon from "@material-ui/icons/Add";
import {TranslationListContext} from "./TtranslationsGridContextProvider";
import {useRepository} from "../../hooks/useRepository";
import {container} from "tsyringe";
import {TranslationActions} from "../../store/repository/TranslationActions";

export const MenuBar: FunctionComponent = () => {
    let repositoryDTO = useRepository();
    const actions = container.resolve(TranslationActions);
    const listContext = useContext(TranslationListContext);

    return (
        <Box mb={2}>
            <Paper>
                <Box display="flex" p={2} pl={1}>
                    <Box flexGrow={1} display="flex">
                        <Slide in={listContext.isSomeChecked()} direction="right" mountOnEnter unmountOnExit>
                            <Box pr={2}>
                                <Tooltip title="Delete selected">
                                    <IconButton color="secondary"
                                                onClick={() =>
                                                    useConfirmation()({
                                                        onConfirm: () => actions.loadableActions.delete
                                                            .dispatch(repositoryDTO.id, Array.from(listContext.checkedSources)),
                                                        confirmButtonText: "Delete",
                                                        confirmButtonColor: "secondary",
                                                        message: `Are you sure you want to delete all checked ` +
                                                            `(${listContext.checkedSources.size}) translation sources?`,
                                                        title: "Delete confirmation"
                                                    })
                                                }>
                                        <DeleteIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Slide>
                        <Box pr={2} pl={1}>
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
    )
};