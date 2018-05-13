import React from "react";
import {TabBarTop, TabNavigator} from "react-navigation";
import {Body, Icon, ListItem, Text, View} from "native-base";
import * as Colors from "../config/Colors";
import {FlatList} from 'react-native';
import ConnectedAboutTeam from "./about";
import ConnectedChallenges from "./challenges";
import ConnectedSponsorings from "./sponsorings";
import ConnectedTeamPostings from "./postings";

const elem = (props) => {
    console.log(props);
    return (
        <View>
            <View style={{
                height: 150,
                backgroundColor: Colors.Primary,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingBottom: 50,
                paddingLeft: 10,
                paddingRight: 10,
            }}>
                <View>
                    <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Team SpiceGirls</Text>
                    <Text style={{fontSize: 13, color: 'white'}}>Franz & Magdalena</Text>
                </View>
                <View>
                    <Text style={{fontSize: 13, color: 'white'}}>2.134km</Text>
                    <Text style={{fontSize: 13, color: 'white'}}>3.120,00€</Text>
                </View>
            </View>
            <TabBarTop {...props} style={{backgroundColor: 'transparent', marginTop: -50, height: 50}}/>
        </View>
    );
};

class TeamMapView extends React.Component {
    static navigationOptions = {
        tabBarIcon: <Icon name='map' style={{color: 'white'}}/>,
        title: ''
    };

    render() {
        return <Text>Map</Text>
    }
}

class TeamPostsView extends React.Component {
    static navigationOptions = props => ({
        tabBarIcon: <Icon name='list-box' style={{color: 'white'}}/>,
        title: ''
    });

    render() {
        return <Text>Geil</Text>
    }
}

const Tabnav = TabNavigator({
    Posts: ConnectedTeamPostings,
    Map: TeamMapView,
    Info: ConnectedAboutTeam,
    Challenges: ConnectedChallenges,
    Sponsorings: ConnectedSponsorings,
}, {
    initialRouteName: 'Info',
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    tabBarOptions: {
        showLabel: false,
        showIcon: true,
        style: {
            backgroundColor: Colors.Primary,
            borderTopWidth: 0,
        },
        indicatorStyle: {backgroundColor: 'white'}
    },
});

export default class TeamProfile extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        drawerLabel: 'Dein Team',
        drawerIcon: () => <Icon name='contact'/>
    };

    render(){
        return <Tabnav/>
    }
}
