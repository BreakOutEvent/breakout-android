import React, {Component} from "react";
import {Text, View} from "react-native";
import {Icon} from "native-base";
import Home from "../containers/Home";

export default class LoginScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Login',
        drawerIcon: () => <Icon name='person'/>
    };

    render() {
        return <Home></Home>
    }
}