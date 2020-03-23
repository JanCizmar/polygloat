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
import {Container} from "@material-ui/core";
import {TranslationGridContextProvider} from "../../../Translations/TtranslationsGridContextProvider";

export default function TranslationView() {
    return (
        <RepositoryPage fullWidth={true}>
            <RepositoryLanguageProvider>
                <Container maxWidth={false}>
                    <TranslationGridContextProvider>
                        <TranslationsGrid/>
                    </TranslationGridContextProvider>
                </Container>
            </RepositoryLanguageProvider>
        </RepositoryPage>
    );
}
