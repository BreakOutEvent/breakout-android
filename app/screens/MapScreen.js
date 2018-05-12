import React, {Component} from 'react';
import {StyleSheet, View} from "react-native";
import {Icon} from "native-base";
import MapView from 'react-native-maps';

mapStyle = [{
    featureType: "administrative",
    elementType: "labels.text",
    stylers: [{visibility: "on"}]
}, {
    featureType: "administrative",
    elementType: "labels.icon",
    stylers: [{visibility: "simplified"}]
}, {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{color: "#ababab"}]
}, {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{visibility: "off"}]
}, {
    featureType: "administrative.locality",
    elementType: "all",
    stylers: [{visibility: "on"}]
}, {
    featureType: "administrative.locality",
    elementType: "labels.text",
    stylers: [{visibility: "on"}]
}, {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{color: "#404041"}]
}, {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{visibility: "on"}, {color: "#e3e3e3"}]
}, {featureType: "poi", elementType: "all", stylers: [{visibility: "off"}]}, {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{color: "#cccccc"}]
}, {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{color: "#cccccc"}, {weight: "0.50"}]
}, {featureType: "road", elementType: "labels.icon", stylers: [{saturation: "-100"}]}, {
    featureType: "road.highway",
    elementType: "all",
    stylers: [{visibility: "simplified"}]
}, {
    featureType: "road.highway",
    elementType: "labels",
    stylers: [{visibility: "off"}]
}, {featureType: "road.arterial", elementType: "all", stylers: [{visibility: "on"}]}, {
    featureType: "road.local",
    elementType: "all",
    stylers: [{visibility: "on"}]
}, {featureType: "transit", elementType: "labels.icon", stylers: [{visibility: "off"}]}, {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{visibility: "off"}]
}, {
    featureType: "transit.line",
    elementType: "labels.text",
    stylers: [{visibility: "off"}]
}, {
    featureType: "transit.station.airport",
    elementType: "geometry",
    stylers: [{visibility: "off"}]
}, {
    featureType: "transit.station.airport",
    elementType: "labels",
    stylers: [{visibility: "off"}]
}, {featureType: "water", elementType: "geometry", stylers: [{color: "#b1b1b1"}]}, {
    featureType: "water",
    elementType: "labels",
    stylers: [{visibility: "off"}]
}];

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
                customMapStyle={mapStyle}
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