// TODO: parse company correctly
import React from 'react';
import {connect} from "react-redux";
import {FlatList, Text} from "react-native";
import {Body, Icon, ListItem} from "native-base";

const ChallengeListItem = (challenge) => {

    const company = _.get(challenge, 'sponsor.company');
    const firstname = _.get(challenge, 'sponsor.firstname');
    const lastname = _.get(challenge, 'sponsor.lastname');

    const text = (company)
        ? `${firstname} ${lastname} – ${company}`
        : `${firstname} ${lastname}`;

    if (challenge.status === 'WITH_PROOF') {
        return (
            <ListItem>
                <Icon style={{color: 'green', paddingRight: 15}} name='done-all'/>
                <Body>
                <Text note>{challenge.description}</Text>
                <Text>{text}</Text>
                </Body>
            </ListItem>
        );
    } else {
        return (
            <ListItem>
                <Icon style={{color: 'white', paddingRight: 15}} name='done-all'/>
                <Body>
                <Text note>{challenge.description}</Text>
                <Text/>
                <Text>{text}</Text>
                </Body>
            </ListItem>
        );
    }

};

class Challenges extends React.Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        tabBarIcon: <Icon name='trophy' style={{color: 'white'}}/>,
    };

    render() {
        return (
            <FlatList style={{backgroundColor: 'white'}}
                      keyExtractor={(elem) => elem.id}
                      data={this.props.challenges}
                      renderItem={({item}) => <ChallengeListItem {...item} />}
            />
        )
    }
}

function mapStateToProps(state) {
    const teamId = _.get(state, 'login.me.participant.teamId');
    let challenges;
    if (state.team[teamId]) {
        challenges = state.team[teamId].challenges
    } else {
        challenges = [];
    }
    return {
        teamId,
        challenges
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

const ConnectedChallenges = connect(mapStateToProps, mapDispatchToProps)(Challenges);
export default ConnectedChallenges;