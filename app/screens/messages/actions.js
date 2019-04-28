import BreakoutApi from 'breakout-api-client';
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../../config/secrets";
import {store} from '../../store/store';
import {withAccessToken} from "../../utils/utils";
import placeHolder from "../../assets/profile_pic_placeholder.jpg";
import {strings} from "./overview-screen.js";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG);

export const FETCH_GROUPMESSAGES_SUCCESS = 'FETCH_GROUPMESSAGES_SUCCESS';
export const FETCH_GROUPMESSAGES_ERROR = 'FETCH_GROUPMESSAGES_ERROR';

export const SEND_GROUPMESSAGES_SUCCESS = 'SEND_GROUPMESSAGES_SUCCESS';
export const SEND_GROUPMESSAGES_ERROR = 'SEND_GROUPMESSAGES_ERROR';

export const SET_CURRENT_GROUPMESSAGE_SUCCESS = 'SET_CURRENT_GROUPMESSAGE_SUCCESS';

export const SET_REFRESHING = 'SET_REFRESHING';

export const transformGroupMessageThread = (thread, userId) => {
    thread.userId = userId;
    thread.usersString = thread.users.filter(user => user.id != userId).map(user => user.firstname ? user.firstname : strings.someUsername).join(", ");
    thread.messages = thread.messages
        .sort((a, b) => b.date - a.date)
        .map(({id, creator, text, date}) => {
            const profilePic = () => {
                if (creator.profilePic) {
                    return creator.profilePic.url;
                } else {
                    return placeHolder;
                }
            };

            return {
                _id: id,
                text: text,
                createdAt: new Date(date * 1000).getTime(),
                user: {
                    _id: creator.id,
                    name: creator.firstname || "",
                    avatar: profilePic(),
                },
            };
        });
    return thread;
};

const sortMessageThreads = (groupMessages) => {
    const lastMessageTimeStampOrZero = (thread) => {
        const lastMessage = thread.messages[thread.messages.length - 1];
        return lastMessage ? lastMessage.date : 0;
    };
    const sortedMessages = groupMessages.sort((a, b) => {
        return lastMessageTimeStampOrZero(b) - lastMessageTimeStampOrZero(a);
    });

    return sortedMessages;
};

const transformGroupMessages = (groupMessages, userId) => {
   const  sortedMessages = sortMessageThreads(groupMessages);
    const transformedMessages = sortedMessages.map(thread => transformGroupMessageThread(thread, userId));
    return transformedMessages;
};

export function fetchGroupMessages() {
    return dispatch => {
        dispatch(setRefreshing());
        withAccessToken(api, store.getState())
            .getMe()
            .then(me => Promise.all(me.groupMessageIds.map(id =>
                withAccessToken(api, store.getState()).getGroupMessage(id)))
                .then(groupMessages => {
                    const transformedMessages = transformGroupMessages(groupMessages, me.id);
                    dispatch(onFetchGroupMessagesSuccess(transformedMessages, me.id))
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

export function setCurrentGroupMessage(currentGroupMessage) {
    console.log("setCurrentGroupMessage", currentGroupMessage);
    return dispatch => {
        dispatch(onSetCurrentGroupMessageSuccess(currentGroupMessage))
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

function setRefreshing(refreshing = true) {
    return {
        type: SET_REFRESHING,
        payload: {refreshing}
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

function onSetCurrentGroupMessageSuccess(currentGroupMessage) {
    return {
        type: SET_CURRENT_GROUPMESSAGE_SUCCESS,
        payload: {currentGroupMessage}
    }
}
