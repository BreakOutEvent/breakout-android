import React from 'react';
import {DrawerNavigator, StackNavigator} from 'react-navigation';
import {Icon} from 'native-base'
import PostingListScreen from "../screens/PostingList";
import MapScreen from "../screens/MapScreen";
import AllTeamsScreen from "../screens/AllTeamsScreen";
import ChatScreen from "../screens/ChatScreen";
import TeamOverviewScreen from "../screens/TeamOverviewScreen";
import CreatePostingScreen from "../screens/CreatePostingScreen";
import LoginScreen from "../screens/LoginScreen";
import * as Colors from "../config/Colors";

const drawerButton = (navigation) =>
    (<Icon name='menu' style={{paddingLeft: 10}} onPress={() => navigation.navigate('DrawerToggle')}/>);

const DrawerStack = DrawerNavigator({
    login: {screen: LoginScreen},
    postStatus: {screen: CreatePostingScreen},
    yourTeam: {screen: TeamOverviewScreen},
    chat: {screen: ChatScreen},
    map: {screen: MapScreen},
    allPostings: {screen: PostingListScreen},
    allTeams: {screen: AllTeamsScreen},
});

export default AppWithNav = StackNavigator({
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
