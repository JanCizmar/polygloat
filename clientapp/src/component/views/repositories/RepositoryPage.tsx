import * as React from 'react';
import {FunctionComponent, useEffect} from 'react';

import {DashboardPage} from '../../layout/DashboardPage';
import {Divider} from '@material-ui/core';
import List from '@material-ui/core/List';
import {SideMenuItem} from '../../layout/sideMenu/SideMenuItem';
import {LINKS, PARAMS} from '../../../constants/links';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import SettingsIcon from '@material-ui/icons/Settings';
import LanguageIcon from '@material-ui/icons/Language';
import FlagIcon from '@material-ui/icons/Flag';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import {useSelector} from 'react-redux';
import {AppState} from '../../../store';
import {container} from 'tsyringe';
import {RepositoryActions} from '../../../store/repository/RepositoryActions';
import {FullPageLoading} from '../../common/FullPageLoading';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';

interface Props {
    id: number
}

const SideMenuItems = ({id}: Props) => (
    <div>
        <Divider/>
        <List>
            <SideMenuItem linkTo={LINKS.REPOSITORIES.build({[PARAMS.REPOSITORY_ID]: id})}
                          icon={<DynamicFeedIcon/>} text="Repositories"/>
        </List>
        <Divider/>
        <List>
            <SideMenuItem linkTo={LINKS.REPOSITORY_TRANSLATIONS.build({[PARAMS.REPOSITORY_ID]: id})}
                          icon={<LanguageIcon/>} text="Translations"/>
        </List>
        <Divider/>
        <List>
            <SideMenuItem linkTo={LINKS.REPOSITORY_EDIT.build({[PARAMS.REPOSITORY_ID]: id})}
                          icon={<SettingsIcon/>} text="Repository settings"/>
            <SideMenuItem linkTo={LINKS.REPOSITORY_LANGUAGES.build({[PARAMS.REPOSITORY_ID]: id})}
                          icon={<FlagIcon/>} text="Languages"/>
            <SideMenuItem linkTo={LINKS.REPOSITORY_INVITATION.build({[PARAMS.REPOSITORY_ID]: id})}
                          icon={<PersonAddIcon/>} text="Invite user"/>
            <SideMenuItem linkTo={LINKS.REPOSITORY_PERMISSIONS.build({[PARAMS.REPOSITORY_ID]: id})}
                          icon={<SupervisedUserCircleIcon/>} text="Permissions"/>
        </List>
    </div>
);

export const RepositoryPage: FunctionComponent<Props> = ({children, id}) => {
    let repositoriesState = useSelector((state: AppState) => state.repositories);

    const actions = container.resolve(RepositoryActions);
    const repository = repositoriesState.selectedRepository;

    useEffect(() => {
        if (!repository) {
            actions.loadRepository.dispatch(id);
        }
    }, []);

    if (!repository) {
        console.log('here');
        return null;
    }

    if (repositoriesState.selectedRepositoryLoading) {
        return <FullPageLoading/>;
    }

    return (
        <DashboardPage subtitle={repository.name} sideMenuItems={<SideMenuItems id={id}/>}>
            {children}
        </DashboardPage>
    );
};
