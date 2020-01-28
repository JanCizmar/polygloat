import {default as React, FunctionComponent} from 'react';
import {Button} from '@material-ui/core';
import {container} from 'tsyringe';
import {GlobalActions} from '../../store/global/globalActions';
import {useSelector} from 'react-redux';
import {AppState} from '../../store';

interface UserMenuProps {

}

const globalActions = container.resolve(GlobalActions);

export const UserMenu: FunctionComponent<UserMenuProps> = (props) => {

    const authentication = useSelector((state: AppState) => state.global.remoteConfig.authentication);
    const userLogged = useSelector((state: AppState) => state.global.security.allowPrivate);

    //const authentication = useSelector((state: AppState) => state.global.remoteConfig.authentication);

    if (!authentication) {
        return null;
    }

    return (
        <>
            {userLogged && <Button color="inherit" onClick={() => globalActions.logout.dispatch()}>Logout</Button>}
        </>
    );
};
