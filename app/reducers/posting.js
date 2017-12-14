import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const postings=createReducer([]],{
  [types.SET_POSTINGS](state,action){
    console.log("set postings:" +action.payload);
    return action.payload;
  }
});
