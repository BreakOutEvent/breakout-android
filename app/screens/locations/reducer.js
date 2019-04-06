import {
    FETCH_EVENT_LOCATIONS_SUCCESS,
    FETCH_EVENT_LOCATIONS_ERROR
} from "./actions";

const initialState = {
    locations: [],
    currentEvents: []
};

export default locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CLEAN_ALL':
            return initialState;

        case FETCH_EVENT_LOCATIONS_SUCCESS:
            return {
                ...state,
                locations: action.payload.locations,
                currentEvents: action.payload.currentEvents
            };
        case FETCH_EVENT_LOCATIONS_ERROR:
            return {
                ...state,
                fetchEventLocationError: {
                    ...action.payload.error,
                    userMessage: 'Failed to load event locations' // TODO: i18n
                }
            };
        default:
            return state;
    }
};
