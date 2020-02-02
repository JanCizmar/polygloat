import {container} from 'tsyringe';
import {dispatchService} from '../service/dispatchService';

export type ActionType<PayloadType> = { type: string, payload: PayloadType, meta?: any, params?: any[] };
export type StateModifier<StateType, PayloadType> = (state: StateType, action: ActionType<PayloadType>) => StateType;

export type PayloadProvider<PayloadType, F extends Function> = F extends (...params: infer A) => PayloadType ? A : never;

export abstract class AbstractAction<PayloadType = any, StateType = any> {
    protected constructor(public type: string,
                          public payloadProvider?: (...params: any[]) => PayloadType, public meta?: object) {
    }

    dispatch(...params: Parameters<this['payloadProvider']>) {
        container.resolve(dispatchService).dispatch({
            type: this.type,
            meta: {...this.meta, params: params},
            payload: this.payloadProvider && this.payloadProvider(...params),
        });
    }
}

export class Action<PayloadType = any, StateType = any> extends AbstractAction<PayloadType, StateType> {

    build = {
        on: (callback: StateModifier<StateType, PayloadType>): Action<PayloadType, StateType> => {
            this.stateModifier = callback;
            return this;
        }
    };

    constructor(public type: string,
                public payloadProvider?: (...params: any[]) => PayloadType,
                public stateModifier?: StateModifier<StateType, PayloadType>,
    ) {
        super(type, payloadProvider);
    }

    public reduce(state: StateType, action: ActionType<PayloadType>): void {
        this.stateModifier(state, action);
    }
}

export class PromiseAction<PayloadType, ErrorType, StateType> extends AbstractAction<Promise<PayloadType>, StateType> {
    public reducePending: StateModifier<StateType, any>;

    get fulfilledType() {
        return this.type + '_FULFILLED';
    }

    get pendingType() {
        return this.type + '_PENDING';
    }

    get rejectedType() {
        return this.type + '_REJECTED';
    }

    public reduceRejected: StateModifier<StateType, any>;
    public reduceFulfilled: StateModifier<StateType, PayloadType>;
    build = {
        onPending: (callback: StateModifier<StateType, any>): PromiseAction<PayloadType, ErrorType, StateType> => {
            this.reducePending = callback;
            return this;
        },

        onRejected: (callback: StateModifier<StateType, ErrorType>): PromiseAction<PayloadType, ErrorType, StateType> => {
            this.reduceRejected = callback;
            return this;
        },

        onFullFilled: (callback: StateModifier<StateType, PayloadType>): PromiseAction<PayloadType, ErrorType, StateType> => {
            this.reduceFulfilled = callback;
            return this;
        }
    };

    constructor(type: string, payloadProvider: (...params: any[]) => Promise<PayloadType>, meta?: object) {
        super(type, payloadProvider, meta);
    }
}
