import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {Theme} from "@material-ui/core";
import {RowContext} from "./SourceTranslations";
import {createStyles} from "@material-ui/core/styles";
import {useRepository} from "../../hooks/useRepository";
import {RepositoryPermissionType} from "../../service/response.types";
import * as Yup from 'yup';
import {EditableCell} from "./EditableCell";
import {TranslationListContext} from "./TranslationsGrid";
import {parseError} from "../common/form/ResourceErrorComponent";
import {container} from "tsyringe";
import {TranslationActions} from "../../store/repository/TranslationActions";
import {messageService} from "../../service/messageService";

export interface TranslationsTableCellProps {
    abbreviation: string;
}

const useStyles = createStyles((theme: Theme) => {

});

let actions = container.resolve(TranslationActions);
let messaging = container.resolve(messageService);

export const TranslationCell: FunctionComponent<TranslationsTableCellProps> = (props) => {
    let repositoryDTO = useRepository();

    let context = useContext(RowContext);
    let listContext = useContext(TranslationListContext);

    let saveLoadable = actions.useSelector(s => s.loadables.setTranslations);

    if (saveLoadable.error) {
        for (const error of parseError(saveLoadable.error)) {
            messaging.error(error);
        }
    }

    if (saveLoadable.loaded) {
        actions.loadableReset.setTranslations.dispatch();
        messaging.success("Translation saved");
        listContext.resetEdit();
        listContext.refreshList();
    }


    const handleSubmit = (v) => {
        actions.loadableActions.setTranslations.dispatch(repositoryDTO.id, {sourceFullPath: context.data.name, translations: {[props.abbreviation]: v}});
    };

    return (
        <EditableCell initialValue={context.data.translations[props.abbreviation]}
                      validationSchema={Yup.string().min(0).max(300).required()}
                      onSubmit={handleSubmit}
                      editEnabled={repositoryDTO.permissionType === RepositoryPermissionType.MANAGE
                      || repositoryDTO.permissionType === RepositoryPermissionType.EDIT || repositoryDTO.permissionType === RepositoryPermissionType.TRANSLATE}
        />
    )
};