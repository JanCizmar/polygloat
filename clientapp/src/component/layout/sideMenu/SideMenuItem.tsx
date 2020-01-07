import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';

interface SideMenuItemProps {
    linkTo?: string;
    icon: React.ReactElement;
    text: string;
}

export function SideMenuItem({linkTo, icon, text}: SideMenuItemProps) {
    return (
        <ListItem button component="a" href={linkTo || ''}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={text}/>
        </ListItem>
    );
}
