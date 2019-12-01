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

const store = configureStore();

container.resolve(dispatchService).store = store;

ReactDOM.render(
    <Provider store={store}>
        <App color="Blue"/>
    </Provider>,
    document.getElementById('root')
);
