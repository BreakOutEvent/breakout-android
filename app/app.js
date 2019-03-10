import React from 'react';
import {AppState, PermissionsAndroid, Text, View, StatusBar} from 'react-native';
import {DrawerItems, DrawerNavigator, StackNavigator} from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import {Icon, List, ListItem} from 'native-base'
import {NavigationActions} from 'react-navigation';
import ConnectedPostingList from "./screens/postings/screen";
import MapScreen from "./components/map";
import AllTeams from "./screens/all-teams/screen";
import TeamOverviewScreen from "./screens/team-profile/team-profile";
import CreatePostingScreen from "./screens/create-posting/screen";
import * as Colors from "./config/colors";
import {connect, Provider} from 'react-redux';
import {persistor, store} from './store/store';
import {PersistGate} from "redux-persist/integration/react";
import LoginScreen from './screens/login/screen';
import {onAppStateChanged} from "./screens/login/actions";
import {Sentry} from 'react-native-sentry';
import {SENTRY_DSN} from './config/secrets';
import {onGeoLocationError, onGeoLocationReceived} from "./background-tracking/actions";
import {ProfilePic} from "./components/posting";
import _ from 'lodash';

Sentry.config(SENTRY_DSN).install();

console.ignoredYellowBox = ['Remote debugger'];

const drawerButton = (navigation) =>
    (<Icon name='menu' style={{padding: 10, paddingRight: 20, color: 'white'}}
           onPress={() => navigation.navigate('DrawerToggle')}/>);

const stacked = (Screen, title = 'BreakOut', borderLess = false) => StackNavigator({
    screen: Screen
}, {
    navigationOptions: ({navigation}) => ({
        headerStyle: (borderLess) ? {
            backgroundColor: Colors.Primary,
            borderBottomWidth: 0,
            elevation: 0, paddingTop: StatusBar.currentHeight,
            height: StatusBar.currentHeight + 56
        } : {
            backgroundColor: Colors.Primary,
            paddingTop: StatusBar.currentHeight,
            height: StatusBar.currentHeight + 56
        },
        headerTintColor: 'white',
        gesturesEnabled: false,
        headerLeft: drawerButton(navigation),
        title: title
    })
});

function buildNavOptions({navigation}) {

    const routeName = _.get(navigation, 'state.routeName');
    const teamName = _.get(navigation, 'state.params.teamName');

    if (routeName === "aTeam") {
        return {
            headerStyle: {backgroundColor: Colors.Primary, borderBottomWidth: 0, elevation: 0},
            title: `${teamName}`,
            headerTintColor: 'white',
        }
    } else {
        return {
            headerStyle: {backgroundColor: Colors.Primary},
            headerLeft: drawerButton(navigation),
            headerTintColor: 'white',
            title: 'All Teams'
        }
    }
}

const MyStatusBar = ({backgroundColor, ...props}) => (
    <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.20)" {...props} />
);

const AllTeamsStack = StackNavigator({
    allTeams: {screen: AllTeams},
    aTeam: {screen: TeamOverviewScreen}
}, {
    navigationOptions: buildNavOptions,
});

const YourTeam = StackNavigator({
    aTeam: {
        screen: ({navigation}) => {
            const teamId = _.get(store.getState(), 'login.me.participant.teamId');
            return <TeamOverviewScreen teamId={teamId} navigation={{...navigation}}/>
        }
    }
}, {
    navigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: Colors.Primary,
            borderBottomWidth: 0,
            elevation: 0,
            paddingTop: StatusBar.currentHeight,
            height: StatusBar.currentHeight + 56
        },
        title: `Your Team`,
        headerTintColor: 'white',
        headerLeft: drawerButton(navigation),
        drawerIcon: () => <Icon name='contact'/>
    })
});

const DrawerHeader = (props) => {
    const teamName = props.teamName;
    const teamId = props.teamId;
    const firstname = props.firstname;
    const lastname = props.lastname;
    const isLoggedIn = props.isLoggedIn;

    if (!isLoggedIn) {
        return (<View style={{
            paddingTop: StatusBar.currentHeight,
        }}/>)
    }

    return (
        <View style={{
            backgroundColor: Colors.Secondary,
            height: 100,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
            paddingTop: StatusBar.currentHeight,
            paddingRight: 30
        }}>

            <ProfilePic url={props.profilePicUrl} size="big"/>
            <View style={{paddingLeft: 25}}>
                <Text style={{
                    color: 'white',
                    fontSize: 15,
                    fontWeight: 'bold',
                    paddingBottom: 10
                }}>{firstname} {lastname}</Text>
                <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>{teamName} #{teamId}</Text>
            </View>
        </View>
    );
};

const Drawer = (props) => {

    const appVersion = props.appVersion;

    return (
        <View style={{display: 'flex', height: '100%'}}>
            <DrawerHeader {...props} />
            <DrawerItems {...props} />
            <Text style={{position: 'absolute', bottom: 0, fontSize: 10, padding: 10}}>
                BreakOut Android Version {appVersion}
            </Text>
        </View>
    );
};

const ConnectedDrawer = connect(state => ({
    isLoggedIn: _.get(state, 'login.me', false),
    firstname: _.get(state, 'login.me.firstname', ''),
    lastname: _.get(state, 'login.me.lastname', ''),
    profilePicUrl: _.get(state, 'login.me.profilePic.url'),
    teamId: _.get(state, 'login.me.participant.teamId', ''),
    teamName: _.get(state, 'login.me.participant.teamName', ''),
    appVersion: DeviceInfo.getBuildNumber()
}))(Drawer);

class SettingsScreen extends React.PureComponent {

    static navigationOptions = {
        drawerLabel: () => "Settings",
        drawerIcon: () => <Icon name='settings'/>
    };

    resetApp() {
        store.dispatch({
            type: 'CLEAN_ALL'
        });
        navigatorRef.dispatch(NavigationActions.navigate({routeName: "login"}));
    }

    render() {
        return (
            <List>
                <ListItem onPress={this.resetApp}>
                    <Text>Reset app</Text>
                </ListItem>
            </List>
        );
    }
}

const DrawerStack = DrawerNavigator({
    drawerLogin: {screen: stacked(LoginScreen)},
    postStatus: {screen: stacked(CreatePostingScreen)},
    yourTeam: {screen: YourTeam},
    allPostings: {screen: stacked(ConnectedPostingList)},
    allTeams: {screen: AllTeamsStack},
    map: {screen: stacked(MapScreen)},
    settings: {screen: stacked(SettingsScreen)}
}, {
    initialRouteName: 'allPostings',
    contentComponent: ConnectedDrawer
});

const RootNav = StackNavigator({
    init: (props) => {
        if (isUserLoggedIn()) {
            props.navigation.navigate('drawer');
        } else {
            props.navigation.navigate('login');
        }
        return (null)
    },
    login: {screen: LoginScreen},
    drawer: {screen: DrawerStack}
}, {
    headerMode: 'none',
});

function isUserLoggedIn() {
    return !!(_.get(store.getState(), 'login.access_token'));
}

export let navigatorRef;

export default class App extends React.Component {

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        navigatorRef = this.navigator;
        this.setupBackgroundTracking(); // ignore result promise. We just fire and forget here
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
        store.dispatch(onAppStateChanged(oldAppState, newAppState))
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <MyStatusBar backgroundColor={Colors.Primary}/>

                    <RootNav
                        ref={nav => {
                            navigatorRef = nav
                        }}/>

                </PersistGate>
            </Provider>
        )
    }
}
