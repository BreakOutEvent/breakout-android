import React from "react";
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {connect} from "react-redux";
import {loadTeams} from "./actions";
import * as Colors from "../../config/colors";
import {Icon} from "native-base";
import {Button} from "../../components/posting";
import LocalizedStrings from 'react-native-localization';
import _ from "lodash";

export function transform(parameters, url) {
    if (!url) {
        return;
    }

    let newUrl;
    if (!url.includes('cloudinary')) {
        // cannot transform images that are not from cloudinary
        return url;
    } else {
        newUrl = url.replace(/image\/upload\/.*\//, `image/upload/${parameters}/`);
        return newUrl;
    }
}

export function changeFileEnding(url, newFileEnding) {
    try {
        if (url.includes('breakoutmedia.blob.core.windows.net')) {
            // this video is served from our old azure blob storage where
            return url;
        }

        // replace the ending of the video with .png. This will use cloudinary
        // to automatically generate a thumbnail based on the video url for us
        return url.substr(0, url.lastIndexOf('.')) + '.'+ newFileEnding;

    } catch (err) {
        logger.error(`Error changing extension to ${newFileEnding} for url '${url}'`);
    }
}

class AllTeams extends React.PureComponent {

    static navigationOptions = {
        drawerLabel: () => strings.allTeamsLabel,
        drawerIcon: () => <Icon name="people" />
    };

    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
        this.styles = StyleSheet.create({
            item: {
                height: 200,
                flex: 1,
                margin: 5,
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'flex-end',
                elevation: 2
            },
            itemTeamName: {
                height: 50,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            },
            itemTeamNameText: {
                fontWeight: 'bold',
                padding: 10
            },
            imageContainer: {
                overflow: 'hidden'
            },
            image: {
                height: 150,
                width: 200
            },
            placeholder: {
                height: 150,
                width: 200,
                backgroundColor: Colors.Secondary
            }
        });
    }

    componentDidMount() {
        this.props.loadTeams()
    }

    renderItem(item) {
        const team = item.item;
        const profilePicUri = _.get(team, 'profilePic.url');
        const styles = this.styles;

        const imageOrPlaceHolder = (profilePicUri)
            ? <Image style={styles.image} source={{uri: transform('w_200,h_150,c_fill_pad,g_auto,b_auto,q_auto:eco', profilePicUri)}}/>
            : <View style={styles.placeholder}/>;

        return (
            <View style={styles.item}>
                <View style={styles.imageContainer}>{imageOrPlaceHolder}</View>
                <Button onPress={() => this.props.navigation.navigate("aTeam", {teamId: team.id, teamName: team.name})}>
                <View style={styles.itemTeamName}>
                    <Text adjustsFontSizeToFit numberOfLines={2} style={styles.itemTeamNameText}>{team.name}</Text>
                </View>
                </Button>
            </View>
        )
    }

    render() {
        return (
            <FlatList
                style={{padding: 10}}
                numColumns={2}
                renderItem={this.renderItem}
                keyExtractor={(elem, idx) => elem.name + idx}
                contentContainerStyle={{paddingBottom: 20}}
                data={this.props.teams}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        teams: state.allTeams.teams
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadTeams: () => dispatch(loadTeams())
    }
}

let strings = new LocalizedStrings({
 "en-US":{
	 allTeamsLabel:'All Teams'
 },
 de:{
   allTeamsLabel:'Alle Teams'
 }
});

export default connect(mapStateToProps, mapDispatchToProps)(AllTeams);
