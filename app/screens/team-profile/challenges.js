// TODO: parse company correctly
import React from 'react';
import {connect} from "react-redux";
import {View, FlatList, Text} from "react-native";
import {Icon, ListItem} from "native-base";
import _ from "lodash";
import * as Colors from "../../config/colors";


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
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{width: 60}}>
                        <View style={{flex: 1, flexDirection: 'column', alignContent: 'center'}}>
                            <Icon style={{color: 'green'}} name='done-all'/>
                            <Text style={{color: 'green'}}>{challenge.amount} €</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text>{challenge.description}</Text>
                        <Text>{text}</Text>
                    </View>
                </View>
            </ListItem>
        );
    } else {
        return (
            <ListItem>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View style={{width: 60}}>
                        <View style={{flex: 1, flexDirection: 'column', alignContent: 'center'}}>
                            <Icon style={{color: Colors.Grey}} name='flag'/>
                            <Text>{challenge.amount} €</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text>{challenge.description}</Text>
                        <Text>{text}</Text>
                    </View>
                </View>
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
                      keyExtractor={(elem) => elem.id.toString()}
                      data={this.props.challenges}
                      renderItem={({item}) => <ChallengeListItem {...item} />}
            />
        )
    }
}

function mapStateToProps(state, props) {
    const teamId = props.screenProps.teamId;
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
