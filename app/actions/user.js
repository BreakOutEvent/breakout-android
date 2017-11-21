import{
  AsyncStorage
}from 'react-native';
import * as types from './types';
const BreakoutApi= require("breakout-api-client");

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
    let curState = getState()
    let loggingIn = curState.isLoggingIn;
    console.log(BreakoutApi);
    dispatch(setLoggingIn(true));
    sendLogin(username,password).then((resp)=>{
      if(resp.success === 1){
        console.log("success");
        saveUserData(username,password).then(()=>{
          dispatch(setUser(resp.account));
        });
      } else {
        console.log("failure");
      }
      dispatch(setLoggingIn(false));
    });
  }
}

// Perform login for user with email and password
// A side effect of this operation is that the returned access token
// is saved in this instance of the class BreakoutApi, so that all following
// requests are authenticated with the users access_token
async function sendLogin(username,password){
  const api = new BreakoutApi("https://backend.break-out.org/", "breakout_app", "TrKtmYL9qsRRTMhhLzZYJVk5", true);
  try {
      await api.login(username,password);
      const me = await api.getMe();
      return{success:1,account:me};
  } catch (err) {
    console.log(err);
    console.log(err.response.data);
    return{success:0,account:{}};
  }
}

//save user data after successful login
async function saveUserData(username,password){
  try{
    await AsyncStorage.setItem('email',username);
    await AsyncStorage.setItem("password",password);
    console.log("user saved");
  } catch(error){
    console.log(error);
  }
}

export async function getUserData(){

}
