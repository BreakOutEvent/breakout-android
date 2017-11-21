import * as types from './types';

export function setUser(user){
  return{
    type: types.SET_USER,
    payload:user
  }
}

export function setUsername(username){
  return {
    type: types.SET_USERNAME,
    payload:username
  }
}

export function setLoggingIn(logging){
  return {
    type: types.LOGGING_IN,
    payload:logging
  }
}

export function login(username,password){
  return (dispatch,getState) => {
    console.log(username+" "+password);
    dispatch(setLoggingIn(true));
  }
}
