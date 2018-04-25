import React, {Component} from "react";
import {Text, View} from "react-native";
import {Icon} from "native-base";

export default class CreatePostingScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Einen Status posten',
        drawerIcon: () => <Icon name='send'/>
    }

    render() {
        return <View><Text>Create Posting will be here!</Text></View>
    }
}