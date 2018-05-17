import _ from 'lodash';
import {
    ON_FETCH_ME_ERROR,
    ON_FETCH_ME_SUCCESS, ON_LOGIN_ERROR, ON_LOGIN_SUCCESS, ON_PASSWORD_CHANGED,
    ON_USERNAME_CHANGED
} from "./actions";

const initialState = {
    username: '',
    password: '',
    me: null
};

export default loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_USERNAME_CHANGED:
            return {
                ...state,
                username: action.payload.username
            };

        case ON_PASSWORD_CHANGED:
            return {
                ...state,
                password: action.payload.password
            };

        case ON_LOGIN_SUCCESS:
            return {
                ...state,
                access_token: action.payload.access_token,
                refresh_token: action.payload.refresh_token,
                error: null
            };

        case ON_LOGIN_ERROR:
            return {
                ...state,
                error: {
                    userMessage: parseError(action.payload.error),
                    ...action.payload.error
                }
            };

        case ON_FETCH_ME_SUCCESS:
            console.log(action.payload.me);
            return {
                ...state,
                me: {...action.payload.me}
            };

        case ON_FETCH_ME_ERROR:
            return {
                ...state,
                me: {
                    error: {...action.payload.error}
                }
            };
        default:
            return state;
    }
}

function parseError(error) {
    const statusCode = _.get(error, 'response.status');
    if (statusCode && statusCode === 400) {
        return 'Invalid username or password' // TODO: i18n
    } else {
        return error.message || 'Unknown error'
    }
}