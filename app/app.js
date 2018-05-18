import React from 'react';
import {DrawerNavigator, StackNavigator} from 'react-navigation';
import {Icon} from 'native-base'
import ConnectedPostingList from "./screens/postings/screen";
import MapScreen from "./components/map";
import AllTeams from "./screens/all-teams/screen";
import TeamOverviewScreen from "./screens/team-profile/team-profile";
import CreatePostingScreen from "./screens/create-posting/screen";
import * as Colors from "./config/colors";
import {Provider} from 'react-redux';
import {persistor, store} from './store/store';
import {PersistGate} from "redux-persist/integration/react";
import LoginScreen from './screens/login/screen';

console.ignoredYellowBox = ['Remote debugger'];

const drawerButton = (navigation) =>
    (<Icon name='menu' style={{paddingLeft: 10, color: 'white'}} onPress={() => navigation.navigate('DrawerToggle')}/>);

const stacked = (Screen, title='BreakOut', borderLess = false) => StackNavigator({
    screen: Screen
}, {
    navigationOptions: ({navigation}) => ({
            headerStyle: (borderLess) ? {backgroundColor: Colors.Primary, borderBottomWidth: 0, elevation: 0} : {backgroundColor: Colors.Primary},
            headerTintColor: 'white',
            gesturesEnabled: false,
            headerLeft: drawerButton(navigation),
            title: title,
        }),
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
        headerStyle: {backgroundColor: Colors.Primary, borderBottomWidth: 0, elevation: 0},
        title: `Your Team`,
        headerTintColor: 'white',
        headerLeft: drawerButton(navigation),
        drawerIcon: () => <Icon name='contact'/>
    })
});

const DrawerStack = DrawerNavigator({
    drawerLogin: {screen: stacked(LoginScreen)},
    postStatus: {screen: stacked(CreatePostingScreen)},
    yourTeam: {screen: YourTeam},
    allPostings: {screen: stacked(ConnectedPostingList)},
    allTeams: {screen: AllTeamsStack},
    map: {screen: stacked(MapScreen)},
}, {
    initialRouteName: 'allPostings'
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

export default App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <RootNav/>
        </PersistGate>
    </Provider>
);

