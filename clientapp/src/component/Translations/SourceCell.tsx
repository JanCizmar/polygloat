import * as React from 'react';
import {FunctionComponent, useContext, useState} from 'react';
import {Theme} from "@material-ui/core";
import {RowContext} from "./SourceTranslations";
import {createStyles} from "@material-ui/core/styles";
import {useRepository} from "../../hooks/useRepository";
import {RepositoryPermissionType} from "../../service/response.types";
import * as Yup from 'yup';
import {EditableCell} from "./EditableCell";
import {container} from "tsyringe";
import {TranslationActions} from "../../store/repository/TranslationActions";
import {messageService} from "../../service/messageService";
import {TranslationListContext} from "./TranslationsGrid";
import {parseError} from "../common/form/ResourceErrorComponent";


const useStyles = createStyles((theme: Theme) => {

});

let actions = container.resolve(TranslationActions);
let messaging = container.resolve(messageService);

export const SourceCell: FunctionComponent = (props) => {
    let repositoryDTO = useRepository();

    let context = useContext(RowContext);
    let listContext = useContext(TranslationListContext);

    let saveLoadable = actions.useSelector(s => s.loadables.editSource);

    if (saveLoadable.error) {
        for (const error of parseError(saveLoadable.error)) {
            messaging.error(error);
        }
    }

    if (saveLoadable.loaded) {
        actions.loadableReset.editSource.dispatch();
        messaging.success("Successfully edited!");
        listContext.resetEdit();
        listContext.refreshList();
    }


    const handleSubmit = (v) => {
        actions.loadableActions.editSource.dispatch(repositoryDTO.id, {oldFullPathString: context.data.name, newFullPathString: v});
    };


    return (
        <EditableCell initialValue={context.data.name}
                      validationSchema={Yup.string().min(3).max(300).required()}
                      onSubmit={handleSubmit}
                      editEnabled={repositoryDTO.permissionType === RepositoryPermissionType.MANAGE
                      || repositoryDTO.permissionType === RepositoryPermissionType.EDIT}
        />
    )
};