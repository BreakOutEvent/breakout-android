import BreakoutApi from "breakout-api-client";
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../../config/secrets";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG);

export const ON_USERNAME_CHANGED = 'ON_USERNAME_CHANGED';
export const ON_PASSWORD_CHANGED = 'ON_PASSWORD_CHANGED';
export const ON_LOGIN_SUCCESS = 'ON_LOGIN_SUCCESS';
export const ON_LOGIN_ERROR = 'ON_LOGIN_ERROR';
export const ON_FETCH_ME_SUCCESS = 'ON_FETCH_ME_SUCCESS';
export const ON_FETCH_ME_ERROR = 'ON_FETCH_ME_ERROR';

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
    return dispatch => {
        api.login(username, password)
            .then(resp => dispatch(onLoginSuccess(resp)))
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
    return {
        type: ON_FETCH_ME_ERROR,
        payload: {error}
    }
}