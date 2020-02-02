import * as React from "react";
import {FunctionComponent} from "react";
import {container} from "tsyringe";
import {RepositoryActions} from "../store/repository/RepositoryActions";
import {useSelector} from "react-redux";
import {AppState} from "../store";
import {GlobalError} from "../error/GlobalError";
import FullPageLoading from "../component/common/FullPageLoading";

const repositoryActions = container.resolve(RepositoryActions);

export const RepositoryProvider: FunctionComponent<{ id: number }> = (props) => {

    let repositoryDTOLoadable = useSelector((state: AppState) => state.repositories.loadables.repository);


    const isLoading = repositoryDTOLoadable.loading;
    const init = !repositoryDTOLoadable.data && !repositoryDTOLoadable.error && !isLoading;
    const idChanged = repositoryDTOLoadable.dispatchParams && repositoryDTOLoadable.dispatchParams[0] !== props.id;


    if (init || idChanged) {
        repositoryActions.loadableActions.repository.dispatch(props.id);
        return <FullPageLoading/>
    }

    if (repositoryDTOLoadable.loading) {
        return <FullPageLoading/>
    }

    if (repositoryDTOLoadable.data) {
        return (
            <>
                {props.children}
            </>
        );
    }

    throw new GlobalError("Unexpected error occurred", repositoryDTOLoadable.error.code || "Loadable error");

};