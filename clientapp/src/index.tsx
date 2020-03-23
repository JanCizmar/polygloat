import 'reflect-metadata';
import 'regenerator-runtime/runtime';
import {Provider} from 'react-redux';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import configureStore from './store';

import {container} from 'tsyringe';

import {dispatchService} from './service/dispatchService';

import * as Sentry from '@sentry/browser';

import ErrorBoundary from "./component/ErrorBoundary";
import FullPageLoading from "./component/common/FullPageLoadingView";
import App from "./component/App";

const store = configureStore();
import {SnackbarProvider} from 'notistack';


// #if process.env.target==="appbundle"
Sentry.init({dsn: 'https://371b68a5e0da4f86a5142af52ad38599@sentry.io/1853046'});
// #endif

container.resolve(dispatchService).store = store;


ReactDOM.render(
    <React.Suspense fallback={<FullPageLoading/>}>
        <Provider store={store}>
            <ErrorBoundary>
                <SnackbarProvider>
                {<App/>}
                </SnackbarProvider>
            </ErrorBoundary>
        </Provider>
    </React.Suspense>,
    document.getElementById('root')
);
