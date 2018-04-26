import React, {Component} from "react";
import {Text, View} from "react-native";
import {Icon} from "native-base";

export default class AllTeamsScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Teamübersicht',
        drawerIcon: () => <Icon name='chatboxes'/>
    }

    render() {
        return <View><Text>List of all teams will be here</Text></View>
    }
}