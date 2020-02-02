import * as React from 'react';
import {FunctionComponent, useContext} from "react";
import {Box, Theme} from "@material-ui/core";
import {RowContext} from "./SourceTranslations";
import {createStyles} from "@material-ui/core/styles";
import {TranslationListContext} from "./TranslationsGrid";

export interface TranslationsTableCellProps {

}

const useStyles = createStyles((theme: Theme) => {

});

export const TableCell: FunctionComponent<TranslationsTableCellProps> = (props) => {
    let rowContext = useContext(RowContext);
    let listContext = useContext(TranslationListContext);

    const width = listContext.cellWidths[rowContext.lastRendered];

    rowContext.lastRendered++;

    return (
        <Box width={width+"%"} p={0.5}>
            {props.children}
        </Box>
    )
};