import {
    ON_CHALLENGE_SELECTED,
    ON_FETCH_CHALLENGES_FOR_TEAM_ERROR,
    ON_FETCH_CHALLENGES_FOR_TEAM_SUCCESS,
    ON_FULFILL_CHALLENGE_ERROR,
    ON_GET_CURRENT_POSITION_ERROR, ON_GET_CURRENT_POSITION_IN_PROGRESS,
    ON_GET_CURRENT_POSITION_SUCCESS,
    ON_IMAGE_SELECTED,
    ON_POSTING_TEXT_CHANGED,
    ON_UPLOAD_POSTING_ERROR,
    ON_UPLOAD_POSTING_IN_PROGRESS,
    ON_UPLOAD_POSTING_SUCCESS,
    ON_UPLOAD_PROGRESS,
    ON_VIDEO_SELECTED
} from "./actions";

const initialState = {
    media: null,
    challenges: [],
    text: '',
    selectedChallenge: null
};

export default createPostingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CLEAR_STATE':
            return {};
        case ON_FETCH_CHALLENGES_FOR_TEAM_SUCCESS:

            const filteredChallenges = action.payload.challenges.filter(challenge =>
                challenge.status !== 'PROOF_REJECTED' && challenge.status !== 'WITHDRAWN' && challenge.status !== 'WITH_PROOF'
            );

            return {
                ...state,
                challenges: filteredChallenges
            };
        case ON_FETCH_CHALLENGES_FOR_TEAM_ERROR:
            // TODO: Handle me
            return {
                ...state,
                fetchChallengesForTeamError: action.payload.error
            };

        case ON_GET_CURRENT_POSITION_SUCCESS:
            return {
                ...state,
                location: action.payload.location,
                getCurrentPositionInProgress: false,
                getCurrentPositionError: false
            };
        case ON_GET_CURRENT_POSITION_ERROR:
            // TODO: handle me
            return {
                ...state,
                getCurrentPositionError: action.payload.error,
                getCurrentPositionInProgress: false
            };

        case ON_GET_CURRENT_POSITION_IN_PROGRESS:
            return {
                ...state,
                getCurrentPositionInProgress: true,
                getCurrentPositionError: false
            };

        case ON_CHALLENGE_SELECTED:
            return {
                ...state,
                selectedChallenge: action.payload.challengeId
            };
        case ON_IMAGE_SELECTED:
            return {
                ...state,
                media: action.payload.image
            };

        case ON_VIDEO_SELECTED:
            return {
                ...state,
                media: action.payload.video
            };

        case ON_POSTING_TEXT_CHANGED:
            return {
                ...state,
                text: action.payload.text
            };

        case ON_UPLOAD_POSTING_IN_PROGRESS:
            return {
                ...state,
                inProgress: true
            };
        case ON_UPLOAD_POSTING_ERROR:
            return {
                ...state,
                uploadPostingError: {error: action.payload.error},
                inProgress: false,
                success: false
            };
        case ON_UPLOAD_POSTING_SUCCESS:
            return {
                success: true,
                inProgress: false
            };
        case ON_FULFILL_CHALLENGE_ERROR:
            return {
                ...state,
                fulfillChallengeError: action.payload.error
            };

        case ON_UPLOAD_PROGRESS:
            return {
                ...state,
                uploadProgress: action.payload.progress
            };
        default:
            return state;
    }
}