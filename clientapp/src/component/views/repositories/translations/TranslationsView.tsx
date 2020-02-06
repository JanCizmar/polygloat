import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import {RepositoryPage} from '../RepositoryPage';
import {Route, Switch} from 'react-router-dom';
import {useRepository} from "../../../../hooks/useRepository";
import {FabAddButtonLink} from "../../../common/buttons/FabAddButtonLink";
import {LINKS, PARAMS} from "../../../../constants/links";
import Box from "@material-ui/core/Box";
import {TranslationCreationDialog} from "../../../Translations/TranslationCreationDialog";
import {RepositoryLanguageProvider} from "../../../../hooks/RepositoryLanguagesProvider";
import {TranslationsGrid} from "../../../Translations/TranslationsGrid";

//const TranslationsTable = React.lazy(() => import(/* webpackChunkName: "translationsTable" */'../../../Translations/TranslationsTable'));

export default function TranslationView() {
    let repositoryDTO = useRepository();

    return (
        <RepositoryPage fullWidth={true}>
            <RepositoryLanguageProvider>
                <Grid lg={12}>
                    <TranslationsGrid/>
                    <Box display="flex" justifyContent="flex-end" mt={3}>
                        <FabAddButtonLink to={LINKS.REPOSITORY_TRANSLATIONS_ADD.build({[PARAMS.REPOSITORY_ID]: repositoryDTO.id})}/>
                    </Box>
                    <Switch>
                        <Route path={LINKS.REPOSITORY_TRANSLATIONS_ADD.template}>
                            <TranslationCreationDialog/>
                        </Route>
                    </Switch>
                </Grid>
            </RepositoryLanguageProvider>
        </RepositoryPage>
    );
}
