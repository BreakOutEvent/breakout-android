import {createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import {logger} from "redux-logger";
import postingReducer from '../postings/reducer';

const store = createStore(postingReducer, applyMiddleware(thunk, logger));

export default store;