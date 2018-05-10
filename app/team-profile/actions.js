import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../secrets/config";
import BreakoutApi from "breakout-api-client";
import {withAccessToken} from "../utils/utils";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG);

export const ON_FETCH_TEAM_SUCCESS = 'ON_FETCH_TEAM_SUCCESS';
export const ON_FETCH_TEAM_ERROR = 'ON_FETCH_TEAM_ERROR';
export const ON_FETCH_CHALLENGES_SUCCESS = 'ON_FETCH_CHALLENGES_SUCCESS';
export const ON_FETCH_CHALLENGES_ERROR = 'ON_FETCH_CHALLENGES_ERROR';
export const ON_FETCH_SPONSORINGS_SUCCESS = 'ON_FETCH_SPONSORINGS_SUCCESS';
export const ON_FETCH_SPONSORINGS_ERROR = 'ON_FETCH_SPONSORINGS_ERROR';
export const ON_FETCH_POSTINGS_FOR_TEAM_SUCCESS = 'ON_FETCH_POSTINGS_FOR_TEAM_SUCCESS';
export const ON_FETCH_POSTINGS_FOR_TEAM_ERROR = 'ON_FETCH_POSTINGS_FOR_TEAM_ERROR';

function onFetchTeamSuccess(team) {
    return {
        type: ON_FETCH_TEAM_SUCCESS,
        payload: {team}
    }
}

function onFetchTeamError(error) {
    return {
        type: ON_FETCH_TEAM_ERROR,
        payload: {error}
    }
}

function onFetchChallengesSuccess(teamId, challenges) {
    return {
        type: ON_FETCH_CHALLENGES_SUCCESS,
        payload: {
            teamId: teamId,
            challenges
        }
    }
}

function onFetchChallengesError(teamId, challenges) {
    return {
        type: ON_FETCH_CHALLENGES_ERROR,
        payload: {
            teamId: teamId,
            challenges,
        }
    }
}

function onFetchSponsoringsSuccess(teamId, sponsorings) {
    return {
        type: ON_FETCH_SPONSORINGS_SUCCESS,
        payload: {
            teamId: teamId,
            sponsorings,
        }
    }
}

function onFetchSponsoringsError(teamId, error) {
    return {
        type: ON_FETCH_SPONSORINGS_ERROR,
        payload: {error}
    }
}

// TODO: Naming
export const onTeamProfileOpened = (teamId) => {
    return (dispatch) => {

        withAccessToken(api)
            .getTeamById(teamId)
            .then(team => dispatch(onFetchTeamSuccess(team)))
            .catch(error => dispatch(onFetchTeamError(error)));
        // do not wait for the above to succeed, there is no need to here
        withAccessToken(api)
            .fetchChallengesForTeam(teamId)
            .then(challenges => dispatch(onFetchChallengesSuccess(teamId, challenges)))
            .catch(error => dispatch(onFetchChallengesError(teamId, error)));

        withAccessToken(api)
            .fetchSponsoringsForTeam(teamId)
            .then(sponsorings => dispatch(onFetchSponsoringsSuccess(teamId, sponsorings)))
            .catch(error => dispatch(onFetchSponsoringsError(teamId, error)))
    }
};

function onFetchPostingsForTeamSuccess(teamId, postings) {
    return {
        type: ON_FETCH_POSTINGS_FOR_TEAM_SUCCESS,
        payload: {
            teamId,
            postings: postings
        }
    }
}

function onFetchPostingsForTeamError(teamId, error) {
    return {
        type: ON_FETCH_POSTINGS_FOR_TEAM_ERROR,
        payload: {
            teamId,
            error
        }
    }
}

export const fetchNewPostingsForTeam = (teamId) => (dispatch) => {
    withAccessToken(api)
        .fetchPostingsForTeam(teamId)
        .then(postings => dispatch(onFetchPostingsForTeamSuccess(teamId, postings)))
        .catch(error => dispatch(onFetchPostingsForTeamError(teamId, error)));
};

