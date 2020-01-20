import Fab, {FabProps} from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';

export function FabAddButton(props: FabProps) {

    return <Fab color="primary" aria-label="add" {...props}>
        <AddIcon/>
    </Fab>;
}
