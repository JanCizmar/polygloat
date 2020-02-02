import {Divider} from "@material-ui/core";
import List from "@material-ui/core/List";
import {SideMenuItem} from "../../layout/sideMenu/SideMenuItem";
import {LINKS, PARAMS} from "../../../constants/links";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import LanguageIcon from "@material-ui/icons/Language";
import SettingsIcon from "@material-ui/icons/Settings";
import FlagIcon from "@material-ui/icons/Flag";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import * as React from "react";
import {useRepository} from "../../../hooks/useRepository";
import {RepositoryPermissionType} from "../../../service/response.types";

export const RepositoryMenu = ({id}) => {

    let repositoryDTO = useRepository();

    return (
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
                {repositoryDTO.permissionType === RepositoryPermissionType.MANAGE && (
                    <>
                        <SideMenuItem linkTo={LINKS.REPOSITORY_EDIT.build({[PARAMS.REPOSITORY_ID]: id})}
                                      icon={<SettingsIcon/>} text="Repository settings"/>
                        <SideMenuItem linkTo={LINKS.REPOSITORY_LANGUAGES.build({[PARAMS.REPOSITORY_ID]: id})}
                                      icon={<FlagIcon/>} text="Languages"/>
                        <SideMenuItem linkTo={LINKS.REPOSITORY_INVITATION.build({[PARAMS.REPOSITORY_ID]: id})}
                                      icon={<PersonAddIcon/>} text="Invite user"/>
                        <SideMenuItem linkTo={LINKS.REPOSITORY_PERMISSIONS.build({[PARAMS.REPOSITORY_ID]: id})}
                                      icon={<SupervisedUserCircleIcon/>} text="Permissions"/>
                    </>
                )}
            </List>
        </div>
    );
};
