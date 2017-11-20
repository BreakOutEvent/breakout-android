import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

//set the user after login
export const user = createReducer({},{
  [types.SET_USER](state,action){
    console.log("set user: "+action.payload);
    return action.payload;
  }
});

//set the username the user put into the login form
export const username = createReducer("",{
  [types.SET_USERNAME](state,action){
    console.log("set username:" +action.payload);
    return action.payload;
  }
});

//set the username the user put into the login form
export const password = createReducer("",{
  [types.SET_PASSWORD](state,action){
    console.log("set password: "+action.payload);
    return action.payload;
  }
});

//set state for while the app is handling the Login
export const isLoggingIn = createReducer(false,{
  [types.LOGGING_IN](state,action){
    console.log("set logging in: "+action.payload);
    return action.payload;
  }
})
