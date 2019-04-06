import React, {Component} from 'react';
import {StyleSheet, View} from "react-native";
import {Icon} from "native-base";
import MapView, {Polyline, Marker} from 'react-native-maps';
import {connect} from "react-redux";
import {fetchEventLocations} from "../screens/locations/actions";
import LocalizedStrings from 'react-native-localization';

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
        'Barcelona': '#415dac',
        'Köln': '#6b5aac'
    };

    return colorlist[team.event.city];
}


function colorGradientByWeight(color1, color2, weight) {
    const w = weight * 2 - 1;
    const w1 = (w / 1 + 1) / 2;
    const w2 = 1 - w1;
    return [
        Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)
    ];
}

function getHeatMapColor(speed) {
    const normSpeed = Math.log(Math.log(speed + 11.8)) - 0.9;
    //[255, 128, 0],[106, 185, 255]
    const rgb = colorGradientByWeight([0, 255, 0], [255, 0, 0], normSpeed);
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function getMapContent(props) {
    if (props.showSingleTeam) {
        return getTeamMapContent(props)
    } else {
        return getEventsMapContent(props)
    }
}

function getTeamMapContent(props) {
    let priorLocation;
    const teamPolyline = [];
    props.locations.forEach(location => {
        route = [priorLocation, location];
        color = getHeatMapColor(location.speed | 0);

        if (priorLocation) {
            teamPolyline.push(<Polyline
                key="team"
                coordinates={route}
                strokeColor={color}
                strokeOpacity={1}
                strokeWidth={5}
            />);
        }
        priorLocation = location;
    });

    return teamPolyline;
}

function getEventsMapContent(props) {
    const teamMarkers = props.locations.map(team => {
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
    const teamPolylines = props.locations.map(team => {
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
            strokeWidth={3}
        />
    });


    const startMarkers = props.currentEvents.map(event => {
        coordinate = {
            latitude: event.startingLocation.latitude,
            longitude: event.startingLocation.longitude
        };

        return <Marker
            key={event.city}
            title={event.city}
            coordinate={coordinate}/>;
    });

    return [startMarkers, teamMarkers, teamPolylines];
}


export class Map extends Component {
    static navigationOptions = {
        drawerLabel: () => strings.mapLabel,
        drawerIcon: () => <Icon name='map'/>
    };

    componentDidMount() {
        this.props.onRefresh(this.props.teamId)
    };


    render() {
        let content = () => {
            if (this.props.locations && this.props.locations.length) {
                return getMapContent(this.props);
            } else {
                return getMapContent(this.props);
            }
        };

        return (
            <View style={styles.container}>
                <MapView
                    style={styles.container}
                    customMapStyle={mapStyle}
                    initialRegion={{
                        latitude: 48.150676,
                        longitude: 11.580984,
                        latitudeDelta: 20,
                        longitudeDelta: 0,
                    }}>
                    {content()}
                </MapView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        showSingleTeam: false,
        team: null,
        locations: state.locations.locations,
        currentEvents: state.locations.currentEvents
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRefresh: () => dispatch(fetchEventLocations()),
    }
};

let strings = new LocalizedStrings({
    "en-US": {
        mapLabel: 'Map',
    },
    de: {
        mapLabel: 'Karte',
    }
});

const ConnectedMapScreen = connect(mapStateToProps, mapDispatchToProps)(Map);
export default ConnectedMapScreen;
