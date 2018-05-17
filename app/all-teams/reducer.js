import {FETCH_TEAMS_ERROR, FETCH_TEAMS_SUCCESS} from "./actions";

const initialState = {
    teams: []
};

export default allTeamsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TEAMS_SUCCESS:
            return {
                teams: action.payload.teams
            };
        case FETCH_TEAMS_ERROR:
            return {
                error: action.payload.error
            };
        default:
            return state;
    }
}