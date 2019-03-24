import BreakoutApi from 'breakout-api-client';
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../../config/secrets";
import {store} from '../../store/store';
import {withAccessToken} from "../../utils/utils";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG);

export const FETCH_GROUPMESSAGES_SUCCESS = 'FETCH_GROUPMESSAGES_SUCCESS';
export const FETCH_GROUPMESSAGES_ERROR = 'FETCH_GROUPMESSAGES_ERROR';


export function fetchGroupMessages() {
    return dispatch => {
        withAccessToken(api, store.getState())
            .getMe()
            .then(me => Promise.all(me.groupMessageIds.map(id =>
                withAccessToken(api, store.getState()).getGroupMessage(id)))
                .then(groupMessages => {
                    const lastMessageTimeStampOrZero = (thread) => {
                        const lastMessage = thread.messages[thread.messages.length - 1];
                        return lastMessage ? lastMessage.date : 0;
                    };
                    const sortedMessages = groupMessages.sort((a, b) => {
                        return lastMessageTimeStampOrZero(b) - lastMessageTimeStampOrZero(a);
                    });
                    dispatch(onFetchGroupMessagesSuccess(sortedMessages))
                })
                .catch(error => dispatch(onFetchGroupMessagesError(error))))
            .catch(error => dispatch(onFetchGroupMessagesError(error)))
    }
}

function onFetchGroupMessagesSuccess(groupMessages) {
    return {
        type: FETCH_GROUPMESSAGES_SUCCESS,
        payload: {groupMessages}
    }
}

function onFetchGroupMessagesError(error) {
    return {
        type: FETCH_GROUPMESSAGES_ERROR,
        payload: {error}
    }
}
