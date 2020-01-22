import * as React from 'react';
import {useEffect} from 'react';
import {ListItem} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {connect} from 'react-redux';
import {AppState} from '../../../../store';
import {container} from 'tsyringe';
import {LanguageDTO} from '../../../../service/response.types';
import {LINKS, PARAMS} from '../../../../constants/links';
import {FabAddButtonLink} from '../../../common/buttons/FabAddButtonLink';
import List from '@material-ui/core/List';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import {SettingsIconButton} from '../../../common/buttons/SettingsIconButton';
import {Link, useRouteMatch} from 'react-router-dom';
import {RepositoryPage} from '../RepositoryPage';
import {LanguageActions} from '../../../../store/languages/LanguageActions';
import {BaseView} from '../../BaseView';
import Grid from '@material-ui/core/Grid';

const actions = container.resolve(LanguageActions);

interface Props {
    languages: LanguageDTO[];
    loading: boolean;
}

export const LanguageListView = connect((state: AppState) =>
    ({languages: state.languages.languages, loading: state.languages.languagesLoading}))(
    (props: Props) => {

        const match = useRouteMatch();
        const repositoryId = match.params[PARAMS.REPOSITORY_ID];

        useEffect(() => {
            actions.loadLanguages.dispatch(repositoryId);
        }, []);

        return (
            <RepositoryPage id={repositoryId}>
                <BaseView title="Languages" loading={props.loading}>
                    {() => (
                        <Grid item xs={12} md={6} lg={3}>
                            <List>
                                {props.languages.map(l => (
                                    <ListItem key={l.id}>
                                        <ListItemText>
                                            {l.name} [{l.abbreviation}]
                                        </ListItemText>
                                        <ListItemSecondaryAction>
                                            <Link to={LINKS.REPOSITORY_LANGUAGE_EDIT.build(
                                                {
                                                    [PARAMS.REPOSITORY_ID]: repositoryId,
                                                    [PARAMS.LANGUAGE_ID]: l.id
                                                }
                                            )}>
                                                <SettingsIconButton/>
                                            </Link>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                            <Box display="flex" flexDirection="column" alignItems="flex-end" pr={2}>
                                <FabAddButtonLink to=""/>
                            </Box>
                        </Grid>
                    )}
                </BaseView>
            </RepositoryPage>
        );
    });
