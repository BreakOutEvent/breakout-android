import React from 'react';
import {DrawerNavigator, StackNavigator} from 'react-navigation';
import {Icon} from 'native-base'
import ConnectedPostingList from "../screens/PostingList";
import MapScreen from "../screens/MapScreen";
import AllTeamsScreen from "../screens/AllTeamsScreen";
import ChatScreen from "../screens/ChatScreen";
import TeamOverviewScreen from "../screens/TeamOverviewScreen";
import CreatePostingScreen from "../screens/CreatePostingScreen";
import LoginScreen from "../screens/LoginScreen";
import * as Colors from "../config/Colors";
import {Provider} from 'react-redux';
import {persistor, store} from '../store/store';
import {PersistGate} from "redux-persist/integration/react";

const drawerButton = (navigation) =>
    (<Icon name='menu' style={{paddingLeft: 10, color: 'white'}} onPress={() => navigation.navigate('DrawerToggle')}/>);

const DrawerStack = DrawerNavigator({
    login: {screen: LoginScreen},
    allPostings: {screen: ConnectedPostingList},
    postStatus: {screen: CreatePostingScreen},
    yourTeam: {screen: TeamOverviewScreen},
    chat: {screen: ChatScreen},
    map: {screen: MapScreen},
    allTeams: {screen: AllTeamsScreen},
});

const Navigator = StackNavigator({
    drawerStack: {screen: DrawerStack}
}, {
    headerMode: 'screen',
    title: 'BreakOut',
    intialRouteName: 'drawerStack',
    navigationOptions: ({navigation}) => ({
        headerStyle: {backgroundColor: Colors.Primary},
        title: 'BreakOut',
        headerTintColor: 'white',
        gesturesEnabled: false,
        headerLeft: drawerButton(navigation)
    })
});

export default App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Navigator/>
        </PersistGate>
    </Provider>
);

