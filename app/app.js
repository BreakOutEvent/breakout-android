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

const DrawerStack = DrawerNavigator({
    postStatus: {screen: stacked(CreatePostingScreen)},
    yourTeam: {screen: stacked(TeamOverviewScreen, 'Your Team', borderLess = true)},
    login: {screen: stacked(LoginScreen)},
    allPostings: {screen: stacked(ConnectedPostingList)},
    map: {screen: stacked(MapScreen)},
    allTeams: {screen: stacked(AllTeams)},
});

export default App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <DrawerStack/>
        </PersistGate>
    </Provider>
);

