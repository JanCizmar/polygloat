import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {translationReducer} from './translation/reducers';
import promise from 'redux-promise-middleware';
import {container} from 'tsyringe';
import {implicitReducer as ir} from './implicitReducer';
import {RepositoriesState} from './repository/RepositoriesState';
import {RepositoryActions} from './repository/RepositoryActions';
import {LanguagesState} from './languages/LanguagesState';
import {LanguageActions} from './languages/LanguageActions';
import {GlobalActions, GlobalState} from './global/globalActions';
import {ErrorActions, ErrorState} from './global/errorActions';
import {RedirectionActions, RedirectionState} from './global/redirectionActions';
import {MessageActions, MessageState} from './global/messageActions';
import {SignUpActions, SignUpState} from './global/signUpActions';
import {RepositoryInvitationActions, RepositoryInvitationState} from './repository/invitations/repositoryInvitationActions';
import {RepositoryPermissionActions, RepositoryPermissionState} from './repository/invitations/repositoryPermissionActions';

const implicitReducer = container.resolve(ir);
const repositoryActionsIns = container.resolve(RepositoryActions);
const languageActionsIns = container.resolve(LanguageActions);
const globalActionsIns = container.resolve(GlobalActions);
const errorActionsIns = container.resolve(ErrorActions);
const redirectionActionsIns = container.resolve(RedirectionActions);

const rootReducer = combineReducers({
    translations: translationReducer,
    global: implicitReducer.create(new GlobalState(), globalActionsIns),
    repositories: implicitReducer.create(new RepositoriesState(), repositoryActionsIns),
    languages: implicitReducer.create(new LanguagesState(), languageActionsIns),
    error: implicitReducer.create(new ErrorState(), errorActionsIns),
    redirection: implicitReducer.create(new RedirectionState(), redirectionActionsIns),
    message: implicitReducer.create(new MessageState(), container.resolve(MessageActions)),
    signUp: implicitReducer.create(new SignUpState(), container.resolve(SignUpActions)),
    repositoryInvitation: implicitReducer.create(new RepositoryInvitationState(), container.resolve(RepositoryInvitationActions)),
    repositoryPermission: implicitReducer.create(new RepositoryPermissionState(), container.resolve(RepositoryPermissionActions)),
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
