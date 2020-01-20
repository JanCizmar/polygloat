import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {translationReducer} from './translation/reducers';
import promise from 'redux-promise-middleware';
import {globalReducer} from './global/reducers';
import {container} from 'tsyringe';
import {implicitReducer as ir} from './implicitReducer';
import {RepositoriesState} from './repository/RepositoriesState';
import {RepositoryActions} from './repository/RepositoryActions';
import {LanguagesState} from './languages/LanguagesState';
import {LanguageActions} from './languages/LanguageActions';

const implicitReducer = container.resolve(ir);
const repositoryActionsIns = container.resolve(RepositoryActions);
const languageActionsIns = container.resolve(LanguageActions);


const rootReducer = combineReducers({
    translations: translationReducer,
    global: globalReducer,
    repositories: implicitReducer.create<RepositoriesState>(new RepositoriesState(), repositoryActionsIns),
    languages: implicitReducer.create<LanguagesState>(new LanguagesState(), languageActionsIns),
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
