import * as React from 'react';
import {Actions} from '../store/global/actions';
import SnackBar from './common/SnackBar';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {RepositoriesRouter} from './views/repositories/RepositoriesRouter';

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
            <BrowserRouter>
                <Switch>
                    <Route path="/repositories">
                        <RepositoriesRouter/>
                    </Route>
                </Switch>
                <SnackBar/>
            </BrowserRouter>
        );
    }
};
