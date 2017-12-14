import{
  AsyncStorage
}from 'react-native';
import * as types from './types';
import * as Config from '../secrets/config'
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

//add access token to current global state
export function setAccessToken(accessToken){
  return {
    type: types.SET_ATOKEN,
    payload:accessToken
  }
}

//add refresh token to current global state
export function setRefreshToken(refreshToken){
  return {
    type: types.SET_RTOKEN,
    payload:refreshToken
  }
}

export function login(username,password){
  return (dispatch,getState) => {
    console.log(username+" "+password);
    const curState = getState()
    const loggingIn = curState.isLoggingIn;
    console.log(BreakoutApi);
    dispatch(setLoggingIn(true));

    sendLogin(username,password).then((resp)=>{
      if(resp.success === 1){
        dispatch(setUser(resp.account));
        getAccessToken().then((resp) => {
          dispatch(setAccessToken(resp));
        });
        getRefreshToken().then((resp) => {
          dispatch(setRefreshToken(resp));
        });
        console.log(resp.account);
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
  const api = new BreakoutApi(Config.BASE_URL,Config.CLIENT_NAME,Config.CLIENT_SECRET,Config.DEBUG);
  try {
      await api.login(username,password).then((data) => {
        console.log(data);
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        if(accessToken.length>0 && refreshToken.length>0){
          //quick solution, needs to be stringified nicely after prototype
          saveTokens(accessToken,refreshToken);
        }
      });
      const me = await api.getMe();
      return{success:1,account:me};
  } catch (err) {
    console.log("Error on Login: "+err);
    console.log(err.response.data);
    return{success:0,account:{}};
  }
}

//save tokens after successfull login
async function saveTokens(accessToken,refreshToken){
  console.log(accessToken+" "+refreshToken);
  try{
    await AsyncStorage.setItem('oauth-token',''+accessToken);
    await AsyncStorage.setItem('refresh-token',''+refreshToken);
    console.log("user saved");
  } catch(error){
    console.log("Error on saving user data: ");
    console.log(error);
  }
}



async function getAccessToken(){
  try{
      const token = await AsyncStorage.getItem('oauth-token');
      return token;
  } catch(err){
    console.log('error fetching token');
    console.log(err);
    return '';
  }
}

async function getRefreshToken(){
  try{
      const token = await AsyncStorage.getItem('refresh-token');
      return token;
  } catch(err){
    console.log('error fetching token');
    console.log(err);
    return '';
  }
}
