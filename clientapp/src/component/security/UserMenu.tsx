import {default as React, FunctionComponent, useState} from 'react';
import {Button} from '@material-ui/core';
import {container} from 'tsyringe';
import {GlobalActions} from '../../store/global/globalActions';
import {useSelector} from 'react-redux';
import {AppState} from '../../store';
import {useConfig} from "../../hooks/useConfig";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {useUser} from "../../hooks/useUser";
import {Link} from "react-router-dom";
import {LINKS} from "../../constants/links";

interface UserMenuProps {

}

const globalActions = container.resolve(GlobalActions);

export const UserMenu: FunctionComponent<UserMenuProps> = (props) => {

    const userLogged = useSelector((state: AppState) => state.global.security.allowPrivate);

    const authentication = useConfig().authentication;

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const [anchorEl, setAnchorEl] = useState(null);

    const user = useUser();

    if (!authentication || !user) {
        return null;
    }

    return (
        <>
            {userLogged &&
            <div>
                <Button color="inherit" aria-controls="user-menu" aria-haspopup="true"
                        onClick={handleOpen}>{user.name}</Button>
                <Menu id="user-menu" keepMounted
                      elevation={0}
                      getContentAnchorEl={null}
                      open={!!anchorEl}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                      }}
                      transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                      }}>
                    <MenuItem onClick={() => globalActions.logout.dispatch()}>Logout</MenuItem>
                    <MenuItem component={Link} to={LINKS.USER_API_KEYS.build()}>Api keys</MenuItem>
                </Menu>
            </div>
            }
        </>
    );
};
