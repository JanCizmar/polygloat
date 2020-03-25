import * as React from 'react';
import {FunctionComponent} from 'react';

import {DashboardPage} from '../../layout/DashboardPage';
import {useRepository} from "../../../hooks/useRepository";
import {RepositoryMenu} from "./RepositoryMenu";

interface Props {
    fullWidth?: boolean
}


export const RepositoryPage: FunctionComponent<Props> = (props) => {
    return (
        <DashboardPage fullWidth={props.fullWidth} repositoryName={useRepository().name} sideMenuItems={<RepositoryMenu id={useRepository().id}/>}>
            {props.children}
        </DashboardPage>
    );
};
