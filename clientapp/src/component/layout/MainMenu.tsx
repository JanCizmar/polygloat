import {TopBar} from './TopBar';
import {SideMenu} from './sideMenu/SideMenu';
import * as React from 'react';
import {ReactElement, useState} from 'react';

interface MainMenuProps {
    sideMenuItems?: ReactElement;
}

export const MainMenu = ({sideMenuItems}: MainMenuProps) => {

    const [open, setOpen] = useState(sideMenuItems && true);

    return <>
        <TopBar onSideMenuOpen={() => setOpen(true)} isSideMenu={!!sideMenuItems} open={open}/>

        {sideMenuItems &&
        <SideMenu onSideMenuClose={() => setOpen(false)} open={open}>
            {sideMenuItems}
        </SideMenu>
        }
    </>;
};
