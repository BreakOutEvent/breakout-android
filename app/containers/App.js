import React from 'react';
import {DrawerNavigator, StackNavigator} from 'react-navigation';
import {Icon} from 'native-base'
import ConnectedPostingList from "../screens/PostingList";
import MapScreen from "../screens/MapScreen";
import AllTeamsScreen from "../screens/AllTeamsScreen";
import ChatScreen from "../screens/ChatScreen";
import TeamOverviewScreen from "../team-profile/team-profile";
import CreatePostingScreen from "../screens/CreatePostingScreen";
import * as Colors from "../config/Colors";
import {Provider} from 'react-redux';
import {persistor, store} from '../store/store';
import {PersistGate} from "redux-persist/integration/react";
import LoginScreen from '../login/screen';

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
    yourTeam: {screen: stacked(TeamOverviewScreen, 'Your Team', borderLess = true)},
    login: {screen: stacked(LoginScreen)},
    allPostings: {screen: stacked(ConnectedPostingList)},
    postStatus: {screen: stacked(CreatePostingScreen)},
    chat: {screen: stacked(ChatScreen)},
    map: {screen: stacked(MapScreen)},
    allTeams: {screen: stacked(AllTeamsScreen)},
});

export default App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <DrawerStack/>
        </PersistGate>
    </Provider>
);

