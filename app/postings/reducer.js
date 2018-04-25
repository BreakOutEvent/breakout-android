import {
    FETCH_NEW_POSTINGS_ERROR,
    FETCH_NEW_POSTINGS_IN_PROGRESS,
    FETCH_NEW_POSTINGS_SUCCESS,
    FETCH_NEXT_PAGE_ERROR,
    FETCH_NEXT_PAGE_SUCCESS,
    LIKE_POSTING_SUCCESS
} from "./actions";
import update from 'immutability-helper';

const initialState = {
    postings: [],
    currentPage: 0,
    refreshing: false,
    error: null
};

export default postingReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_NEXT_PAGE_SUCCESS:
            return {
                ...state,
                postings: [...state.postings, ...action.payload.postings],
                currentPage: state.currentPage + 1,
                fetchNewPostingsError: null,
                fetchNextPageError: null,
            };
        case FETCH_NEXT_PAGE_ERROR:
            return {
                ...state,
                fetchNextPageError: {
                    ...action.payload.error,
                    userMessage: 'Failed to load more postings' // TODO: i18n
                }
            };
        case FETCH_NEW_POSTINGS_IN_PROGRESS:
            return {
                ...state,
                refreshing: true,
                fetchNewPostingsError: null,
                fetchNextPageError: null,
            };
        case FETCH_NEW_POSTINGS_SUCCESS:
            return {
                ...state,
                refreshing: false,
                postings: [...action.payload.postings],
                fetchNewPostingsError: null,
                fetchNextPageError: null,
            };
        case FETCH_NEW_POSTINGS_ERROR:
            return {
                ...state,
                refreshing: false,
                fetchNewPostingsError: {
                    ...action.payload.error,
                    userMessage: 'Failed to load new postings' // TODO: i18n
                }
            };
        case LIKE_POSTING_SUCCESS:
            return {
                ...state,
                postings: update(state.postings, {
                    $apply: (postings) => {
                        return postings.map(posting => {
                            if (posting.id === action.payload.postingId) {
                                posting.hasLiked = true;
                                posting.likes = posting.likes + 1
                            }
                            return posting;
                        });
                    }
                })
            };
        default:
            console.warn(`Unknown action '${action.type}'. Returning unchanged state`);
            return state;
    }
};