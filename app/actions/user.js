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

export function login(username,password){
  return (dispatch,getState) => {
    console.log(username+" "+password);
  }
}
