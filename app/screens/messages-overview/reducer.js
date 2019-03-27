import {
    FETCH_GROUPMESSAGES_ERROR,
    FETCH_GROUPMESSAGES_SUCCESS,
} from "./actions";

const initialState = {
    groupMessages: [],
    userId: 1,
    refreshing: false,
    error: null
};

export default groupMessagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CLEAN_ALL':
            return initialState;

        case FETCH_GROUPMESSAGES_SUCCESS:
            return {
                ...state,
                groupMessages: [...action.payload.groupMessages],
                userId: action.payload.userId,
                fetchGroupMessagesError: null,
            };
        case FETCH_GROUPMESSAGES_ERROR:
            return {
                ...state,
                fetchGroupMessagesError: {
                    ...action.payload.error,
                    userMessage: 'Failed to load messages' // TODO: i18n
                }
            };
        default:
            return state;
    }
};
