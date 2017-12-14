import{
  AsyncStorage
}from 'react-native';
import * as types from './types';
import * as Config from '../secrets/config'
const BreakoutApi= require("breakout-api-client");

export function fetchPostings(){
  return(dispatch,state)=>{
    const api = new BreakoputApi(Config.BASE_URL,Config.CLIENT_NAME,Config.CLIENT_SECRET,Congif.DEBUG);
    console.log(api)
  }
}
