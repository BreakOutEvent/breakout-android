// TODO: parse company correctly
import React from 'react';
import {connect} from "react-redux";
import {FlatList, Text} from "react-native";
import {Body, Icon, ListItem} from "native-base";

const SponsoringListItem = (sponsoring) => {

    const company = _.get(sponsoring, 'sponsor.company');
    const firstname = _.get(sponsoring, 'sponsor.firstname');
    const lastname = _.get(sponsoring, 'sponsor.lastname');

    const text = (company)
        ? `${firstname} ${lastname} – ${company}`
        : `${firstname} ${lastname}`;

    return (
        <ListItem>
            <Body>
            <Text>{text}</Text>
            </Body>
        </ListItem>
    );
};

class Sponsorings extends React.Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        tabBarIcon: <Icon name='cash' style={{color: 'white'}}/>,
    };

    render() {
        return (
            <FlatList style={{backgroundColor: 'white'}}
                      keyExtractor={(elem, idx) => idx}
                      data={this.props.sponsorings}
                      renderItem={({item}) => <SponsoringListItem {...item} />}
            />
        )
    }
}

function mapStateToProps(state) {
    const teamId = _.get(state, 'login.me.participant.teamId');
    return {
        teamId,
        sponsorings: state.team[teamId].sponsorings
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

const ConnectedSponsorings = connect(mapStateToProps, mapDispatchToProps)(Sponsorings);
export default ConnectedSponsorings;