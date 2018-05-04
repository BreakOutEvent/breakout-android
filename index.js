import React, {
	Component
} from 'react';
import { AppRegistry } from 'react-native';
import {
  Provider
} from 'react-redux';
import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose
} from 'redux';
import {
  createLogger
} from 'redux-logger';
import reducer from './app/reducers';
import thunkMiddleware from 'redux-thunk';

import Home from './app/containers/Home';
import AppContainer from './app/containers/AppContainer';
import {SENTRY_DSN} from "./app/secrets/config";
import { Sentry } from 'react-native-sentry';
Sentry.config(SENTRY_DSN).install();

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  );
  return createStore(reducer, initialState, enhancer);
}

const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});

const store = configureStore({});
const BreakOut = () => {
  return(
    <Provider store={store}>
      <AppContainer/>
    </Provider>
  );
}

AppRegistry.registerComponent('BreakOut', () => BreakOut);
