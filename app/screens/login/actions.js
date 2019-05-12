import BreakoutApi from "breakout-api-client";
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../../config/secrets";
import {Sentry} from 'react-native-sentry';
import {Keyboard} from 'react-native'
import OneSignal from "react-native-onesignal";
import _ from "lodash";
import NavigationService from "../../utils/navigation-service";

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

export function onPressLogin(username, password) {
    return async dispatch => {
        try {
            const resp = await api.login(username, password);
            dispatch(onLoginSuccess(resp, true));
        } catch (err) {
            dispatch(onLoginError(err))
        }
    };
}

function onLoginSuccess(response, fromLoginScreen = false) {
    return async dispatch => {

        Keyboard.dismiss();
        OneSignal.configure();

        if (fromLoginScreen) {
            NavigationService.navigate('drawer');
        }

        dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: {
                access_token: response.access_token,
                refresh_token: response.refresh_token
            }
        });

        try {
            const me = await api.getMe();
            dispatch(onFetchMeSuccess(me));
        } catch (err) {
            dispatch(onFetchMeError(err));
        }
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
