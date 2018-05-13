import React, {Component} from 'react';
import {StyleSheet, View} from "react-native";
import {Icon} from "native-base";
import MapView, {Polyline, Marker} from 'react-native-maps';
import {connect} from "react-redux";
import {fetchLocations} from "../locations/actions";

const mapStyle = [
    {
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
    }
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

function getCityColor(team) {
    const colorlist = {
        'München': '#F7931D',
        'Berlin': '#5AACA5',
        'Barcelona': '#415dac'
    };

    return colorlist[team.event.city];
}

class MapScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Karte',
        drawerIcon: () => <Icon name='map'/>
    };

    componentDidMount() {
        this.props.onRefresh()
    };

    render() {
        const teamMarkers = this.props.locations.map(team => {
            const maxDistanceTeamLocation = team.locations
                .reduce((locA, locB) => locA['distance'] >= locB['distance'] ? locA : locB, {});

            return <Marker
                key={team.id}
                title={team.name}
                opacity={0.7}
                coordinate={{
                    latitude: maxDistanceTeamLocation.latitude,
                    longitude: maxDistanceTeamLocation.longitude,
                }}/>;
        });
        const teamPolylines = this.props.locations.map(team => {
            const startingLocation = {
                latitude: team.event.startingLocation.latitude,
                longitude: team.event.startingLocation.longitude,
            };

            const routeLocations = team.locations.map(location => {
                return {
                    latitude: location.latitude,
                    longitude: location.longitude,
                }
            });

            const teamLatLngs = [startingLocation].concat(routeLocations);

            return <Polyline
                key={team.id}
                coordinates={teamLatLngs}
                strokeColor={getCityColor(team)}
                strokeOpacity={1}
                strokeWeight={3}
            />
        });

        const munichMarker = <Marker
            key="München"
            title="Start München"
            coordinate={{
                latitude: 48.150676,
                longitude: 11.580984,
            }}/>;

        const berlinMarker = <Marker
            key="Berlin"
            title="Start Berlin"
            coordinate={{
                latitude: 52.512643,
                longitude: 13.321876,
            }}/>;

        const barcelonaMarker = <Marker
            key="Barcelona"
            title="Start Barcelona"
            coordinate={{
                latitude: 41.3947688,
                longitude: 2.0787279,
            }}/>;

        return (
            <View style={styles.container}>
                <MapView
                    style={styles.container}
                    customMapStyle={mapStyle}
                    initialRegion={{
                        latitude: 48.5690923,
                        longitude: 7.6920547,
                        latitudeDelta: 20,
                        longitudeDelta: 20,
                    }}>
                    {[munichMarker, berlinMarker, barcelonaMarker]}
                    {teamMarkers}
                    {teamPolylines}
                </MapView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        locations: state.locations.locations,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRefresh: () => dispatch(fetchLocations()),
    }
};

const ConnectedPostingList = connect(mapStateToProps, mapDispatchToProps)(MapScreen);
export default ConnectedPostingList;