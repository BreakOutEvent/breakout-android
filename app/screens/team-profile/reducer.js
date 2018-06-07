import update from 'immutability-helper';

import {
    ON_FETCH_CHALLENGES_SUCCESS,
    ON_FETCH_POSTINGS_FOR_TEAM_SUCCESS,
    ON_FETCH_SPONSORINGS_SUCCESS,
    ON_FETCH_TEAM_SUCCESS,
    ON_FETCH_TEAM_LOCATIONS_SUCCESS,
    ON_FETCH_TEAM_LOCATIONS_ERROR
} from "./actions";

// State layout: Have one key per team and all the info for a team in there
// {
//     123: {
//         description: "",
//         id: 123,
//         challenges: [ /* ... */]
//     }
// }

const initialState = {};

function updateTeamStateWithLocations(state, teamId, locations) {
    const team = update(state[teamId], {
        $apply: (team) => {
            if (!team) {
                return {locations}
            } else {
                team.locations = locations;
                return team;
            }
        }
    });
    return {
        ...state,
        [teamId]: team
    };
}

function updateStateWithChallenges(state, teamId, challenges) {

    challenges.filter(challenge => challenge.status === 'ACCEPTED' || challenge.status === 'WITH_PROOF');

    const team = update(state[teamId], {
        $apply: (team) => {
            if (!team) {
                return {challenges}
            } else {
                team.challenges = challenges;
                return team;
            }
        }
    });
    return {
        ...state,
        [teamId]: team
    };
}

function updateStateWithSponsorings(state, teamId, sponsorings) {
    const team = update(state[teamId], {
        $apply: (team) => {
            if (!team) {
                return {sponsorings}
            } else {
                team.sponsorings = sponsorings;
                return team;
            }
        }
    });
    return {
        ...state,
        [teamId]: team
    };
}

function updateStateWithPostings(state, teamId, postings) {
    const team = update(state[teamId], {
        $apply: (team) => {
            if (!team) {
                return {postings}
            } else {
                team.postings = postings;
                return team;
            }
        }
    });
    return {
        ...state,
        [teamId]: team
    };
}

export default teamProfileReducer = (state = initialState, action) => {
    let teamId;

    switch (action.type) {
        case 'CLEAN_ALL':
            return initialState;

        case ON_FETCH_TEAM_SUCCESS:
            return {
                [action.payload.team.id]: {
                    ...state[action.payload.team.id],
                    ...action.payload.team,
                }
            };
        case ON_FETCH_CHALLENGES_SUCCESS:
            const challenges = action.payload.challenges;
            teamId = action.payload.teamId;
            return updateStateWithChallenges(state, teamId, challenges);

        case ON_FETCH_SPONSORINGS_SUCCESS:
            const sponsorings = action.payload.sponsorings;
            teamId = action.payload.teamId;
            return updateStateWithSponsorings(state, teamId, sponsorings);

        case ON_FETCH_POSTINGS_FOR_TEAM_SUCCESS:
            const postings = action.payload.postings;
            teamId = action.payload.teamId;
            return updateStateWithPostings(state, teamId, postings);
        case ON_FETCH_TEAM_LOCATIONS_SUCCESS:
            const locations = action.payload.locations;
            teamId = action.payload.teamId;
            return updateTeamStateWithLocations(state, teamId, locations);

        case ON_FETCH_TEAM_LOCATIONS_ERROR:
            return {
                ...state,
                fetchEventLocationError: {
                    ...action.payload.error,
                    userMessage: 'Failed to load event locations' // TODO: i18n
                }
            };
        default:
            return state
    }
}