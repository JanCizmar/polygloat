import {default as React, FunctionComponent, useEffect} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {LINKS, PARAMS} from '../../../../constants/links';
import {RepositoryPage} from '../RepositoryPage';
import {Button, TextField} from '@material-ui/core';
import {BaseView} from '../../BaseView';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../store';
import {container} from 'tsyringe';
import {RepositoryInvitationActions} from '../../../../store/repository/invitations/repositoryInvitationActions';
import {Select} from '../../../common/form/fields/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {repositoryPermissionTypes} from '../../../../constants/repositoryPermissionTypes';
import {StandardForm} from '../../../common/form/StandardForm';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {BoxLoading} from '../../../common/BoxLoading';

interface RepositoryInviteVIewProps {

}

const actions = container.resolve(RepositoryInvitationActions);

export const RepositoryInviteView: FunctionComponent<RepositoryInviteVIewProps> = (props) => {

    let match = useRouteMatch();
    const repositoryId = match.params[PARAMS.REPOSITORY_ID];

    let state = useSelector((state: AppState) => state.repositoryInvitation);

    useEffect(() => {
        actions.loadableActions.list.dispatch(repositoryId);
    }, [state.invitationCode]);

    return (
        <RepositoryPage>
            <BaseView title="Invite user" xs={12} md={8} lg={6}>
                {() => (
                    <>
                        <StandardForm loading={state.invitationLoading}

                                      submitButtons={
                                          <Button variant="contained" color="primary" type="submit" size="large">
                                              Generate invitation link
                                          </Button>}

                                      onSubmit={v => actions.generateCode.dispatch(repositoryId, v.type)} initialValues={{type: 'MANAGE'}}>

                            <Select label="Invited user can" name="type" fullWidth>
                                {Object.keys(repositoryPermissionTypes).map(k =>
                                    <MenuItem key={k} value={k}>{repositoryPermissionTypes[k]}</MenuItem>)}
                            </Select>
                        </StandardForm>

                        {state.invitationCode &&
                        <Box mt={2}>
                            <TextField fullWidth multiline InputProps={{
                                readOnly: true,
                            }} value={LINKS.ACCEPT_INVITATION.buildWithOrigin({[PARAMS.INVITATION_CODE]: state.invitationCode})}
                                       label="Invitation link"/>
                        </Box>}

                        {state.loadables.list.loading && <BoxLoading/> || (state.loadables.list.data && !!state.loadables.list.data.length &&
                            <Box mt={4}>
                                <Typography variant="h6">Active invitation codes</Typography>
                                <List>
                                    {state.loadables.list.data.map(i => (
                                        <ListItem key={i.id}>
                                            <ListItemText>
                                                {i.code.substr(0, 10)}...{i.code.substr(i.code.length - 10, 10)}
                                                &nbsp;[<i>permission: {i.type}</i>]
                                            </ListItemText>
                                            <ListItemSecondaryAction>
                                                <Button color="secondary" onClick={() => actions.loadableActions.delete.dispatch(i.id)}>Cancel</Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>)}
                    </>)}
            </BaseView>
        </RepositoryPage>
    );
};
