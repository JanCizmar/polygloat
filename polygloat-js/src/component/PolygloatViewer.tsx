import * as React from 'react';
import TranslationDialog from './TranslatonDialog';
import {PolygloatService} from '../polygloatService';
import {TranslationManager} from '../translationManager';

type ViewerProps = {
    service: PolygloatService,
    manager: TranslationManager
}

export class PolygloatViewer extends React.Component<ViewerProps> {
    state = {
        translationInput: null,
        dialogOpened: false
    };

    constructor(props: ViewerProps) {
        super(props);
    }

    public translationEdit(input) {
        this.setState({...this.state, dialogOpened: true, translationInput: input});
    }

    public render = () =>
        <div>
            <TranslationDialog {...this.props} open={this.state.dialogOpened} input={this.state.translationInput} onClose={this.onClose}/>
        </div>;

    private onClose = () => {
        this.setState({...this.state, dialogOpened: false});
    };
}
