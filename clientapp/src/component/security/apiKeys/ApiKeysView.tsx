import {default as React, FunctionComponent, useEffect} from 'react';
import {BaseView} from '../../views/BaseView';
import {container} from 'tsyringe';
import {UserApiKeysActions} from "../../../store/api_keys/UserApiKeysActions";
import {DashboardPage} from "../../layout/DashboardPage";
import {Alert} from "../../common/Alert";
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {LINKS, PARAMS} from "../../../constants/links";
import {FabAddButtonLink} from "../../common/buttons/FabAddButtonLink";
import {FormDialog} from "./FormDialog";
import {ApiKeysList} from "./ApiKeysList";

export const ApiKeysView: FunctionComponent = () => {

    const actions = container.resolve(UserApiKeysActions);

    let list = actions.useSelector(state => state.loadables.list);

    useEffect(() => {
        if (!list.loading && !list.loaded) {
            actions.loadableActions.list.dispatch();
        }
    }, [list.loaded]);

    const EditForm = () => (
        <>
            {list.loaded && (
                <FormDialog
                    editKey={list.data.find((key) => key.id === parseInt(useRouteMatch().params[PARAMS.API_KEY_ID]))}
                />
            )}
        </>
    );

    //reset loadables after success delete action
    let deleteLoadable = actions.useSelector(state => state.loadables.delete);
    useEffect(() => {
        if (deleteLoadable.loaded) {
            actions.loadableReset.delete.dispatch();
            actions.loadableReset.list.dispatch()
        }
    }, [deleteLoadable.loaded]);

    return (
        <DashboardPage>
            <BaseView title="My api keys" xs={12} md={10} lg={8}
                      loading={list.loading}>
                {() => (
                    <>
                        {
                            list.loaded && (!list.data.length ?
                                <Alert severity="info">No api keys yet!</Alert> :
                                <ApiKeysList data={list.data}/>)
                        }
                        <FabAddButtonLink to={LINKS.USER_API_KEYS_GENERATE.build()}/>
                    </>
                )}
            </BaseView>
            <Switch>
                <Route exact path={LINKS.USER_API_KEYS_EDIT.template}>
                    <EditForm/>
                </Route>
                <Route exact path={LINKS.USER_API_KEYS_GENERATE.template}>
                    <FormDialog/>
                </Route>
            </Switch>
        </DashboardPage>
    );
};
