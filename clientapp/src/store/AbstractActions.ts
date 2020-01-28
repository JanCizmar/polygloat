import {AbstractAction, Action, PromiseAction, StateModifier} from './Action';
import {ErrorResponseDTO} from '../service/response.types';

export abstract class AbstractActions<StateType> {
    private actions = new Map<string, AbstractAction>();

    abstract get prefix(): string;

    constructor() {
    }

    createAction<PayloadType>(type: string, payloadProvider?: (...params: any[]) => PayloadType): Action {
        let action = new Action<PayloadType, StateType>(`${this.prefix}_${type}`, payloadProvider);
        this.register(action);
        return action;
    }

    createPromiseAction<PayloadType, ErrorType = ErrorResponseDTO>(type: string,
                                                                   payloadProvider: (...params: any[]) => Promise<PayloadType>):
        PromiseAction<PayloadType, ErrorType, StateType> {
        let promiseAction = new PromiseAction<PayloadType, ErrorType, StateType>(`${this.prefix}_${type}`, payloadProvider);
        this.register(promiseAction);
        return promiseAction;
    }

    public getAction(type: string): AbstractAction {
        return this.actions.get(type);
    }

    protected register(action: AbstractAction) {
        if (action instanceof Action) {
            this.actions.set(action.type, action);
        }
        if (action instanceof PromiseAction) {
            this.actions.set(action.pendingType, action);
            this.actions.set(action.fulfilledType, action);
            this.actions.set(action.rejectedType, action);
        }
    }

    createLoadableAction<PayloadType>(loadableName,
                                      payloadProvider: (...params: any[]) => Promise<any>,
                                      then?: StateModifier<StateType, PayloadType>):
        PromiseAction<PayloadType, ErrorResponseDTO, StateType> {
        return this.createPromiseAction(loadableName.toUpperCase(), payloadProvider)
            .build.onPending((state, action) => {
                return {
                    ...state,
                    [loadableName]: <Loadable<PayloadType>> {...state[loadableName], loading: true, error: null, errorParams: null}
                };
            }).build.onFullFilled((state, action) => {
                const newState = {
                    ...state,
                    [loadableName]: <Loadable<PayloadType>> {
                        ...state[loadableName],
                        loading: false,
                        data: action.payload,
                        error: null,
                        errorParams: null
                    }
                };
                return typeof then === 'function' ? then(newState, action) : newState;
            })
            .build.onRejected((state, action) => {
                return {
                    ...state,
                    [loadableName]: <Loadable<PayloadType>> {
                        ...state[loadableName],
                        loading: true,
                        data: null,
                        error: action.payload.code,
                        errorParams: action.payload.params
                    }
                };
            });
    }

    createDeleteAction = (deleteLoadableName, listLoadableName, payloadProvider: (id: number) => Promise<number>) =>
        this.createLoadableAction(deleteLoadableName, payloadProvider, (state, action) => {
            const data = [...state[listLoadableName].data];
            let index = data.findIndex(i => i.id === action.payload);
            if (index > -1) {
                data.splice(index, 1);
            }
            state[listLoadableName].data = data;
            return state;
        });
}

export interface Loadable<DataType> {
    __discriminator: 'loadable',
    data: DataType,
    dispatchParams: any[]
    loading: boolean,
    error?: string,
    errorParams?: any[]
}

export const createLoadable = <DataType>(): Loadable<DataType> => ({
    __discriminator: 'loadable',
    data: null,
    loading: true,
    dispatchParams: null
});

