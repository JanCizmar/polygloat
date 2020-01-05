import * as React from 'react';
import {AppState} from '../store';
import {connect} from 'react-redux';
import GlobalError from './common/GlobalError';

class ErrorBoundary extends React.Component<{ hasGlobalError }, { hasError: boolean }> {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    render() {
        if (this.state.hasError || this.props.hasGlobalError) {
            return <GlobalError/>;
        }

        return this.props.children;
    }
}

export default connect((state: AppState) => ({hasGlobalError: state.global.hasError}))(ErrorBoundary);
