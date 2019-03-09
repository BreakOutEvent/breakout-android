import BreakoutApi from "breakout-api-client";
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD, DEBUG} from "../../config/secrets";
import _ from "lodash";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, CLOUDINARY_CLOUD, CLOUDINARY_API_KEY, DEBUG);

export const FETCH_TEAMS_SUCCESS = 'FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_ERROR = 'FETCH_TEAMS_ERROR';

function fetchTeamsSuccess(teams) {
    return {
        type: FETCH_TEAMS_SUCCESS,
        payload: {teams}
    }
}

function fetchTeamsError(error) {
    return {
        type: FETCH_TEAMS_ERROR,
        payload: {error}
    }
}

export function loadTeams() {
    return async dispatch => {
        try {
            const events = await api.getAllEvents();
            const activeEvents = events.filter(event => event.current);
            const nestedTeams = await Promise.all(activeEvents.map(event => api.fetchTeamsForEvent(event.id)));
            const teams = _.flatten(nestedTeams);

            dispatch(fetchTeamsSuccess(teams));
        } catch (error) {
            dispatch(fetchTeamsError(error));
        }
    }
}
