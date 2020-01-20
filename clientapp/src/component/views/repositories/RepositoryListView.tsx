import {DashboardPage} from '../../layout/DashboardPage';
import * as React from 'react';
import {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import {Paper} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {connect} from 'react-redux';
import {AppState} from '../../../store';
import {container} from 'tsyringe';
import {RepositoryActions} from '../../../store/repository/RepositoryActions';
import {RepositoryResponse} from '../../../service/response.types';
import {LINKS, PARAMS} from '../../../constants/links';
import CircularProgress from '@material-ui/core/CircularProgress';
import {FabAddButton} from '../../common/buttons/FabAddButton';
import List from '@material-ui/core/List';
import {ListItemLink} from '../../common/list/ListItemLink';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import {SettingsIconButton} from '../../common/buttons/SettingsIconButton';
import {Link} from 'react-router-dom';

const actions = container.resolve(RepositoryActions);

interface Props {
    repositories: RepositoryResponse[];
    loading: boolean;
}

export const RepositoryListView = connect((state: AppState) =>
    ({repositories: state.repositories.repositories, loading: state.repositories.repositoriesLoading}))(
    ({repositories, loading}: Props) => {

        useEffect(() => {
            actions.loadRepositories.dispatch();
        }, []);

        const addRepository = () => {
            actions.addRepository.dispatch();
        };

        return (
            <DashboardPage>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper>
                        {!loading ?
                            <Box p={2}>
                                <h1>Repositories</h1>
                                {repositories.map(r =>
                                    <>
                                        <List>
                                            <ListItemLink to={LINKS.REPOSITORY_TRANSLATIONS.build({[PARAMS.REPOSITORY_ID]: r.id})}>
                                                <ListItemText>
                                                    {r.name}
                                                </ListItemText>
                                                <ListItemSecondaryAction>
                                                    <Link to={LINKS.REPOSITORY_EDIT.build({[PARAMS.REPOSITORY_ID]: r.id})}>
                                                        <SettingsIconButton/>
                                                    </Link>
                                                </ListItemSecondaryAction>
                                            </ListItemLink>
                                        </List>
                                    </>)}
                                <Box display="flex" flexDirection="column" alignItems="flex-end" pr={2}>
                                    <FabAddButton/>
                                </Box>
                            </Box>
                            :
                            <Box display="flex" alignItems="center" justifyContent="center" p={4}><CircularProgress/></Box>
                        }
                    </Paper>
                </Grid>
            </DashboardPage>
        );
    });
