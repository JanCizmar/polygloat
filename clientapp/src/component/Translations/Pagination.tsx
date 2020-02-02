import * as React from 'react';
import {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Box, TablePagination, TextField} from "@material-ui/core";
import {TranslationListContext} from "./TranslationsGrid";
import Paper from "@material-ui/core/Paper";

export const Pagination: FunctionComponent = (props) => {
    const listContext = useContext(TranslationListContext);

    const [perPage, setPerPage] = useState(listContext.defaultPerPage);
    const [page, setPage] = useState(0);

    const onPerPageChange = (pp) => {
        setPerPage(pp);
        setPage(0);
        listContext.loadData(null, pp, 0);
    };

    const onPageChange = (p) => {
        setPage(p);
        listContext.loadData(null, perPage, p * perPage);
    };


    return (
        <Box mt={3}>
            <Paper>
                <Box display="flex" justifyContent="flex-end">
                    <TablePagination rowsPerPageOptions={[10, 20, 30, 40, 50]}
                                     count={listContext.listLoadable.data.paginationMeta.allCount}
                                     onChangePage={(_, p) => onPageChange(p)}
                                     page={page}
                                     onChangeRowsPerPage={(e) => onPerPageChange(e.target.value)}
                                     rowsPerPage={perPage}/>
                </Box>
            </Paper>
        </Box>
    );
};