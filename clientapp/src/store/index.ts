import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {translationReducer} from './translation/reducers';
import promise from 'redux-promise-middleware';
import {globalReducer} from './global/reducers';

const rootReducer = combineReducers({
    translations: translationReducer,
    global: globalReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
    const middlewares = [thunkMiddleware, promise];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    return createStore(
        rootReducer,
        composeWithDevTools(middleWareEnhancer)
    );
}
