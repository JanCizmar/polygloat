import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {RowContext} from "./TranslationsRow";
import {useRepository} from "../../hooks/useRepository";
import {RepositoryPermissionType} from "../../service/response.types";
import * as Yup from 'yup';
import {EditableCell} from "./EditableCell";
import {container} from "tsyringe";
import {TranslationActions} from "../../store/repository/TranslationActions";
import {Validation} from "../../constants/GlobalValidationSchema";

export interface TranslationsTableCellProps {
    abbreviation: string;
}

let actions = container.resolve(TranslationActions);

export const TranslationCell: FunctionComponent<TranslationsTableCellProps> = (props) => {
    let repositoryDTO = useRepository();

    let context = useContext(RowContext);


    const handleSubmit = (v) => {
        actions.loadableActions.setTranslations.dispatch(repositoryDTO.id, {sourceFullPath: context.data.name, translations: {[props.abbreviation]: v}});
    };

    return (
        <EditableCell initialValue={context.data.translations[props.abbreviation]}
                      validationSchema={Validation.TRANSLATION_TRANSLATION}
                      onSubmit={handleSubmit}
                      editEnabled={repositoryDTO.permissionType === RepositoryPermissionType.MANAGE
                      || repositoryDTO.permissionType === RepositoryPermissionType.EDIT || repositoryDTO.permissionType === RepositoryPermissionType.TRANSLATE}
        />
    )
};