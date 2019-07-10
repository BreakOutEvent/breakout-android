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
import LocalizedStrings from 'react-native-localization';

const mapStateToProps = (state, props) => {
    const teamId = props.screenProps.teamId;

    let locations;
    if (state.team[teamId]) {
        locations = state.team[teamId].locations || [];
    } else {
        locations = [];
    }
    return ({
        showSingleTeam: true,
        team: state.team[teamId],
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

class TeamProfile extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        drawerLabel: () => null
    };


    componentDidMount() {
        const teamId = this.props.navigation.getParam("teamId");
        console.log("teamId", teamId, this.props);
    }

    render() {
        const teamId = this.props.navigation.getParam("teamId");
        return <Tabnav screenProps={{teamId}}/>
    }
}

class YourTeamProfile extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        drawerLabel: () => strings.yourTeamLabel,
        drawerIcon: () => <Icon name='contact'/>
    };

    componentDidMount() {
        if (!this.props.teamId) {
            this.props.navigation.navigate("drawerLogin");
        }
    }

    render() {
        const teamId = this.props.teamId;
        return <Tabnav screenProps={{teamId}}/>
    }
}


let strings = new LocalizedStrings({
    "en-US": {
        yourTeamLabel: 'Your Team'
    },
    de: {
        yourTeamLabel: 'Dein Team'
    }
});

export {
    TeamProfile, YourTeamProfile
}
