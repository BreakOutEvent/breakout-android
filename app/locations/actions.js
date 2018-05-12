import BreakoutApi from 'breakout-api-client';
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../secrets/config";
import {store} from '../store/store';
import {withAccessToken} from "../utils/utils";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG);

export const FETCH_EVENT_LOCATIONS_SUCCESS = 'FETCH_EVENT_LOCATIONS_SUCCESS';
export const FETCH_EVENT_LOCATIONS_ERROR = 'FETCH_EVENT_LOCATIONS_ERROR';

export function fetchLocations() {
    return dispatch => {
        withAccessToken(api, store.getState())
            .getAllEvents()
            .then(events => {
                const currentEvents = events.filter(e => e.isCurrent);
                return Promise.all(currentEvents.map(event => api.fetchLocationsForEvent(event.id)))
                    .then(eventLocations => {
                        let teams = [];
                        const locations = [].concat(...eventLocations);
                        locations.forEach(tl => {
                            teams[tl.id] = {
                                id: tl.id,
                                name: tl.name,
                                event: events.find(e => e.id === tl.event),
                                locations: tl.locations
                            };
                        });

                        dispatch(onFetchEventLocationsSuccess(teams))
                    })
                    .catch(error => dispatch(onFetchEventLocationsError(error)))
            })
            .catch(error => dispatch(onFetchEventLocationsError(error)))
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
