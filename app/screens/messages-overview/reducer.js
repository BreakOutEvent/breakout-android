import {
    FETCH_GROUPMESSAGES_ERROR,
    FETCH_GROUPMESSAGES_SUCCESS,
    SEND_GROUPMESSAGES_SUCCESS,
    SEND_GROUPMESSAGES_ERROR,
    SET_GROUPMESSAGE_ID_SUCCESS,
    SET_REFRESHING
} from "./actions";

const initialState = {
    groupMessages: [],
    userId: 1,
    refreshing: false,
    error: null,
    groupMessageId: null
};

function updateGroupMessagesForThread(groupMessages, updatedTread) {
    const filteredGroupMessages = groupMessages.filter(g => g.id != updatedTread.id);
    filteredGroupMessages.push(updatedTread);

    // sorry for copied code from actions
    const lastMessageTimeStampOrZero = (thread) => {
        const lastMessage = thread.messages[thread.messages.length - 1];
        return lastMessage ? lastMessage.date : 0;
    };
    const sortedMessages = filteredGroupMessages.sort((a, b) => {
        return lastMessageTimeStampOrZero(b) - lastMessageTimeStampOrZero(a);
    });
    return sortedMessages;
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

        case SEND_GROUPMESSAGES_SUCCESS:
            return {
                ...state,
                groupMessages: updateGroupMessagesForThread(state.groupMessages, action.payload.data)
            };
        case SEND_GROUPMESSAGES_ERROR:
            return {
                ...state,
                sendGroupMessagesError: {
                    ...action.payload.error,
                    userMessage: 'Failed to send message' // TODO: i18n
                }
            };

        case SET_GROUPMESSAGE_ID_SUCCESS:
            return {
                ...state,
                groupMessageId: action.payload.groupMessageId,
            };

        case SET_REFRESHING:
            return {
                ...state,
                refreshing: action.payload.refreshing,
            };

        default:
            return state;
    }
};
