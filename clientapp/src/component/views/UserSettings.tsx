import {default as React, FunctionComponent, useEffect} from 'react';
import {container} from 'tsyringe';
import {TextField} from '../common/form/fields/TextField';
import {Validation} from "../../constants/GlobalValidationSchema";
import {BaseFormView} from "../views/BaseFormView";
import {SetPasswordFields} from "../security/SetPasswordFields";
import {UserActions} from "../../store/global/userActions";
import {UserUpdateDTO} from "../../service/request.types";
import {useSelector} from "react-redux";
import {AppState} from "../../store";
import {RedirectionActions} from "../../store/global/redirectionActions";
import {useHistory} from 'react-router-dom';
import {PossibleRepositoryPage} from "./PossibleRepositoryPage";

const actions = container.resolve(UserActions);
const userActions = container.resolve(UserActions);
const redirectActions = container.resolve(RedirectionActions);

export const UserSettings: FunctionComponent = () => {

    let saveLoadable = useSelector((state: AppState) => state.user.loadables.updateUser);
    let resourceLoadable = useSelector((state: AppState) => state.user.loadables.userData);

    useEffect(() => {
        if (saveLoadable.loaded) {
            userActions.loadableActions.userData.dispatch();
        }
    }, [saveLoadable.loading]);

    const history = useHistory();

    return (
        <PossibleRepositoryPage>
            <BaseFormView title="User settings" lg={6} md={8} xs={12} saveActionLoadable={saveLoadable} resourceLoadable={resourceLoadable}
                          initialValues={{password: '', passwordRepeat: '', name: resourceLoadable.data.name, email: resourceLoadable.data.username}}
                          validationSchema={Validation.USER_SETTINGS}
                          submitButtonInner={"Save"}
                          onCancel={() => history.goBack()}
                          onSubmit={(v: UserUpdateDTO) => {
                              if (!v.password) {
                                  delete v.password;
                              }
                              actions.loadableActions.updateUser.dispatch(v as UserUpdateDTO);
                          }}>
                <TextField name="name" label="Full name"/>
                <TextField name="email" label="E-mail"/>
                <SetPasswordFields/>
            </BaseFormView>
        </PossibleRepositoryPage>
    );
};