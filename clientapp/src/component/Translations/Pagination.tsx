import * as React from 'react';
import {FunctionComponent, useContext, useState} from 'react';
import {Box, TablePagination} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {TranslationListContext} from "./TtranslationsGridContextProvider";

export const Pagination: FunctionComponent = (props) => {
    const listContext = useContext(TranslationListContext);

    const [perPage, setPerPage] = useState(listContext.perPage);
    const [page, setPage] = useState(0);

    const onPerPageChange = (pp) => {
        setPerPage(pp);
        setPage(0);
        listContext.loadData(listContext.listLoadable.data.params.search, pp, 0);
    };

    const onPageChange = (p) => {
        setPage(p);
        listContext.loadData(listContext.listLoadable.data.params.search, perPage, p * perPage);
    };


    return (
        <Box mt={3}>
            <Paper>
                <Box display="flex" justifyContent="flex-end">
                    <TablePagination component={Box} rowsPerPageOptions={[10, 20, 30, 40, 50]}
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