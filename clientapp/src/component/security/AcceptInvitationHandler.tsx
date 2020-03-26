import {default as React, FunctionComponent, useEffect} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {PARAMS} from '../../constants/links';
import {container} from 'tsyringe';
import {RepositoryInvitationActions} from '../../store/repository/invitations/repositoryInvitationActions';
import FullPageLoadingView from "../common/FullPageLoadingView";
import {securityService} from "../../service/securityService";

interface AcceptInvitationHandlerProps {

}

const securityServiceIns = container.resolve(securityService);

const AcceptInvitationHandler: FunctionComponent<AcceptInvitationHandlerProps> = (props) => {
    const match = useRouteMatch();

    const code = match.params[PARAMS.INVITATION_CODE];

    const actions = container.resolve(RepositoryInvitationActions);

    useEffect(() => actions.acceptInvitation.dispatch(code), []);

    return <FullPageLoadingView/>;
};
export default AcceptInvitationHandler;