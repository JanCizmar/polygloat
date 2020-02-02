import {container} from 'tsyringe';
import {GlobalActions} from '../store/global/globalActions';
import {useSelector} from "react-redux";
import {AppState} from "../store";
import {useEffect} from "react";
import {useConfig} from "./useConfig";
import {UserDTO} from "../service/response.types";

const globalActions = container.resolve(GlobalActions);

export const useUser = (): UserDTO => {
    let userDTO = useSelector((state: AppState) => state.global.loadables.userData.data);
    let loadError = useSelector((state: AppState) => state.global.loadables.userData.error);
    let loading = useSelector((state: AppState) => state.global.loadables.userData.loading);
    let jwt = useSelector((state: AppState) => state.global.security.jwtToken);

    let allowPrivate = useSelector((state: AppState) => state.global.security.allowPrivate);

    useEffect(() => {
        if (!userDTO && !loading && !loadError && jwt) {
            globalActions.loadableActions.userData.dispatch();
        }
    }, [userDTO, loading, loadError, jwt]);

    if (loadError) {
        throw loadError;
    }

    if (!allowPrivate) {
        return null;
    }

    return userDTO;
};
