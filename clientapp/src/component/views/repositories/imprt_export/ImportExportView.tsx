import {ChangeEvent, default as React, FunctionComponent, useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {PARAMS} from '../../../../constants/links';
import {RepositoryPage} from '../RepositoryPage';
import {Box, Button, FormHelperText, Input, LinearProgress, Paper, Typography} from '@material-ui/core';
import {BaseView} from '../../BaseView';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../store';

import {StandardForm} from "../../../common/form/StandardForm";
import {TextField} from "../../../common/form/fields/TextField";
import {object, string} from "yup";
import {ImportExportActions} from "../../../../store/repository/ImportExportActions";
import {container} from "tsyringe";

type SubtreeType = { [key: string]: string | object };

export const ImportExportView: FunctionComponent = () => {
    let match = useRouteMatch();

    const repositoryId = match.params[PARAMS.REPOSITORY_ID];

    let state = useSelector((state: AppState) => state.importExport.loadables.import);

    const actions = container.resolve(ImportExportActions);

    const [data, setData] = useState(null);
    const [suggestedName, setSuggestedName] = useState("");

    const fileSelected = (event: ChangeEvent) => {
        let target = event.target as HTMLInputElement;
        if (target.files.length > 0) {
            const file = target.files[0];
            let fileReader = new FileReader();
            fileReader.onloadend = (e) => {
                const target = e.target as FileReader;
                const indexOfDot = file.name.indexOf(".");
                if (indexOfDot > -1) {
                    setSuggestedName(file.name.substr(0, indexOfDot))
                }
                const data = parseData(target.result as string);
                setData(data);
            };
            fileReader.readAsText(file);
        }
    };


    const parseSubTree = (path: string[], subtree: SubtreeType): { [key: string]: string } => {
        return Object.entries(subtree).reduce((result, [key, value]) => {
            const subPath = [...path, key];
            if (typeof value === "object") {
                return {...result, ...parseSubTree(subPath, value as SubtreeType)};
            }
            if (typeof value === "string") {
                return {...result, [subPath.join(".")]: value}
            }
            //todo handle errors here!
            return result;
        }, {});
    };

    const parseData = (json: string) => {
        const data = JSON.parse(json);
        return parseSubTree([], data);
    };


    const entries = data && Object.entries(data);

    const Line = ([source, translation]) => <Box>{source}: {translation}</Box>;

    const Preview = () => {

        const [expanded, setExpanded] = useState(false);

        const expand = () => {
            setExpanded(true);
        };

        return (
            <React.Fragment>
                <Box color="text.disabled">
                    {expanded
                        ?
                        <>
                            {entries.map(Line)}
                        </>
                        :
                        <>
                            {entries.slice(0, 10).map(Line)}
                            {entries.length > 10 &&
                            <>
                                <Box justifyItems="center"><Button onClick={() => expand()}>...</Button></Box>
                                {
                                    //render last item
                                    entries.slice(entries.length - 1).map(Line)}
                            </>}
                        </>}
                </Box>
            </React.Fragment>)
    };

    useEffect(() => {
        if (state.loaded) {
            actions.loadableReset.import.dispatch();
        }
    }, [state.loaded]);

    const onImportSubmit = (value) => {
        actions.loadableActions.import.dispatch(repositoryId, {...value, data});
    };

    return (
        <RepositoryPage>
            <BaseView title="Import/Export translations" xs={12} md={10} lg={8}>
                <h2>Import translations</h2>
                {
                    (data &&
                        <>
                            <Preview/>
                            <Box color="success.main" fontSize={21} fontWeight="400" mt={1}>Successfully loaded {entries.length} items.</Box>
                            {!state.loaded &&
                            <>
                                <StandardForm initialValues={{languageAbbreviation: suggestedName}}
                                              validationSchema={object().shape({
                                                  languageAbbreviation: string().required()
                                              })}
                                              onSubmit={onImportSubmit}
                                              onCancel={() => setData(null)}
                                              loading={state.loading}
                                              submitButtonInner="Do import!">
                                    <TextField label="Language abbreviation" name={"languageAbbreviation"}/>
                                </StandardForm>
                                {state.loading &&
                                <>
                                    <Box justifyContent="center" display="flex" fontSize={20} color="text.secondary">Importing</Box>
                                    <LinearProgress/>
                                </>}
                            </>
                            }
                        </>
                    )
                    ||
                    <>
                        <FormHelperText>To import translations select json file.</FormHelperText>
                        <Input type="file" onChange={fileSelected}/>
                    </>
                }
            </BaseView>
        </RepositoryPage>
    );
};
