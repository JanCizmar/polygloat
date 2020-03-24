import {TopBar} from './TopBar';
import {SideMenu} from './sideMenu/SideMenu';
import * as React from 'react';
import {ReactElement, useState} from 'react';
import {Box} from "@material-ui/core";

interface MainMenuProps {
    sideMenuItems?: ReactElement;
    subtitle?: string
}

export const MainMenu = ({sideMenuItems, ...props}: MainMenuProps) => {

    const [open, setOpen] = useState(sideMenuItems && true);

    return <>
        <TopBar subtitle={props.subtitle} onSideMenuOpen={() => setOpen(true)} isSideMenu={!!sideMenuItems} open={open}/>

        {sideMenuItems &&
        <SideMenu onSideMenuClose={() => setOpen(false)} open={open}>
            {props.subtitle && <Box display="flex" p={2} alignItems="center" justifyContent="center" fontWeight="500" fontSize={25}>
                {open && props.subtitle || props.subtitle.substr(0, 1)}
            </Box>}
            {sideMenuItems}
        </SideMenu>
        }
    </>;
};
