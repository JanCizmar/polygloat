import {SecurityDTO} from './types';
import {AbstractActions} from '../AbstractActions';
import {singleton} from 'tsyringe';
import {remoteConfigService} from '../../service/remoteConfigService';
import {securityService} from '../../service/securityService';
import {ErrorResponseDTO, RemoteConfigurationDTO, TokenDTO} from '../../service/response.types';

export class GlobalState {
    remoteConfig: RemoteConfigurationDTO = null;
    remoteConfigLoading: boolean = true;
    security: SecurityDTO = {
        allowPrivate: !!localStorage.getItem('jwtToken'),
        jwtToken: localStorage.getItem('jwtToken') || null,
        loginErrorCode: null
    };
    passwordResetLoading = false;
    passwordResetSent = false;
    passwordResetError: string = null;
    passwordResetSetLoading = false;
    passwordResetSetValidated = false;
    passwordResetSetError = null;
    passwordResetSetSucceed = false;
    confirmationDialog = {
        open: false,
        title: 'Confirmation',
        content: null,
        onConfirm: () => {
        }
    };
}


@singleton()
export class GlobalActions extends AbstractActions<GlobalState> {
    loadRemoteConfig = this.createPromiseAction('LOAD_REMOTE_CONFIG', () => this.configService.getConfiguration())
        .build.onFullFilled((state, action) =>
            (
                {
                    ...state, remoteConfig: action.payload, remoteConfigLoading: false,
                    security: {...state.security, allowPrivate: !action.payload.authentication ? true : state.security.allowPrivate}
                })
        ).build.onPending((state, action) => (
            {...state, remoteConfigLoading: true}
        ));
    oAuthSuccessful = this.buildLoginAction('AUTHORIZE_OAUTH',
        (serviceType, code) => this.securityService.authorizeOAuthLogin(serviceType, code));
    logout = this.createAction('LOGOUT', () => this.securityService.logout()).build.on(
        (state, action) => (
            {...state, security: <SecurityDTO> {...state.security, jwtToken: null, allowPrivate: false}}
        ));
    login = this.buildLoginAction('LOGIN', v => this.securityService.login(v));
    resetPasswordRequest = this.createPromiseAction('PASSWORD_RESET_REQUEST',
        (email) => this.securityService.resetPasswordRequest(email))
        .build.onPending((state, action) => {
            return <GlobalState> {...state, passwordResetLoading: true, passwordResetSent: false, passwordResetError: null};
        }).build.onFullFilled((state, action) => {
            return <GlobalState> {...state, passwordResetSent: true, passwordResetLoading: false, passwordResetError: null};
        }).build.onRejected((state, action) => {
            return <GlobalState> {
                ...state,
                passwordResetSent: false,
                passwordResetLoading: false,
                passwordResetError: action.payload.code
            };
        });
    resetPasswordValidate = this.createPromiseAction<never, ErrorResponseDTO>('RESET_PASSWORD_VALIDATE',
        this.securityService.resetPasswordValidate)
        .build.onPending((state, action) => {
            return {...state, passwordResetSetLoading: true};
        }).build.onFullFilled((state, action) => {
            return {...state, passwordResetSetLoading: false, passwordResetSetValidated: true};
        }).build.onRejected((state, action) => {
            return <GlobalState> {
                ...state,
                passwordResetSetValidated: false,
                passwordResetSetError: action.payload.code,
                passwordResetSetLoading: false
            };
        });
    resetPasswordSet = this.createPromiseAction<void, ErrorResponseDTO>('RESET_PASSWORD_SET',
        this.securityService.resetPasswordSet)
        .build.onPending((state, action) => {
            return <GlobalState> {...state, passwordResetSetLoading: true, passwordResetSetSucceed: false};
        }).build.onFullFilled((state, action) => {
            return <GlobalState> {...state, passwordResetSetSucceed: true};
        }).build.onRejected((state, action) => {
            return <GlobalState> {
                ...state, passwordResetSetError: action.payload.code,
                passwordResetSetSucceed: false,
                passwordResetSetLoading: false
            };
        });
    setJWTToken = this.createAction('SET_JWT', token => token).build.on(
        (state, action) => {
            return {
                ...state,
                security: {...state.security, allowPrivate: true, jwtToken: action.payload.accessToken, loginErrorCode: null}
            };
        });
    openConfirmation = this.createAction('OPEN_CONFIRMATION',
        (title, content, onConfirm) => ({title, content, onConfirm}))
        .build.on((state, action) =>
            (<GlobalState> {
                ...state,
                confirmationDialog: <typeof state.confirmationDialog> {
                    ...state.confirmationDialog,
                    open: true,
                    title: action.payload.title,
                    content: action.payload.title,
                    onConfirm: action.payload.onConfirm
                }
            }));
    closeConfirmation = this.createAction('CLOSE_CONFIRMATION', null)
        .build.on((state, action) =>
            (<GlobalState> {
                ...state,
                confirmationDialog: <typeof state.confirmationDialog> {
                    ...state.confirmationDialog,
                    open: false,
                    title: '',
                    content: '',
                    onConfirm: () => {
                    }
                }
            }));

    constructor(private configService: remoteConfigService, private securityService: securityService) {
        super();
    }

    get prefix(): string {
        return 'GLOBAL';
    }

    private buildLoginAction(name: string, payloadProvider: (...params) => Promise<TokenDTO>) {
        return this.createPromiseAction<TokenDTO, ErrorResponseDTO>(name, payloadProvider)
            .build.onPending((state, action) => (
                {...state, authLoading: true}
            ))
            .build.onFullFilled((state, action) => (
                <GlobalState> {
                    ...state,
                    security: {...state.security, allowPrivate: true, jwtToken: action.payload.accessToken, loginErrorCode: null}
                }
            )).build.onRejected((state, action) => ({
                ...state,
                security: <SecurityDTO> {loginErrorCode: action.payload.code}
            }));
    }
}

