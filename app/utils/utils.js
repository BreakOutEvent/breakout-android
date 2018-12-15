import {store} from '../store/store';
import _ from "lodash";

/**
 * Takes an instance of BreakoutApi and returns that instance with an access token set
 * This will use the default store and try to get the state from there, if no state is provided
 * If there's no access token in the state this will return the unchanged instance
 *
 * @param api An instance of BreakoutApi
 * @param state A state object that contains an access token at state.login.access_token
 * @returns {BreakoutApi}
 */
export function withAccessToken(api, state = store.getState()) {
    const access_token = _.get(state, 'login.access_token');
    if (access_token) {
        api.setAccessToken(access_token);
        return api
    } else {
        return api
    }
}