import React, {Component} from 'react';
import {Text, View} from "react-native";
import {Icon} from "native-base";

export default class ChatScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Chats',
        drawerIcon: () => <Icon name='chatboxes'/>
    }

    render() {
        return <View><Text>Chat will be here!</Text></View>
    }
}