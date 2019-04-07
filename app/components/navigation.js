import {Icon} from "native-base";
import {DrawerItems, DrawerNavigator, StackNavigator} from "react-navigation";
import * as Colors from "../config/colors";
import {StatusBar, Text, View} from "react-native";
import _ from "lodash";
import AllTeams from "../screens/all-teams/screen";
import TeamOverviewScreen from "../screens/team-profile/team-profile";
import {store} from "../store/store";
import {ProfilePic} from "./posting";
import {connect} from "react-redux";
import DeviceInfo from "react-native-device-info";
import MessagesOverviewScreen from "../screens/messages-overview/screen";
import MessagesScreen from "../screens/messages/screen";
import LoginScreen from "../screens/login/screen";
import ConnectedPostingList from "../screens/postings/screen";
import MapScreen from "./map";
import SettingsScreen from "../screens/settings/screen";
import CreatePostingScreen from "../screens/create-posting/screen";
import React from "react";
import NavigationService from "../utils/navigation-service";

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

function isUserLoggedIn(state) {
    return _.get(state, 'login.me', false);
}

function buildNavOptions({navigation}) {

    const routeName = _.get(navigation, 'state.routeName');
    const teamName = _.get(navigation, 'state.params.teamName');

    if (routeName === "aTeam") {
        return {
            headerStyle: {
                backgroundColor: Colors.Primary,
                borderBottomWidth: 0,
                elevation: 0,
                paddingTop: StatusBar.currentHeight,
                height: StatusBar.currentHeight + 56
            },
            title: `${teamName}`,
            headerTintColor: 'white',
        }
    } else {
        return {
            headerStyle: {
                backgroundColor: Colors.Primary,
                paddingTop: StatusBar.currentHeight,
                height: StatusBar.currentHeight + 56
            },
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
    yourTeamScreen: {
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
            height: 120,
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
    isLoggedIn: isUserLoggedIn(state),
    firstname: _.get(state, 'login.me.firstname', ''),
    lastname: _.get(state, 'login.me.lastname', ''),
    profilePicUrl: _.get(state, 'login.me.profilePic.url'),
    teamId: _.get(state, 'login.me.participant.teamId', ''),
    teamName: _.get(state, 'login.me.participant.teamName', ''),
    appVersion: DeviceInfo.getBuildNumber()
}))(Drawer);

const MessagesStack = StackNavigator({
    messagesOverview: {screen: MessagesOverviewScreen},
    messages: {screen: MessagesScreen}
}, {
    navigationOptions: buildNavOptions, // TODO own nav options
});

const DrawerStack = DrawerNavigator({
    drawerLogin: {screen: stacked(LoginScreen)},
    postStatus: {screen: stacked(CreatePostingScreen)},
    yourTeam: {screen: YourTeam},
    allPostings: {screen: stacked(ConnectedPostingList)},
    allTeams: {screen: AllTeamsStack},
    map: {screen: stacked(MapScreen)},
    messagesOverview: {screen: MessagesStack},
    settings: {screen: stacked(SettingsScreen)}
}, {
    initialRouteName: 'allPostings',
    contentComponent: ConnectedDrawer
});

const Navigator = StackNavigator({
    init: (props) => {
        if (props.isLoggedIn) {
            props.navigation.navigate('drawer');
        } else {
            props.navigation.navigate('login');
        }
        return (null)
    },
    login: LoginScreen,
    drawer: DrawerStack
}, {
    headerMode: 'none',
});

export default class Navigation extends React.PureComponent {
    render() {
        return (<Navigator ref={ref => NavigationService.setTopLevelNavigator(ref)}/>)
    }
}
