import {Action, ActionType, PromiseAction, StateModifier} from "./Action";
import {ErrorResponseDTO} from "../service/response.types";
import {Link} from "../constants/links";
import {AbstractActions} from "./AbstractActions";

export class LoadableDefinition<StateType extends StateWithLoadables<any>, PayloadType> {
    constructor(public payloadProvider: (...params: any[]) => Promise<any>, public then?: StateModifier<StateType, PayloadType>,
                public successMessage?: string, public redirectAfter?: Link) {
    }
}

export abstract class StateWithLoadables<ActionsType extends AbstractLoadableActions<any>> {
    loadables: { [K in keyof ActionsType['loadableDefinitions']]: Loadable<Parameters<ActionsType['loadableDefinitions'][K]['then']>[1]['payload']> };
}

export abstract class AbstractLoadableActions<StateType extends StateWithLoadables<any>> extends AbstractActions<StateType> {
    private _loadableActions;

    get initialState() {
        let loadables = {};
        for (let name in this.loadableDefinitions) {
            loadables[name] = createLoadable();
        }

        return {...this._initialState, loadables};
    }

    constructor(initialState) {
        super(initialState);
    }

    createLoadableDefinition<PayloadType>(payloadProvider: (...params: any[]) => Promise<PayloadType>,
                                          then?: StateModifier<StateType, PayloadType>,
                                          successMessage?: string,
                                          redirectAfter?: Link) {
        return new LoadableDefinition<StateType, PayloadType>(payloadProvider, then, successMessage, redirectAfter);
    }


    private createLoadableAction<PayloadType>(loadableName,
                                              payloadProvider: (...params: any[]) => Promise<any>,
                                              then?: StateModifier<StateType, PayloadType>, successMessage?: string, redirectAfter?: Link):
        PromiseAction<PayloadType, ErrorResponseDTO, StateType> {
        return this.createPromiseAction(loadableName.toUpperCase(), payloadProvider, successMessage, redirectAfter)
            .build.onPending((state, action) => {
                return {
                    ...state,
                    loadables: {
                        ...state.loadables,
                        [loadableName]: <Loadable<PayloadType>>{
                            ...state.loadables[loadableName],
                            loading: true,
                            errorParams: null,
                            dispatchParams: action.meta.params,
                            touched: true
                        }
                    },
                };
            }).build.onFullFilled((state, action) => {
                const newState = {
                    ...state,
                    loadables: {
                        ...state.loadables,
                        [loadableName]: <Loadable<PayloadType>>{
                            ...state.loadables[loadableName],
                            loading: false,
                            data: action.payload,
                            error: null,
                            dispatchParams: action.meta.params,
                            loaded: true
                        }
                    }
                };
                return typeof then === 'function' ? then(newState, action) : newState;
            })
            .build.onRejected((state, action) => {
                //some error already handled by service layer
                return {
                    ...state,
                    loadables: {
                        ...state.loadables,
                        [loadableName]: <Loadable<PayloadType>>{
                            ...state.loadables[loadableName],
                            loading: false,
                            data: null,
                            error: action.payload.__handled ? null : action.payload,
                            dispatchParams: action.meta.params
                        }
                    }
                };
            });
    }

    public abstract get loadableDefinitions(): { [key: string]: LoadableDefinition<any, any> };

    public get loadableActions(): { [K in keyof this['loadableDefinitions']]: PromiseAction<StateType, any, any> } {
        if (!this._loadableActions) {
            this._loadableActions = <any>this.generateLoadableActions()
        }
        return this._loadableActions;
    }

    public get loadableReset(): { [K in keyof this['loadableDefinitions']]: Action<never, StateType> } {
        const loadableResets = {};
        for (let loadableName in this.loadableDefinitions) {
            const definition = this.loadableDefinitions[loadableName];
            loadableResets[loadableName] = this.createAction(loadableName.toUpperCase() + "_RESET").build.on((state: StateWithLoadables<any>) => {
                return {...state, loadables: {...state.loadables, [loadableName]: createLoadable()}};
            })
        }
        return <any>loadableResets;
    }

    private generateLoadableActions() {
        const loadableActions = {};
        for (let loadableName in this.loadableDefinitions) {
            const definition = this.loadableDefinitions[loadableName];
            loadableActions[loadableName] = this.createLoadableAction(
                loadableName, definition.payloadProvider, definition.then, definition.successMessage, definition.redirectAfter);
        }
        return loadableActions;
    }

    protected createDeleteDefinition = (listLoadableName: string, payloadProvider: (id: number) => Promise<number>,
                                        then?: (state: StateType, action: ActionType<number>) => StateType) =>
        this.createLoadableDefinition(payloadProvider, (state, action) => {
            const data = [...(state.loadables[listLoadableName].data as { id: number }[])];
            let index = data.findIndex(i => i.id === action.payload);
            if (index > -1) {
                data.splice(index, 1);
            }
            state[listLoadableName].data = data;
            return typeof then === "function" ? then(state, action) : state;
        });
}

export interface Loadable<DataType> {
    __discriminator: 'loadable',
    data: DataType,
    dispatchParams: any[]
    loading: boolean,
    error?: ErrorResponseDTO,
    loaded: boolean,
    touched: boolean
}

export const createLoadable = <DataType>(): Loadable<DataType> => ({
    __discriminator: 'loadable',
    data: null,
    loading: false,
    dispatchParams: null,
    loaded: false,
    touched: false
});