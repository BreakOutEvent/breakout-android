import BreakoutApi from 'breakout-api-client';
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../../config/secrets";
import {store} from '../../store/store';
import {withAccessToken} from "../../utils/utils";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG);

export const FETCH_NEXT_PAGE_SUCCESS = 'FETCH_NEXT_PAGE_SUCCESS';
export const FETCH_NEXT_PAGE_ERROR = 'FETCH_NEXT_PAGE_ERROR';

export const FETCH_NEW_POSTINGS_IN_PROGRESS = 'FETCH_NEW_POSTINGS_IN_PROGRESS';
export const FETCH_NEW_POSTINGS_SUCCESS = 'FETCH_NEW_POSTINGS_SUCCESS';
export const FETCH_NEW_POSTINGS_ERROR = 'FETCH_NEW_POSTINGS_ERROR';

export const LIKE_POSTING_SUCCESS = 'LIKE_POSTING_SUCCESS';
export const LIKE_POSTING_ERROR = 'LIKE_POSTING_ERROR';

export function fetchNextPage(nextPage) {
    return dispatch => {
        withAccessToken(api, store.getState())
            .fetchPostings(nextPage)
            .then(postings => dispatch(onFetchNextPageSuccess(postings)))
            .catch(error => dispatch(onFetchNextPageError(error)))
    }
}

export function fetchNewPostings() {
    return dispatch => {
        dispatch(onFetchNewPostingsInProgress());
        withAccessToken(api, store.getState())
            .fetchPostings(0)
            .then(postings => dispatch(onFetchNewPostingsSuccess(postings)))
            .catch(error => dispatch(onFetchNewPostingsError(error)))
    }
}

export function addLike(postingId) {
    return dispatch => {
        withAccessToken(api, store.getState())
            .likePosting(postingId)
            .then(() => dispatch(onLikePostingSuccess(postingId)))
            .catch(error => dispatch(onLikePostingError(error)))
    }
}

function onFetchNewPostingsInProgress() {
    return {
        type: FETCH_NEW_POSTINGS_IN_PROGRESS
    }
}

function onFetchNewPostingsError(error) {
    return {
        type: FETCH_NEW_POSTINGS_ERROR,
        payload: {error}
    }
}

function onFetchNewPostingsSuccess(postings) {
    return {
        type: FETCH_NEW_POSTINGS_SUCCESS,
        payload: {postings}
    };
}

function onFetchNextPageSuccess(postings) {
    return {
        type: FETCH_NEXT_PAGE_SUCCESS,
        payload: {postings}
    }
}

function onFetchNextPageError(error) {
    return {
        type: FETCH_NEXT_PAGE_ERROR,
        payload: {error}
    }
}

function onLikePostingSuccess(postingId) {
    return {
        type: LIKE_POSTING_SUCCESS,
        payload: {postingId}
    }
}

function onLikePostingError(postingId) {
    return {
        type: LIKE_POSTING_ERROR,
        payload: {postingId}
    }
}