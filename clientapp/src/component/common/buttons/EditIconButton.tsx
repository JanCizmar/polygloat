import IconButton, {IconButtonProps} from '@material-ui/core/IconButton';
import * as React from 'react';
import EditIcon from '@material-ui/icons/Edit';

export function EditIconButton(props: IconButtonProps) {
    return <IconButton aria-label="edit" color="primary" {...props}>
        <EditIcon/>
    </IconButton>;
}
