import {DashboardPage} from '../../layout/DashboardPage';
import * as React from 'react';
import {useEffect} from 'react';
import Box from '@material-ui/core/Box';
import {connect} from 'react-redux';
import {AppState} from '../../../store';
import {container} from 'tsyringe';
import {RepositoryActions} from '../../../store/repository/RepositoryActions';
import {RepositoryDTO} from '../../../service/response.types';
import {LINKS, PARAMS} from '../../../constants/links';
import {FabAddButtonLink} from '../../common/buttons/FabAddButtonLink';
import List from '@material-ui/core/List';
import {ListItemLink} from '../../common/list/ListItemLink';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import {SettingsIconButton} from '../../common/buttons/SettingsIconButton';
import {Link} from 'react-router-dom';
import {BaseView} from '../BaseView';

const actions = container.resolve(RepositoryActions);

interface Props {
    repositories: RepositoryDTO[];
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
                <BaseView title="Repositories" loading={loading}>
                    {() => (
                        <>
                            <List>
                                {repositories.map(r =>
                                    <ListItemLink
                                        key={r.id}
                                        to={LINKS.REPOSITORY_TRANSLATIONS.build({[PARAMS.REPOSITORY_ID]: r.id})}>

                                        <ListItemText>
                                            {r.name}
                                        </ListItemText>

                                        <ListItemSecondaryAction>
                                            <Link to={LINKS.REPOSITORY_EDIT.build({[PARAMS.REPOSITORY_ID]: r.id})}>
                                                <SettingsIconButton/>
                                            </Link>
                                        </ListItemSecondaryAction>

                                    </ListItemLink>)}
                            </List>
                            <Box display="flex" flexDirection="column" alignItems="flex-end" pr={2}>
                                <FabAddButtonLink to={LINKS.REPOSITORY_ADD.build()}/>
                            </Box>
                        </>
                    )}
                </BaseView>
            </DashboardPage>
        );
    });

