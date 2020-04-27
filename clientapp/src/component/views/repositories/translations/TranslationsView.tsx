import * as React from 'react';
import {RepositoryPage} from '../RepositoryPage';
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
