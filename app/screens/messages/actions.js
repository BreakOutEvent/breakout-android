import BreakoutApi from 'breakout-api-client';
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../../config/secrets";
import {store} from '../../store/store';
import {withAccessToken} from "../../utils/utils";
import placeHolder from "../../assets/profile_pic_placeholder.jpg";
import {strings} from "./overview-screen.js";
import NavigationService from "../../utils/navigation-service";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG);

export const FETCH_GROUPMESSAGES_SUCCESS = 'FETCH_GROUPMESSAGES_SUCCESS';
export const FETCH_GROUPMESSAGES_ERROR = 'FETCH_GROUPMESSAGES_ERROR';

export const SEND_GROUPMESSAGES_SUCCESS = 'SEND_GROUPMESSAGES_SUCCESS';
export const SEND_GROUPMESSAGES_ERROR = 'SEND_GROUPMESSAGES_ERROR';

export const SET_CURRENT_GROUPMESSAGE_SUCCESS = 'SET_CURRENT_GROUPMESSAGE_SUCCESS';

export const SET_REFRESHING = 'SET_REFRESHING';

export const SET_NEW_MESSAGE_USER_SEARCH_REFRESHING = 'SET_NEW_MESSAGE_USER_SEARCH_REFRESHING';

export const NEW_MESSAGE_USER_SEARCH_SUCCESS = 'NEW_MESSAGE_USER_SEARCH_SUCCESS';
export const NEW_MESSAGE_USER_SEARCH_ERROR = 'NEW_MESSAGE_USER_SEARCH_ERROR';

export const RESET_USER_SEARCH = 'RESET_USER_SEARCH';

export const SET_CREATE_MESSAGE_REFRESHING = 'SET_CREATE_MESSAGE_REFRESHING';
export const CREATE_GROUPMESSAGES_ERROR = 'CREATE_GROUPMESSAGES_ERROR';

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
    const sortedMessages = sortMessageThreads(groupMessages);
    const transformedMessages = sortedMessages.map(thread => transformGroupMessageThread(thread, userId));
    return transformedMessages;
};

function uniqBy(a, key) {
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

export function redirectToThread(thread) {
    return dispatch => {
        dispatch(setCurrentGroupMessage(thread));
        NavigationService.navigate("message", {usersString: thread.usersString})
    }
}

export function fetchGroupMessages() {
    return dispatch => {
        dispatch(setRefreshing());
        withAccessToken(api, store.getState())
            .getMe()
            .then(me => Promise.all(me.groupMessageIds.map(id =>
                withAccessToken(api, store.getState()).getGroupMessage(id)))
                .then(groupMessages => {
                    const transformedMessages = transformGroupMessages(groupMessages, me.id);
                    dispatch(onFetchGroupMessagesSuccess(transformedMessages, me.id));
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

export function newMessageUserSearch(text) {
    return dispatch => {
        dispatch(setUserSearchRefreshing(text));
        withAccessToken(api, store.getState())
            .searchUser(text)
            .then((data) => {
                const uniqueResults = uniqBy(data, (item) => item.id);
                dispatch(onNewMessageUserSearchResult(uniqueResults.filter(result => result.firstname)))
            })
            .catch(error => dispatch(onNewMessageUserSearchError(error)))
    }
}

export function createGroupMessage(item, groupMessages, userId) {
    return dispatch => {
        dispatch(setCreateMessageRefreshing());

        const alreadyExistingGroupMessage = groupMessages
            .filter(thread => thread.users.length === 2)
            .find(thread => thread.users.find(user => user.id === item.id));

        if (alreadyExistingGroupMessage) {
            dispatch(redirectToThread(alreadyExistingGroupMessage))
        } else {
            withAccessToken(api, store.getState())
                .createGroupMessage([item.id])
                .then((data) => {
                    const transformedThread = transformGroupMessageThread(data, userId);
                    dispatch(redirectToThread(transformedThread))
                })
                .catch(error => dispatch(onCreateGroupMessageError(error)))
        }
    }
}

export function resetUserSearch() {
    return dispatch => {
        dispatch(onResetUserSearch());
    }
}

export function setCurrentGroupMessage(currentGroupMessage) {
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

function setUserSearchRefreshing(text, refreshing = true) {
    return {
        type: SET_NEW_MESSAGE_USER_SEARCH_REFRESHING,
        payload: {text, refreshing}
    }
}

function setCreateMessageRefreshing(refreshing = true) {
    return {
        type: SET_CREATE_MESSAGE_REFRESHING,
        payload: {refreshing}
    }
}


function onNewMessageUserSearchResult(result) {
    return {
        type: NEW_MESSAGE_USER_SEARCH_SUCCESS,
        payload: {result}
    }
}

function onNewMessageUserSearchError(error) {
    return {
        type: NEW_MESSAGE_USER_SEARCH_ERROR,
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

function onCreateGroupMessageError(error) {
    return {
        type: CREATE_GROUPMESSAGES_ERROR,
        payload: {error}
    }
}

function onResetUserSearch() {
    return {
        type: RESET_USER_SEARCH,
        payload: {}
    }
}

function onSetCurrentGroupMessageSuccess(currentGroupMessage) {
    return {
        type: SET_CURRENT_GROUPMESSAGE_SUCCESS,
        payload: {currentGroupMessage}
    }
}
