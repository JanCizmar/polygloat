import * as React from 'react';
import {FunctionComponent, useContext, useEffect, useState} from 'react';
import {PolygloatProviderContext} from "./PolygloatProvider";

type TProps = { parameters: { [key: string]: string }, children: string }

export const T: FunctionComponent = (props: TProps) => {
    const context = useContext(PolygloatProviderContext);

    const [translated, setTranslated] = useState(context.polygloat.instant(props.children));

    const translate = () => context.polygloat.translate(props.children, props.parameters).then(t => {
        setTranslated(t);
    });

    useEffect(() => {
        translate();

        const subscription = context.polygloat.onLangChange.subscribe(() => {
            translate();
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [])

    return <>{translated}</>;
}