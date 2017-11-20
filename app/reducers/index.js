import {combineReducers} from 'redux';
import * as userReducers from './user';

export default combineReducers(Object.assign(userReducers));
