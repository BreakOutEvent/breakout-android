import React from "react";
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {connect} from "react-redux";
import {loadTeams} from "./actions";
import * as Colors from "../config/Colors";

function transform(parameters, url) {
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

class AllTeams extends React.PureComponent {

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
            ? <Image style={styles.image}
                     source={{uri: transform('w_200,h_150,c_fill_pad,g_auto,b_auto,q_auto:eco', profilePicUri)}}/>
            : <View style={styles.placeholder}/>;

        return (
            <View style={styles.item}>
                {imageOrPlaceHolder}
                <View style={styles.itemTeamName}>
                    <Text adjustsFontSizeToFit numberOfLines={2} style={styles.itemTeamNameText}>{team.name}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <FlatList
                style={{padding: 10}}
                numColumns={2}
                renderItem={this.renderItem}
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

export default connect(mapStateToProps, mapDispatchToProps)(AllTeams);