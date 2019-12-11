export abstract class AbstractState {
    modify(props: { [P in keyof this]: this[P] } | any): this {
        return Object.assign(new ((this as any).constructor), this, props);
    }
}
