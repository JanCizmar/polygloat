import * as React from 'react';
import {FunctionComponent} from 'react';

import {DashboardPage} from '../../layout/DashboardPage';
import {Divider} from '@material-ui/core';
import List from '@material-ui/core/List';
import {SideMenuItem} from '../../layout/sideMenu/SideMenuItem';
import {LINKS} from '../../../constants/links';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import SettingsIcon from '@material-ui/icons/Settings';
import LanguageIcon from '@material-ui/icons/Language';
import FlagIcon from '@material-ui/icons/Flag';

interface Props {
    id: number
}

const SideMenuItems = ({id}: Props) => (
    <div>
        <Divider/>
        <List>
            <SideMenuItem linkTo={LINKS.REPOSITORIES.build({repositoryId: id})} icon={<DynamicFeedIcon/>} text="Repositories"/>
        </List>
        <Divider/>
        <List>
            <SideMenuItem linkTo={LINKS.REPOSITORY_TRANSLATIONS.build({repositoryId: id})}
                          icon={<LanguageIcon/>} text="Translations"/>
        </List>
        <Divider/>
        <List>
            <SideMenuItem linkTo={LINKS.REPOSITORY_EDIT.build({repositoryId: id})}
                          icon={<SettingsIcon/>} text="Repository settings"/>
            <SideMenuItem linkTo={LINKS.REPOSITORY_LANGUAGES.build({repositoryId: id})}
                          icon={<FlagIcon/>} text="Languages"/>
        </List>
    </div>
);

export const RepositoryPage: FunctionComponent<Props> = ({children, id}) => {
    return (
        <DashboardPage sideMenuItems={<SideMenuItems id={id}/>}>
            {children}
        </DashboardPage>
    );
};
