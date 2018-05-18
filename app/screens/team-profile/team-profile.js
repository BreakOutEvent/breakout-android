import React from "react";
import {TabBarTop, TabNavigator} from "react-navigation";
import {Icon, Text, View} from "native-base";
import * as Colors from "../../config/colors";
import ConnectedAboutTeam from "./about";
import ConnectedChallenges from "./challenges";
import ConnectedSponsorings from "./sponsorings";
import ConnectedTeamPostings from "./postings";
import {Map} from "../../components/map";
import {connect} from "react-redux";
import {fetchTeamLocations} from "./actions";

const elem = (props) => {
    console.log(props);
    return (
        <View>
            <View style={{
                height: 150,
                backgroundColor: Colors.Primary,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingBottom: 50,
                paddingLeft: 10,
                paddingRight: 10,
            }}>
                <View>
                    <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Team SpiceGirls</Text>
                    <Text style={{fontSize: 13, color: 'white'}}>Franz & Magdalena</Text>
                </View>
                <View>
                    <Text style={{fontSize: 13, color: 'white'}}>2.134km</Text>
                    <Text style={{fontSize: 13, color: 'white'}}>3.120,00€</Text>
                </View>
            </View>
            <TabBarTop {...props} style={{backgroundColor: 'transparent', marginTop: -50, height: 50}}/>
        </View>
    );
};

const mapStateToProps = (state, props) => {
    const teamId = props.screenProps.teamId;

    let locations;
    if (state.team[teamId]) {
        locations = state.team[teamId].locations
    } else {
        locations = [];
    }
    return ({
        showSingleTeam: true,
        teamId: teamId,
        locations: locations
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRefresh: (teamId) => dispatch(fetchTeamLocations(teamId)),
    }
};

const ConnectedMapScreen = connect(mapStateToProps, mapDispatchToProps)(Map);

class TeamMapView extends React.Component {
    static navigationOptions = {
        tabBarIcon: <Icon name='map' style={{color: 'white'}}/>,
        title: ''
    };

    render() {
        return <ConnectedMapScreen screenProps={this.props.screenProps}/>
    }
}

class TeamPostsView extends React.Component {
    static navigationOptions = props => ({
        tabBarIcon: <Icon name='list-box' style={{color: 'white'}}/>,
        title: ''
    });

    render() {
        return <Text>Geil</Text>
    }
}

const Tabnav = TabNavigator({
    Posts: ConnectedTeamPostings,
    Map: TeamMapView,
    Info: ConnectedAboutTeam,
    Challenges: ConnectedChallenges,
    Sponsorings: ConnectedSponsorings,
}, {
    initialRouteName: 'Info',
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    tabBarOptions: {
        showLabel: false,
        showIcon: true,
        style: {
            backgroundColor: Colors.Primary,
            borderTopWidth: 0,
        },
        indicatorStyle: {backgroundColor: 'white'}
    },
});

export default class TeamProfile extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        drawerLabel: 'Dein Team',
        drawerIcon: () => <Icon name='contact'/>
    };

    componentWillMount() {
        const teamId = this.props.teamId || this.props.navigation.getParam("teamId");
        if (!teamId) {
            this.props.navigation.navigate("drawerLogin");
        }
    }
    render() {
        const teamId = this.props.teamId || this.props.navigation.getParam("teamId");
        return <Tabnav screenProps={{teamId}}/>
    }
}
