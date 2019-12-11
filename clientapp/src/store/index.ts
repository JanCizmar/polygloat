import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {translationReducer} from './translation/reducers';
import promise from 'redux-promise-middleware';
import {errorHandling} from './middlewares/errorHandling';
import {globalReducer} from './global/reducers';
import {successMessage} from './middlewares/successMessage';

const rootReducer = combineReducers({
    translations: translationReducer,
    global: globalReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
    const middlewares = [thunkMiddleware, errorHandling, successMessage, promise];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    return createStore(
        rootReducer,
        composeWithDevTools(middleWareEnhancer)
    );
}
