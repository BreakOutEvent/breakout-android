import BreakoutApi from 'breakout-api-client';
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../../config/secrets";
import {store} from '../../store/store';
import {withAccessToken} from "../../utils/utils";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG);

export const FETCH_GROUPMESSAGES_SUCCESS = 'FETCH_GROUPMESSAGES_SUCCESS';
export const FETCH_GROUPMESSAGES_ERROR = 'FETCH_GROUPMESSAGES_ERROR';

export const SEND_GROUPMESSAGES_SUCCESS = 'SEND_GROUPMESSAGES_SUCCESS';
export const SEND_GROUPMESSAGES_ERROR = 'SEND_GROUPMESSAGES_ERROR';

export const SET_GROUPMESSAGE_ID_SUCCESS = 'SET_GROUPMESSAGE_ID_SUCCESS';

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
                    dispatch(onFetchGroupMessagesSuccess(sortedMessages, me.id))
                })
                .catch(error => dispatch(onFetchGroupMessagesError(error))))
            .catch(error => dispatch(onFetchGroupMessagesError(error)))
    }
}

export function sendGroupMessage(groupMessageId, text) {
    return dispatch => {
        withAccessToken(api, store.getState())
            .groupMessageAddMessage(groupMessageId, {text: text, date: new Date().getTime() / 1000})
            .then((data) => dispatch(onSendGroupMessagesSuccess(data)))
            .catch(error => dispatch(onSendGroupMessagesError(error)))
    }
}

export function setGroupMessageId(groupMessageId) {
    return dispatch => {
        dispatch(onSetGroupMessageIdSuccess(groupMessageId))
    }
}

function onFetchGroupMessagesSuccess(groupMessages, userId) {
    return {
        type: FETCH_GROUPMESSAGES_SUCCESS,
        payload: {groupMessages, userId}
    }
}

function onFetchGroupMessagesError(error) {
    return {
        type: FETCH_GROUPMESSAGES_ERROR,
        payload: {error}
    }
}

function onSendGroupMessagesSuccess(data) {
    return {
        type: SEND_GROUPMESSAGES_SUCCESS,
        payload: {data}
    }
}

function onSendGroupMessagesError(error) {
    return {
        type: SEND_GROUPMESSAGES_ERROR,
        payload: {error}
    }
}

function onSetGroupMessageIdSuccess(groupMessageId) {
    return {
        type: SET_GROUPMESSAGE_ID_SUCCESS,
        payload: {groupMessageId}
    }
}
