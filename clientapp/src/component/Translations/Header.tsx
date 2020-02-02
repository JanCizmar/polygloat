import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {Box} from "@material-ui/core";
import {TableCell} from "./TableCell";
import {TranslationListContext} from "./TranslationsGrid";
import {RowContext} from "./SourceTranslations";

export const Header: FunctionComponent = (props) => {

    const listContext = useContext(TranslationListContext);

    return (
        <Box display="flex" height={40}>

            <RowContext.Provider value={{data: null, lastRendered: 0}}>
                {listContext.headerCells.map(k =>
                    <TableCell>
                        {k}
                    </TableCell>
                )}
            </RowContext.Provider>
        </Box>
    )
};