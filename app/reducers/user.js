import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

export const user = createReducer({},{
  [types.SET_USER](state,action){
    console.log("set user: "+action.payload);
    return action.payload;
  }
})
