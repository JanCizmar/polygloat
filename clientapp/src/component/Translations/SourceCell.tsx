import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {RowContext} from "./TranslationsRow";
import {useRepository} from "../../hooks/useRepository";
import {RepositoryPermissionType} from "../../service/response.types";
import {EditableCell} from "./EditableCell";
import {container} from "tsyringe";
import {TranslationActions} from "../../store/repository/TranslationActions";
import {Validation} from "../../constants/GlobalValidationSchema";

let actions = container.resolve(TranslationActions);

export const SourceCell: FunctionComponent = (props) => {
    let repositoryDTO = useRepository();

    let context = useContext(RowContext);

    const handleSubmit = (v) => {
        actions.loadableActions.editSource.dispatch(repositoryDTO.id, {oldFullPathString: context.data.name, newFullPathString: v});
    };


    return (
        <EditableCell initialValue={context.data.name}
                      validationSchema={Validation.TRANSLATION_SOURCE}
                      onSubmit={handleSubmit}
                      editEnabled={repositoryDTO.permissionType === RepositoryPermissionType.MANAGE
                      || repositoryDTO.permissionType === RepositoryPermissionType.EDIT}
        />
    )
};