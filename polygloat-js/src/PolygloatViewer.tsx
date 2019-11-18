import * as React from 'react';

export interface ViewerProps {

}

export class PolygloatViewer extends React.Component{
    public show = true;

    constructor(props){
        super(props);
    }

    public render = () => {
        return this.show && <div>Hello world!</div>;
    };
};
