import BreakoutApi from "breakout-api-client";
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../../config/secrets";
import {Sentry} from 'react-native-sentry';

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG);

export const ON_USERNAME_CHANGED = 'ON_USERNAME_CHANGED';
export const ON_PASSWORD_CHANGED = 'ON_PASSWORD_CHANGED';
export const ON_LOGIN_SUCCESS = 'ON_LOGIN_SUCCESS';
export const ON_LOGIN_ERROR = 'ON_LOGIN_ERROR';
export const ON_FETCH_ME_SUCCESS = 'ON_FETCH_ME_SUCCESS';
export const ON_FETCH_ME_ERROR = 'ON_FETCH_ME_ERROR';
export const ON_APP_STATE_CHANGED = 'ON_APP_STATE_CHANGED';

function appStateChanged(newAppState) {
    return {
        type: ON_APP_STATE_CHANGED,
        payload: {newState: newAppState}
    }
}

export function onAppStateChanged(oldState, newState) {
    return (dispatch, getState) => {

        dispatch(appStateChanged(newState));

        if (oldState && oldState.match(/inactive|background/) && newState === 'active') {
            // TODO: This is a workaround b.c. the api client has no support for refresh tokens yet!
            const username = _.get(getState(), 'login.username');
            const password = _.get(getState(), 'login.password');

            if (username && password) {
                api.login(username, password)
                    .then(resp => dispatch(onLoginSuccess(resp)))
                    .catch(err => dispatch(onLoginError(err)))
            }
        }
    }
}

export function onUsernameChanged(username) {
    return {
        type: ON_USERNAME_CHANGED,
        payload: {username}
    }
}

export function onPasswordChanged(password) {
    return {
        type: ON_PASSWORD_CHANGED,
        payload: {password}
    }
}

// This callback thing is a workaround to navigate somewhere after
// successful login. This should be changed if we know a useful pattern
// on how to do so
export function onPressLogin(username, password, cb = () => {}) {
    return dispatch => {
        api.login(username, password)
            .then(resp => {
                dispatch(onLoginSuccess(resp));
                cb();
            })
            .catch(err => dispatch(onLoginError(err)))
    };
}

function onLoginSuccess(response) {
    return dispatch => {
        dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: {
                access_token: response.access_token,
                refresh_token: response.refresh_token
            }
        });
        api.getMe()
            .then(me => dispatch(onFetchMeSuccess(me)))
            .catch(error => dispatch(onFetchMeError(error)))
    };
}

function onLoginError(error) {
    return {
        type: ON_LOGIN_ERROR,
        payload: {
            error
        }
    }
}

function onFetchMeSuccess(me) {
    return {
        type: ON_FETCH_ME_SUCCESS,
        payload: {me}
    }
}

function onFetchMeError(error) {
    return (dispatch, state) => {

        Sentry.captureException(error, {
            type: ON_FETCH_ME_ERROR,
            state
        });

        dispatch({
            type: ON_FETCH_ME_ERROR,
            payload: {error}
        });
    }
}