import {default as React, FunctionComponent, useEffect} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {PARAMS} from '../../../../constants/links';
import {RepositoryPage} from '../RepositoryPage';
import {BaseView} from '../../BaseView';
import {Box, Button} from "@material-ui/core";
import {container} from "tsyringe";
import {ImportExportActions} from "../../../../store/repository/ImportExportActions";
import {useSelector} from "react-redux";
import {AppState} from "../../../../store";
import {useRepository} from "../../../../hooks/useRepository";

const actions = container.resolve(ImportExportActions);

export const ExportView: FunctionComponent = () => {
    const match = useRouteMatch();
    const repository = useRepository();
    const repositoryId = match.params[PARAMS.REPOSITORY_ID];
    const state = useSelector((state: AppState) => state.importExport.loadables.export);

    useEffect(() => {
        if (state.loaded) {
            const url = URL.createObjectURL(state.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = repository.name + ".zip";
            a.click();
            actions.loadableReset.export.dispatch();
        }
    }, [state.loading, state.loaded]);

    useEffect(() => () => {
        actions.loadableReset.export.dispatch();
    }, []);

    const onJsonExport = () => {
        actions.loadableActions.export.dispatch(repositoryId);
    };

    return (
        <RepositoryPage>
            <BaseView title="Export translations" xs={12} md={10} lg={8}>
                <Box mt={2}>
                    <Button component="a" variant="outlined" color="primary" onClick={onJsonExport}>Export as zip of .json files</Button>
                </Box>
            </BaseView>
        </RepositoryPage>
    );
};
