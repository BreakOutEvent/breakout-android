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
        'Barcelona': '#415dac'
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
    console.log(speed, normSpeed);
    //[255, 128, 0],[106, 185, 255]
    const rgb = colorGradientByWeight([0, 255, 0], [255, 0, 0], normSpeed);
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function getMapContent(showSingleTeam, locations) {
    if (showSingleTeam) {
        return getTeamMapContent(locations)
    } else {
        return getEventsMapContent(locations)
    }
}

function getTeamMapContent(locations) {
    const maxDistanceTeamLocation = locations
        .reduce((locA, locB) => locA['distance'] >= locB['distance'] ? locA : locB, {});

    const lastPosMarker = <Marker
        key="last_pos"
        title={strings.lastPosition}
        opacity={1}
        coordinate={{
            latitude: maxDistanceTeamLocation.latitude,
            longitude: maxDistanceTeamLocation.longitude,
        }}/>;

    const minDistanceTeamLocation = locations
        .reduce((locA, locB) => locA['distance'] <= locB['distance'] ? locA : locB, {});

    const firstPosMarker = <Marker
        key="first_pos"
        title={strings.startingPosition}
        opacity={1}
        coordinate={{
            latitude: minDistanceTeamLocation.latitude,
            longitude: minDistanceTeamLocation.longitude,
        }}/>;

    let priorLocation;
    const teamPolyline = [];
    locations.forEach(location => {
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


    return [lastPosMarker, firstPosMarker, teamPolyline];
}

function getEventsMapContent(locations) {
    const teamMarkers = locations.map(team => {
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
    const teamPolylines = locations.map(team => {
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

    const munichMarker = <Marker
        key="München"
        title={strings.startMunich}
        coordinate={{
            latitude: 48.150676,
            longitude: 11.580984,
        }}/>;

    const berlinMarker = <Marker
        key="Berlin"
        title={strings.startBerlin}
        coordinate={{
            latitude: 52.512643,
            longitude: 13.321876,
        }}/>;

    const barcelonaMarker = <Marker
        key="Barcelona"
        title={strings.startBarcelona}
        coordinate={{
            latitude: 41.3947688,
            longitude: 2.0787279,
        }}/>;

    return [munichMarker, berlinMarker, barcelonaMarker, teamMarkers, teamPolylines];
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
        let content;
        if (this.props.locations && this.props.locations.length) {
            content = getMapContent(this.props.showSingleTeam, this.props.locations);
        } else {
            content = [];
        }

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
                    {content}
                </MapView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        showSingleTeam: false,
        locations: state.locations.locations,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRefresh: (teamId) => dispatch(fetchEventLocations()),
    }
};

let strings = new LocalizedStrings({
 "en-US":{
	 mapLabel:'Map',
   lastPosition:'Last position',
   startingPosition:"Start",
   startMunich:'Start Munich',
   startBerlin:'Start Berlin',
   startBarcelona:'Start Barcelona'

 },
 de:{
   mapLabel:'Karte',
   lastPosition:'Letzte Position',
   startingPosition:"Start",
   startMunich:'Start München',
   startBerlin:'Start Berlin',
   startBarcelona:'Start Barcelona'
 }
});

const ConnectedMapScreen = connect(mapStateToProps, mapDispatchToProps)(Map);
export default ConnectedMapScreen;
