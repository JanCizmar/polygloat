import * as React from 'react';
import {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {AppState} from '../../../../store';
import {container} from 'tsyringe';
import {LanguageDTO} from '../../../../service/response.types';
import {LINKS, PARAMS} from '../../../../constants/links';
import {Redirect, useRouteMatch} from 'react-router-dom';
import * as Yup from 'yup';
import {TextField} from '../../../common/form/fields/TextField';
import {RepositoryPage} from '../RepositoryPage';
import {BaseFormView} from '../../BaseFormView';
import {LanguageActions} from '../../../../store/languages/LanguageActions';

const actions = container.resolve(LanguageActions);

interface Props {
    languages: LanguageDTO[];
    loading: boolean;
    saving: boolean,
    saved: boolean
}

export const LanguageEditView = connect((state: AppState) =>
    ({
        languages: state.languages.languages,
        loading: state.languages.languagesLoading,
        saving: state.languages.languageSaving,
        saved: state.languages.languageSaved,
    }))(
    ({languages, loading, saving, saved}: Props) => {

        let match = useRouteMatch();

        const repositoryId = match.params[PARAMS.REPOSITORY_ID];
        const languageId = match.params[PARAMS.LANGUAGE_ID];

        const language = languages !== undefined ? languages.find(r => r.id === parseInt(languageId)) : null;

        const [cancelled, setCancelled] = useState(false);

        useEffect(() => {
            if (languages === undefined) {
                actions.loadLanguages.dispatch(repositoryId);
            }
        }, [languages]);

        const onSubmit = (values) => {
            actions.editLanguage.dispatch(repositoryId, languageId, values);
        };

        if (saved || cancelled) {
            actions.resetEdit.dispatch();
            return <Redirect to={LINKS.REPOSITORY_LANGUAGES.build({[PARAMS.REPOSITORY_ID]: repositoryId})}/>;
        }

        return (
            <RepositoryPage id={repositoryId}>
                <BaseFormView
                    lg={8} md={10} xs={12}
                    title={'Edit repository'}
                    initialValues={!loading && {...language}}
                    onSubmit={onSubmit}
                    onCancel={() => setCancelled(true)}
                    saving={saving}
                    loading={loading}
                    validationSchema={Yup.object().shape(
                        {
                            name: Yup.string().required().max(100),
                            abbreviation: Yup.string().required().max(20)
                        })}
                >
                    <>
                        <TextField label="Name" name="name" required={true}/>
                        <TextField label="Abbreviation" name="abbreviation" required={true}/>
                    </>
                </BaseFormView>
            </RepositoryPage>
        );
    });
