import * as React from 'react';
import {FunctionComponent, useContext} from "react";
import {SourceTranslationsDTO} from "../../service/response.types";
import {Box, Theme} from "@material-ui/core";
import {createStyles} from "@material-ui/core/styles";
import {number, object} from "yup";
import {TableCell} from "./TableCell";
import {TranslationListContext} from "./TranslationsGrid";
import {SourceCell} from "./SourceCell";
import {TranslationCell} from "./TranslationCell";
import {grey} from "@material-ui/core/colors";

export interface TranslationProps {
    data: SourceTranslationsDTO
}

export const RowContext = React.createContext<{
    data: SourceTranslationsDTO,
    lastRendered: number,
}>({data: null, lastRendered: 0});

export const SourceTranslations: FunctionComponent<TranslationProps> = (props) => {

    const listContext = useContext(TranslationListContext);


    const contextValue = {
        lastRendered: 0,
        data: props.data
    };

    return (
        <Box display="flex" minHeight={40} style={{borderBottom: "1px solid " + grey[100]}}>
            <RowContext.Provider value={contextValue}>
                <TableCell>
                    <SourceCell/>
                </TableCell>

                {listContext.listLanguages.map(k =>
                    <TableCell>
                        <TranslationCell abbreviation={k}/>
                    </TableCell>
                )}
            </RowContext.Provider>
        </Box>
    )
};