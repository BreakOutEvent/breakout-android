import React, {Component} from 'react';
import {Text, View} from "react-native";
import {Icon} from "native-base";

export default class PostingListScreen extends Component {

    static navigationOptions = {
        drawerLabel: 'Alle Postings',
        drawerIcon: () => <Icon name='flag'/>
    };

    render() {
        return <View><Text>Posting List will be here!</Text></View>
    }
}