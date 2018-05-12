import React, {Component} from 'react';
import {StyleSheet, View} from "react-native";
import {Icon} from "native-base";
import MapView from 'react-native-maps';

export default class MapScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Karte',
        drawerIcon: () => <Icon name='map'/>
    };


    render() {
        return (
            <View style={styles.container}>
            <MapView
                style={styles.container}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});