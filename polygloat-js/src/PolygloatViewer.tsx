import * as React from 'react';

export interface ViewerProps {
    show: boolean
}

export const PolygloatViewer = (props: ViewerProps) => props.show && <div>Hello world!</div>;

