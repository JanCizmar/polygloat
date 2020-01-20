import {AbstractAction, Action, PromiseAction} from './Action';

export abstract class AbstractActions<StateType> {
    private actions = new Map<string, AbstractAction>();

    abstract get prefix(): string;

    createAction<PayloadType>(type: string, payloadProvider: (...params: any[]) => PayloadType): Action {
        let action = new Action<PayloadType, StateType>(`${this.prefix}_${type}`, payloadProvider);
        this.register(action);
        return action;
    }

    createPromiseAction<PayloadType, ErrorType>(type: string,
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
}
