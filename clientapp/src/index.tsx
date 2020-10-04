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
import RubikTTf from './fonts/Rubik/Rubik-Regular.woff2';
import {blue, red} from "@material-ui/core/colors";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {PolygloatProvider} from "polygloat-react";
import {App} from "./component/App";
import {FullPageLoading} from "./component/common/FullPageLoading";

const store = configureStore();


const SnackbarProvider = React.lazy(() => import(/* webpackChunkName: "notistack" */ 'notistack')
    .then(module => ({"default": module.SnackbarProvider})));


/** !!!! DO NOT REMOVE THESE COMMENTS -- webpack-conditional-loader
 @link(https://github.com/caiogondim/webpack-conditional-loader#readme)
 **/
// #if process.env.sentry === true
Sentry.init({dsn: 'https://371b68a5e0da4f86a5142af52ad38599@sentry.io/1853046'});
console.info("Using Sentry!");
// #endif

container.resolve(dispatchService).store = store;

const raleway = {
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    src: `
    local('Rubik'),
    local('Rubik-Regular'),
    url(${RubikTTf}) format('woff2')
  `,
    unicodeRange:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Rubik, Arial',
    },
    palette: {
        primary: {
            main: blue['600'],
        },
        secondary: {
            main: red['300'],
        },
    },
    overrides: {
        MuiCssBaseline: {
            // @ts-ignore
            '@global': {
                // @ts-ignore
                '@font-face': [raleway],
            },
        },
        MuiButton: {
            root: {
                borderRadius: 3,
            },
        },
    },
});

ReactDOM.render(
    <React.Suspense fallback={<FullPageLoading/>}>
        <PolygloatProvider
            apiKey="43t0klcdpnjp1elqrf4fuco676"
            apiUrl="http://chlupac.com:8080"
            filesUrlPrefix="/i18n/"
            loadingFallback={<FullPageLoading/>}
        >
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    {/*@ts-ignore --  Type '{ children: Element; }' has no properties ... */}
                    <ErrorBoundary>
                        <SnackbarProvider>
                            <App/>
                        </SnackbarProvider>
                    </ErrorBoundary>
                </Provider>
            </ThemeProvider>
        </PolygloatProvider>
    </React.Suspense>,
    document.getElementById('root')
);
