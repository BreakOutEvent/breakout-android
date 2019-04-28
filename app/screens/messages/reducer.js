import {
    FETCH_GROUPMESSAGES_ERROR,
    FETCH_GROUPMESSAGES_SUCCESS,
    SEND_GROUPMESSAGES_SUCCESS,
    SEND_GROUPMESSAGES_ERROR,
    SET_CURRENT_GROUPMESSAGE_SUCCESS,
    SET_REFRESHING,
    SET_NEW_MESSAGE_USER_SEARCH_REFRESHING,
    NEW_MESSAGE_USER_SEARCH_SUCCESS,
    NEW_MESSAGE_USER_SEARCH_ERROR,
    RESET_USER_SEARCH,
    SET_CREATE_MESSAGE_REFRESHING,
    CREATE_GROUPMESSAGES_ERROR,
    transformGroupMessageThread
} from "./actions";

const initialState = {
    groupMessages: [],
    userId: 1,
    refreshing: false,
    error: null,
    currentGroupMessage: null,
    newMessageSearchString: "",
    newMessageSearchResults: [],
    newMessageSearchRefreshing: false,
    createMessageRefreshing: false
};

function updateGroupMessagesForThread(groupMessages, updatedThread, userId) {
    const filteredGroupMessages = groupMessages.filter(g => g.id != updatedThread.id);
    filteredGroupMessages.unshift(transformGroupMessageThread(updatedThread, userId));
    return filteredGroupMessages;
}

export default groupMessagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CLEAN_ALL':
            return initialState;

        case FETCH_GROUPMESSAGES_SUCCESS:
            return {
                ...state,
                refreshing: false,
                groupMessages: [...action.payload.groupMessages],
                userId: action.payload.userId,
                fetchGroupMessagesError: null,
                currentGroupMessage: state.currentGroupMessage ? action.payload.groupMessages.find(item => item.id === state.currentGroupMessage.id) : null
            };
        case FETCH_GROUPMESSAGES_ERROR:
            return {
                ...state,
                refreshing: false,
                fetchGroupMessagesError: {
                    ...action.payload.error,
                    userMessage: 'Failed to load messages' // TODO: i18n
                }
            };

        case SEND_GROUPMESSAGES_SUCCESS: {
            const updatedGroupMessages = updateGroupMessagesForThread(state.groupMessages, action.payload.data, state.currentGroupMessage.userId);
            return {
                ...state,
                groupMessages: updatedGroupMessages,
                currentGroupMessage: state.currentGroupMessage ? updatedGroupMessages.find(item => item.id === state.currentGroupMessage.id) : null
            };
        }
        case SEND_GROUPMESSAGES_ERROR:
            return {
                ...state,
                sendGroupMessagesError: {
                    ...action.payload.error,
                    userMessage: 'Failed to send message' // TODO: i18n
                }
            };

        case SET_CURRENT_GROUPMESSAGE_SUCCESS:
            return {
                ...state,
                currentGroupMessage: action.payload.currentGroupMessage,
            };

        case SET_REFRESHING:
            return {
                ...state,
                refreshing: action.payload.refreshing,
            };

        case SET_NEW_MESSAGE_USER_SEARCH_REFRESHING:
            return {
                ...state,
                newMessageSearchString: action.payload.text,
                newMessageSearchRefreshing: action.payload.refreshing,
            };

        case NEW_MESSAGE_USER_SEARCH_SUCCESS:
            return {
                ...state,
                newMessageSearchRefreshing: false,
                newMessageSearchResults: action.payload.result,
                newMessagesUserSearchError: {}
            };


        case NEW_MESSAGE_USER_SEARCH_ERROR:
            return {
                ...state,
                newMessageSearchRefreshing: false,
                newMessagesUserSearchError: {
                    ...action.payload.error,
                    userMessage: 'Failed to search User' // TODO: i18n
                }
            };

        case CREATE_GROUPMESSAGES_ERROR:
            return {
                ...state,
                newMessageSearchRefreshing: false,
                createGroupMessageError: {
                    ...action.payload.error,
                    userMessage: 'Failed to create groupmessage' // TODO: i18n
                }
            };

        case SET_CREATE_MESSAGE_REFRESHING:
            return {
                ...state,
                createMessageRefreshing: action.payload.refreshing
            };

        case RESET_USER_SEARCH:
            return {
                ...state,
                newMessageSearchString: "",
                newMessageSearchResults: [],
                newMessageSearchRefreshing: false,
                createMessageRefreshing: false
            };

        default:
            return state;
    }
};
