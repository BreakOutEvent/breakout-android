import React from 'react';
import {AppState, PermissionsAndroid, StatusBar} from 'react-native';
import * as Colors from "./config/colors";
import {Provider} from 'react-redux';
import {persistor, store} from './store/store';
import {PersistGate} from "redux-persist/integration/react";
import {onAppStateChanged} from "./screens/login/actions";
import {Sentry} from 'react-native-sentry';
import {ONESIGNAL_APPID, SENTRY_DSN} from './config/secrets';
import {onGeoLocationError, onGeoLocationReceived} from "./background-tracking/actions";
import {onUpdateNotificationToken} from "./notifications/actions";
import {fetchGroupMessage, fetchGroupMessages} from "./screens/messages/actions";
import _ from 'lodash';
import OneSignal from "react-native-onesignal";
import Navigation from "./components/navigation";
import NavigationService from "./utils/navigation-service";

Sentry.config(SENTRY_DSN).install();
console.ignoredYellowBox = ['Remote debugger'];

const MyStatusBar = ({backgroundColor, ...props}) => (
    <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.20)" {...props} />
);

export default class App extends React.Component {

    constructor(properties) {
        super(properties);
        OneSignal.init(ONESIGNAL_APPID);
        OneSignal.inFocusDisplaying(0);
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
        const userId = _.get(store.getState(), 'login.me.id', 0);
        if (notification.payload.additionalData.id && notification.payload.additionalData.type && notification.payload.additionalData.type == "NEW_MESSAGE") {
            setTimeout(() => {
                store.dispatch(fetchGroupMessage(notification.payload.additionalData.id, userId))
            }, 1000) // hacky but notification seems to be faster than DB
        }
        if (notification.payload.additionalData.type || notification.payload.additionalData.type == "ADDED_TO_MESSAGE") {
            store.dispatch(fetchGroupMessages())
        }
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
        if (notification.payload.additionalData.type && notification.payload.additionalData.type == "ADDED_TO_MESSAGE" || notification.payload.additionalData.type == "NEW_MESSAGE") {
            NavigationService.navigate("messagesOverview");
        }
    }

    onIds(device) {
        console.log('device: ', device);
        store.dispatch(onUpdateNotificationToken(device.userId));
    }

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        this.setupBackgroundTracking(); // ignore result promise. We just fire and forget here
        OneSignal.configure();
    }

    async setupBackgroundTracking() {

        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: "Allow access to locations for background tracking",
            message: "BreakOut tracks your travel during the event to calculate your score and show " +
                "your followers how far you have come. For this we need to you give us access to your location"
        });

        // old android versions might return boolean true here whereas newer versions
        // return PermissionsAndroid.RESULTS.GRANTED. Do not use `==` here!
        if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {

            navigator.geolocation.watchPosition((res) => {
                store.dispatch(onGeoLocationReceived(res));
            }, (err) => {
                store.dispatch(onGeoLocationError(err));
            }, {
                maximumAge: 1000 * 60 * 15, // 15 mins
                enableHighAccuracy: false,
                timeout: 1000 * 60 * 5, // 5 minutes,
                distanceFilter: 1000,   // 1km
            });
        } else {
            console.log("User denied permission to access location");
        }
    }

    handleAppStateChange(newAppState) {
        const oldAppState = _.get(store.getState(), 'login.appState');
        store.dispatch(onAppStateChanged(oldAppState, newAppState));
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <MyStatusBar backgroundColor={Colors.Primary}/>
                    <Navigation/>
                </PersistGate>
            </Provider>
        )
    }
}
