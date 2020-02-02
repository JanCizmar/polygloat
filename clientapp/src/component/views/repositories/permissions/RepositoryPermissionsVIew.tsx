import {default as React, FunctionComponent, useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {PARAMS} from '../../../../constants/links';
import {RepositoryPage} from '../RepositoryPage';
import {Button} from '@material-ui/core';
import {BaseView} from '../../BaseView';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../store';
import {container} from 'tsyringe';
import {Select} from '../../../common/form/fields/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {repositoryPermissionTypes} from '../../../../constants/repositoryPermissionTypes';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {RepositoryPermissionActions} from '../../../../store/repository/invitations/repositoryPermissionActions';
import EditIcon from '@material-ui/icons/Edit';
import {MicroForm} from '../../../common/form/MicroForm';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import {useConfirmation} from '../../../../hooks/useConfirmation';
import {useUser} from "../../../../hooks/useUser";

const PermissionSelect = () => (
    <Select name="type" className={null}>
        {Object.keys(repositoryPermissionTypes).map(k =>
            <MenuItem key={k} value={k}>{repositoryPermissionTypes[k]}</MenuItem>)}
    </Select>
);

export const RepositoryPermissionsView: FunctionComponent = () => {

    const actions = container.resolve(RepositoryPermissionActions);

    let match = useRouteMatch();
    const repositoryId = match.params[PARAMS.REPOSITORY_ID];

    let state = useSelector((state: AppState) => state.repositoryPermission);

    useSelector((state: AppState) => state.global.security.jwtToken);

    useEffect(() => {
        if (!state.loadables.list.loading) {
            actions.loadableActions.list.dispatch(repositoryId);
        }
    }, []);


    let confirmation = useConfirmation({title: 'Revoke access'});

    const userData = useUser();

    const [editingId, setEditingId] = useState(null);

    return (
        <RepositoryPage>
            <BaseView title="Edit repository permissions" xs={12} md={10} lg={8}
                      loading={state.loadables.list.loading}>
                {() => (
                    <List>
                        {state.loadables.list.data && state.loadables.list.data.map(p => (
                            <ListItem key={p.id}>
                                <MicroForm initialValues={{type: p.type}} onSubmit={() => {
                                }}>
                                    <ListItemText>
                                        {p.userFullName} | {p.username}
                                        &nbsp;[ <i>permission: {p.id === editingId &&
                                    <PermissionSelect/> || p.type}</i> ]
                                    </ListItemText>
                                    {userData && userData.id !== p.userId &&
                                    <ListItemSecondaryAction>
                                        {p.id === editingId &&
                                        <>
                                            <Button color="primary">
                                                <CheckIcon/>
                                            </Button>
                                            <Button onClick={() => setEditingId(null)}><CloseIcon/></Button>
                                        </>
                                        ||
                                        <>
                                            <Button color="primary" onClick={() => setEditingId(p.id)}>
                                                <EditIcon/>
                                            </Button>
                                            <Button color="secondary" onClick={
                                                () => confirmation({
                                                    message: `Do you really want to revoke access for user ${p.userFullName}?`,
                                                    onConfirm: () => actions.loadableActions.delete.dispatch(p.id)
                                                })
                                            }>Revoke</Button>
                                        </>
                                        }
                                    </ListItemSecondaryAction>}
                                </MicroForm>
                            </ListItem>
                        ))}
                    </List>
                )}
            </BaseView>
        </RepositoryPage>
    );
};
