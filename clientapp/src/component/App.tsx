import * as React from 'react';
import Dashboard from './Dashboard';
import {Actions} from '../store/global/actions';
import {AppState} from '../store';
import {connect} from 'react-redux';
import GlobalError from './common/GlobalError';
import SnackBar from './common/SnackBar';

interface Props {
    hasError: boolean;
}

class App extends React.Component<Props, null> {

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
        if (this.props.hasError) {
            return <GlobalError/>;
        }

        return (
            <React.Fragment>
                <Dashboard/>
                <SnackBar/>
            </React.Fragment>
        );
    }
}

export default connect((state: AppState) => ({hasError: state.global.hasError}))(App);
