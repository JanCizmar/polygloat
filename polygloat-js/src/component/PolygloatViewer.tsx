import * as React from 'react';
import TranslationDialog from './Dialog';

export interface ViewerProps {

}

export class PolygloatViewer extends React.Component {
    state = {
        translationInput: null,
        dialogOpened: false
    };

    constructor(props) {
        super(props);
    }

    public translationEdit(input) {
        this.setState({...this.state, dialogOpened: true, translationInput: input});
    }

    public render = () => {
        return <div><TranslationDialog open={this.state.dialogOpened} input={this.state.translationInput} onClose={this.onClose}/></div>;
    };

    private onClose = () => {
        this.setState({...this.state, dialogOpened: false});
    };
}
