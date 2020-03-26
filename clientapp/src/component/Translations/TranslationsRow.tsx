import * as React from 'react';
import {FunctionComponent, useContext} from 'react';
import {SourceTranslationsDTO} from "../../service/response.types";
import {Box, Checkbox, Theme} from "@material-ui/core";
import {TableCell} from "./TableCell";
import {SourceCell} from "./SourceCell";
import {TranslationCell} from "./TranslationCell";
import {grey} from "@material-ui/core/colors";
import {TranslationListContext} from "./TtranslationsGridContextProvider";
import {createStyles, makeStyles} from "@material-ui/core/styles";

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
                {listContext.showCheckBoxes &&
                <Box display="flex" alignItems="center" justifyContent="center" style={{width: 40}}>
                    <Checkbox onChange={() => listContext.toggleSourceChecked(contextValue.data.id)}
                              checked={listContext.isSourceChecked(contextValue.data.id)} size="small" style={{padding: 3}}/>
                </Box>}
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