import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {SourceTranslationsDTO} from "../../service/response.types";
import {Box, Checkbox, IconButton, makeStyles, Theme, Tooltip} from "@material-ui/core";
import {TableCell} from "./TableCell";
import {SourceCell} from "./SourceCell";
import {TranslationCell} from "./TranslationCell";
import {grey} from "@material-ui/core/colors";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {TranslationListContext} from "./TtranslationsGridContextProvider";
import {createStyles} from "@material-ui/core/styles";

export interface TranslationProps {
    data: SourceTranslationsDTO
}

export type RowContextType = {
    data: SourceTranslationsDTO,
    lastRendered: number,
}

export const RowContext = React.createContext<RowContextType>({data: null, lastRendered: 0});

const useStyles = makeStyles((theme: Theme) => createStyles({
    moreButton: {
        opacity: "0.8",
        padding: 0,
    },
    lineBox: {
        borderBottom: "1px solid " + grey[100],
        '&:last-child': {
            borderBottom: "none"
        }
    }
}));

export const TranslationsRow: FunctionComponent<TranslationProps> = (props) => {
    const classes = useStyles({});

    const listContext = useContext(TranslationListContext);

    const contextValue: RowContextType = {
        lastRendered: 0,
        data: props.data,
    };

    return (
        <Box display="flex" className={classes.lineBox}>
            <RowContext.Provider value={contextValue}>
                <Box display="flex" alignItems="center">
                    <Checkbox onChange={() => listContext.toggleSourceChecked(contextValue.data.id)}
                              checked={listContext.isSourceChecked(contextValue.data.id)}/>
                </Box>
                <Box display="flex" flexGrow={1} minWidth={0}>
                    <TableCell>
                        <SourceCell/>
                    </TableCell>

                    {listContext.listLanguages.map(k =>
                        <TableCell key={k}>
                            <TranslationCell abbreviation={k}/>
                        </TableCell>
                    )}
                </Box>
                {/*<Box display="flex" alignItems="center">*/}
                {/*    <IconButton className={classes.moreButton}>*/}
                {/*        <Tooltip title="Open detail">*/}
                {/*            <OpenInNewIcon/>*/}
                {/*        </Tooltip>*/}
                {/*    </IconButton>*/}
                {/*</Box>*/}
            </RowContext.Provider>
        </Box>
    )
};