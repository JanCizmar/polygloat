import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import {Link} from 'react-router-dom';


export function FabAddButtonLink(props: { to: string }) {

    return <Fab color="primary" aria-label="add" component={Link} {...props}>
        <AddIcon/>
    </Fab>;
}
