//todo: redactor translation state to not use this
export abstract class AbstractState {
    modify(props: { [P in keyof this]: this[P] } | any): this {
        const instance = new ((this as any).constructor);
        Object.assign(instance, this);
        Object.assign(instance, props);
        return instance;
    }
}
