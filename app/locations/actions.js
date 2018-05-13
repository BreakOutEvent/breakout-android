import BreakoutApi from 'breakout-api-client';
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../secrets/config";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG);

export const FETCH_EVENT_LOCATIONS_SUCCESS = 'FETCH_EVENT_LOCATIONS_SUCCESS';
export const FETCH_EVENT_LOCATIONS_ERROR = 'FETCH_EVENT_LOCATIONS_ERROR';

function groupLocationsByTeam(eventLocations, events) {
    const locations = [].concat(...eventLocations);
    return locations.reduce((teams, team) => {
        teams.push({
            id: team.id,
            name: team.name,
            event: events.find(e => e.id === team.event),
            locations: team.locations
        });

        return teams;
    }, []);
}

export function fetchEventLocations() {
    return async dispatch => {
        try {
            const events = await api.getAllEvents();
            const currentEvents = events.filter(e => e.isCurrent);
            const eventLocations = await Promise.all(currentEvents.map(event => api.fetchLocationsForEvent(event.id)));

            dispatch(onFetchEventLocationsSuccess(groupLocationsByTeam(eventLocations, events)));
        } catch (error) {
            dispatch(onFetchEventLocationsError(error));
        }
    }
}

function onFetchEventLocationsSuccess(locations) {
    return {
        type: FETCH_EVENT_LOCATIONS_SUCCESS,
        payload: {locations}
    };
}

function onFetchEventLocationsError(error) {
    return {
        type: FETCH_EVENT_LOCATIONS_ERROR,
        payload: {error}
    }
}
