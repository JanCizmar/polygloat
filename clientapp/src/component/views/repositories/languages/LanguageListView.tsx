import * as React from 'react';
import {useEffect} from 'react';
import {ListItem} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {connect} from 'react-redux';
import {AppState} from '../../../../store';
import {container} from 'tsyringe';
import {LanguageResponseType} from '../../../../service/response.types';
import {LINKS, PARAMS} from '../../../../constants/links';
import {FabAddButton} from '../../../common/buttons/FabAddButton';
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
    languages: LanguageResponseType[];
    loading: boolean;
}

export const LanguageListView = connect((state: AppState) =>
    ({languages: state.languages.languages, loading: state.languages.languagesLoading}))(
    (props: Props) => {

        useEffect(() => {
            actions.loadLanguages.dispatch();
        }, []);

        const match = useRouteMatch();
        const repositoryId = match.params[PARAMS.REPOSITORY_ID];


        return (
            <RepositoryPage id={repositoryId}>
                <BaseView title="Languages" loading={props.loading}>
                    {() => (
                        <Grid xs={12} md={6} lg={3}>
                            <List>
                                {props.languages.map(l => (
                                    <ListItem>
                                        <ListItemText>
                                            {l.name} [{l.abbreviation}]
                                        </ListItemText>
                                        <ListItemSecondaryAction>
                                            <Link to={LINKS.REPOSITORY_LANGUAGES_EDIT.build(
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
                                <FabAddButton/>
                            </Box>
                        </Grid>
                    )}
                </BaseView>
            </RepositoryPage>
        );
    });
