import {applyMiddleware, combineReducers, createStore} from "redux";
import thunk from 'redux-thunk';
import {logger} from "redux-logger";
import postingReducer from '../postings/reducer';
import loginReducer from '../login/reducer';
import teamProfileReducer from '../team-profile/reducer';
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from "redux-persist";

const persistConfig = {
    key: 'root',
    storage
};

const rootReducer = combineReducers({
    postings: postingReducer,
    login: loginReducer,
    team: teamProfileReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, applyMiddleware(thunk, logger));
export const persistor = persistStore(store);

// persistor.purge();