import {Folder} from '../../store/translation/types';
import * as React from 'react';
import {Actions} from '../../store/translation/actions';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';

interface Props {
    isEdited: boolean;
    folder: Folder
    oldFolder: Folder
}


export const FolderActions = (props: Props) => {


    return (
        <Box>
            {!props.isEdited ?
                <React.Fragment>
                    <IconButton onClick={() => Actions.onFolderEdit.dispatch(props.oldFolder)}
                                size="small" aria-label="Edit folder"><EditIcon/></IconButton>
                    <IconButton onClick={() => Actions.onNewTranslation.dispatch(props.oldFolder)}
                                size="small" aria-label="Add translation"><AddIcon/></IconButton>
                    <IconButton onClick={() => Actions.onNewFolder.dispatch(props.oldFolder)}
                                size="small" aria-label="Add folder"><CreateNewFolderIcon/></IconButton>
                </React.Fragment>
                :
                <React.Fragment>
                    <IconButton onClick={() => Actions.onFolderEditSave.dispatch(props.oldFolder, props.folder)}
                                size="small" aria-label="Save"><CheckIcon/></IconButton>
                    <IconButton onClick={() => Actions.onFolderDelete.dispatch(props.oldFolder)}
                                size="small" aria-label="Delete folder"><DeleteIcon/></IconButton>
                    <IconButton onClick={() => Actions.onFolderEditClose.dispatch(props.oldFolder)}
                                size="small" aria-label="Cancel editing"><CloseIcon/></IconButton>
                </React.Fragment>
            }
        </Box>);
};

