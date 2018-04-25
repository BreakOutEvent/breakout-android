import React, {Component} from 'react';
import {Text, View} from "react-native";
import {Icon} from "native-base";

export default class MapScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Karte',
        drawerIcon: () => <Icon name='map'/>
    };

    render() {
        return <View><Text>Map will be here</Text></View>
    }
}