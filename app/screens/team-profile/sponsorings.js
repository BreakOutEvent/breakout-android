import React from 'react';
import {connect} from "react-redux";
import {FlatList, Text} from "react-native";
import {Icon, ListItem} from "native-base";
import _ from "lodash";

const SponsoringListItem = (sponsoring) => {

    const company = _.get(sponsoring, 'sponsor.company');
    const firstname = _.get(sponsoring, 'sponsor.firstname');
    const lastname = _.get(sponsoring, 'sponsor.lastname');

    const text = (company && company.trim() != "")
        ? `${firstname} ${lastname} – ${company}`
        : `${firstname} ${lastname}`;

    return (
        <ListItem>
            <Text>{text}</Text>
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
                      keyExtractor={(elem, idx) => idx.toString()}
                      data={this.props.sponsorings.filter(sponsoring => sponsoring.status === "ACCEPTED")}
                      renderItem={({item}) => <SponsoringListItem {...item} />}
            />
        )
    }
}

function mapStateToProps(state, props) {
    const teamId = props.screenProps.teamId;
    let sponsorings;
    if (state.team[teamId]) {
        sponsorings = state.team[teamId].sponsorings
    } else {
        sponsorings = [];
    }
    return {
        teamId,
        sponsorings
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

const ConnectedSponsorings = connect(mapStateToProps, mapDispatchToProps)(Sponsorings);
export default ConnectedSponsorings;
