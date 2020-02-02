import {container} from 'tsyringe';
import {GlobalActions} from '../store/global/globalActions';
import {useSelector} from "react-redux";
import {AppState} from "../store";
import {RemoteConfigurationDTO} from "../service/response.types";
import {GlobalError} from "../error/GlobalError";

export const useConfig = (): RemoteConfigurationDTO => {
    let loadable = useSelector((state: AppState) => state.global.loadables.remoteConfig);

    const actions = container.resolve(GlobalActions);

    if (loadable.error) {
        throw new GlobalError(loadable.error.code);
    }

    if (!loadable.data && !loadable.loading && !loadable.error) {
        actions.loadableActions.remoteConfig.dispatch();
    }

    return loadable.data;
};
