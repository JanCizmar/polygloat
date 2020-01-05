import * as React from 'react';
import Dashboard from './Dashboard';
import {Actions} from '../store/global/actions';
import SnackBar from './common/SnackBar';

interface Props {
}

export class App extends React.Component<Props, null> {

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<null>, snapshot?: any): void {
        console.log(this.props);
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        Actions.globalError.dispatch(error);
        throw error;
    }

    render() {
        return (
            <React.Fragment>
                <Dashboard/>
                <SnackBar/>
            </React.Fragment>
        );
    }
};
