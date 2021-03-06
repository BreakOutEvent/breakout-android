import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {connect} from "react-redux";
import {onTeamProfileOpened} from "./actions";
import {Icon, Thumbnail} from "native-base";
import LocalizedStrings from 'react-native-localization';
import _ from "lodash";

class AboutTeam extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        tabBarIcon: () => <Icon name='information-circle' style={{color: 'white'}}/>,
    };

    componentDidMount() {
        if (this.props.teamId) {
            this.props.onTeamProfileOpened(this.props.teamId);
        }
    }

    render() {
        const props = this.props;
        const styles = StyleSheet.create({
            top: {
                backgroundColor: 'white',
                padding: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: '#cbcbcb',
            },
            bottom: {
                padding: 10
            }
        });

        let names;
        if (props.members) {
            names = props.members
                .map((member) => `${member.firstname}`)
                .reduce((first, second) => first + ' & ' + second);
        } else {
            names = ''
        }

        const distance = _.get(props, 'distance', 0);
        const score = _.get(props, 'score', 0);
        const sum = _.get(props, 'donateSum.fullSum', 0);

        const profilePicUrl = _.get(props, 'profilePic.url');
        const TeamThumbnail = () => (profilePicUrl)
            ? <Thumbnail large source={{uri: profilePicUrl}}/>
            : <Thumbnail large source={require('../../assets/profile_pic_placeholder.jpg')}/>;

        return (
            <View>
                <View style={styles.top}>
                    <TeamThumbnail/>
                    <View style={{display: 'flex', justifyContent: 'space-between', paddingLeft: 10}}>
                        <Text style={{fontSize: 19, paddingBottom: 2}}>{props.name}</Text>
                        <Text style={{fontSize: 12, paddingBottom: 2}}>{names}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 12, fontWeight: 'bold'}}>{Math.round(score)} {strings.score}</Text>
                            <Text style={{fontSize: 12}}> | {distance.toFixed(2)}km</Text>
                            <Text style={{fontSize: 12}}> | {sum.toFixed(2)}€</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottom}>
                    <Text style={{fontSize: 15, fontWeight: 'bold', paddingBottom: 5}}>{strings.aboutUs}</Text>
                    <Text style={{fontSize: 13}}>{props.description}</Text>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        teamId: props.screenProps.teamId,
        ...state.team[props.screenProps.teamId]
    }
};
const ConnectedAboutTeam = connect(
    mapStateToProps,
    (dispatch) => ({
        onTeamProfileOpened: (teamId) => dispatch(onTeamProfileOpened(teamId))
    })
)(AboutTeam);

let strings = new LocalizedStrings({
    "en-US": {
        aboutUs: 'About us',
        score: 'Points'
    },
    de: {
        aboutUs: 'Über uns',
        score: 'Punkte'
    }
});

export default ConnectedAboutTeam;
