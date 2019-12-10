import 'reflect-metadata';
import 'regenerator-runtime/runtime';
//import 'typeface-roboto';
import {Provider} from 'react-redux';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './component/App';
import configureStore from './store';
import {container} from 'tsyringe';
import {dispatchService} from './service/dispatchService';
import * as Sentry from '@sentry/browser';

const store = configureStore();

Sentry.init({dsn: 'https://371b68a5e0da4f86a5142af52ad38599@sentry.io/1853046'});

container.resolve(dispatchService).store = store;

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);
