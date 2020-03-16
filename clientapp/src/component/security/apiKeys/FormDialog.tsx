import {useRedirect} from "../../../hooks/useRedirect";
import {LINKS} from "../../../constants/links";
import {Box, Dialog, DialogContent, DialogTitle, MenuItem} from "@material-ui/core";
import {StandardForm} from "../../common/form/StandardForm";
import {Select} from "../../common/form/fields/Select";
import {default as React, FunctionComponent, useEffect, useState} from "react";
import {container} from "tsyringe";
import {UserApiKeysActions} from "../../../store/api_keys/UserApiKeysActions";
import {BoxLoading} from "../../common/BoxLoading";
import * as Yup from 'yup';
import {FormikProps} from "formik";
import {CheckBoxGroupMultiSelect} from "../../common/form/fields/CheckBoxGroupMultiSelect";
import {ApiKeyDTO} from "../../../service/response.types";
import {EditApiKeyDTO} from "../../../service/request.types";

interface Value {
    scopes: string[],
    repositoryId?: number
}

interface Props {
    editKey?: ApiKeyDTO
    loading?: boolean
}

export const FormDialog: FunctionComponent<Props> = (props) => {
    const onDialogClose = () => useRedirect(LINKS.USER_API_KEYS);

    const actions = container.resolve(UserApiKeysActions);

    let repositories = actions.useSelector(s => s.loadables.repositories);
    let scopes = actions.useSelector(s => s.loadables.scopes);
    let editLoadable = actions.useSelector(s => s.loadables.edit);
    let generateLoadable = actions.useSelector(s => s.loadables.generateApiKey);


    useEffect(() => {
        actions.loadableActions.repositories.dispatch();
        actions.loadableActions.scopes.dispatch();
    }, []);

    const getAvailableScopes = (repositoryId: number): Set<string> => {
        return new Set(scopes.data[repositories.data.find(r => r.id === repositoryId).permissionType]);
    };

    const onSubmit = (value) => {
        if (props.editKey) {
            actions.loadableActions.edit.dispatch(({id: props.editKey.id, scopes: Array.from(value.scopes)} as EditApiKeyDTO));
        } else {
            actions.loadableActions.generateApiKey.dispatch(({...value, scopes: Array.from(value.scopes)} as Value));
        }
    };

    useEffect(() => {
        if (editLoadable.loaded) {
            actions.loadableReset.edit.dispatch();
            actions.loadableReset.list.dispatch();
            useRedirect(LINKS.USER_API_KEYS);
        }
    }, [editLoadable.loaded]);

    useEffect(() => {
        if (generateLoadable.loaded) {
            actions.loadableReset.generateApiKey.dispatch();
            actions.loadableReset.list.dispatch();
            useRedirect(LINKS.USER_API_KEYS);
        }
    }, [generateLoadable.loaded]);

    const getInitialValues = () => {
        if (props.editKey) {
            return {
                repositoryId: props.editKey.repositoryId,
                //check all scopes by default
                scopes: new Set(props.editKey.scopes)
            }
        }

        return {
            repositoryId: repositories.data[0].id,
            //check all scopes checked by default
            scopes: getAvailableScopes(repositories.data[0].id)
        }
    };

    const validationSchema = Yup.object().shape({
        repositoryId: props.editKey && props.editKey.repositoryId && Yup.number().required(),
        scopes: Yup.mixed().test(
            "is-set",
            'Set at least one scope',
            v => !!(v as Set<string>).size
        )
    });

    return (
        <Dialog open={true} onClose={onDialogClose} fullWidth maxWidth={"xs"}>
            <DialogTitle>Generate api key</DialogTitle>
            <DialogContent>
                {(repositories.loading || scopes.loading || props.loading) && <BoxLoading/>}
                {(repositories.loaded && scopes.loaded) &&
                <StandardForm onSubmit={onSubmit}
                              onCancel={() => onDialogClose()}
                              initialValues={getInitialValues()}
                              validationSchema={validationSchema}
                              submitButtonInner={props.editKey ? "Save" : "Generate"}
                >
                    {(formikProps: FormikProps<Value>) => <>
                        {!props.editKey && <Select fullWidth name="repositoryId"
                                                   label="Repository"
                                                   renderValue={v => repositories.data.find(r => r.id === v).name}>
                            {repositories.data.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
                        </Select>}
                        <Box mt={2}>
                            <CheckBoxGroupMultiSelect label="Scopes" name="scopes" options={getAvailableScopes(formikProps.values.repositoryId)}/>
                        </Box>
                    </>}
                </StandardForm>
                }
            </DialogContent>
        </Dialog>)
};