import React, {Component} from "react";
import {Text, View} from "react-native";
import {Icon} from "native-base";

export default class TeamOverviewScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Dein Team',
        drawerIcon: () => <Icon name='contact'/>
    };

    render() {
        return <View><Text>Team overview will be here!</Text></View>
    }
}