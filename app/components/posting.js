import {StyleSheet, Text, View} from "react-native";
import ProgressBar from "react-native-progress/Bar";
import * as Colors from "../config/Colors";
import React from 'react';
import Image from 'react-native-image-progress';
import {Body, Button, Card, CardItem, Icon, Left, Thumbnail} from "native-base";
import _ from 'lodash';
import moment from 'moment';
import VideoPlayer from "../components/VideoPlayer";

export default Posting = (props) => {
    return (
        <Card>
            <CardMedia media={props.media}/>
            <CardHeader {...props} />
            <CardBody text={props.text} challenge={props.challenge}/>
            <CardChallenge challenge={props.proves}/>
            <CardCommentsAndLikes addLike={props.addLike}
                                  hasLiked={props.hasLiked}
                                  comments={props.comments}
                                  likes={props.likes}
                                  postingId={props.id}
            />
        </Card>
    );
};

const CardCommentsAndLikes = (props) => {

    const likeColor = (props.hasLiked) ? Colors.LikeRed : 'grey';

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        buttonStyle: {
            padding: 0,
            margin: 0
        },
        likesIcon: {
            color: likeColor,
        },
        likesText: {
            textAlign: 'center',
            marginRight: 30,
            marginTop: -3,
            marginLeft: -5,
            color: 'grey'
        },
        commentsIcon: {color: 'grey'},
        commentsText: {
            textAlign: 'center',
            marginTop: -3,
            marginLeft: -5,
            color: 'grey'
        }
    });

    return (
        <CardItem style={styles.container}>
            <Button small
                    transparent
                    onPress={() => props.addLike(props.postingId)}>
                <Icon active={props.hasLiked} name='heart' style={styles.likesIcon}/>
            </Button>
            <Text style={styles.likesText}>{props.likes} Likes</Text>
            <Button small transparent>
                <Icon name='text' style={styles.commentsIcon}/>
            </Button>
            <Text style={styles.commentsText}>{_.get(props, 'comments.length', 0)} Kommentare</Text>
        </CardItem>
    );
};

const CardChallenge = (props) => {
    if (!props.challenge) {
        return (null)
    }

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 15,
            padding: 10,
            marginTop: 0,
            borderWidth: 2,
            borderRadius: 6,
            borderColor: Colors.Primary
        }}>
            <Icon style={{padding: 15}} name='trophy'/>
            <View style={{flex: 1}}>
                <Text>{props.challenge.description}</Text>
            </View>
        </View>
    );
};

const CardHeader = (props) => {
    const styles = StyleSheet.create({
        title: {
            fontWeight: 'bold'
        },
        subtitle: {
            fontSize: 13,
            paddingTop: 2,
            color: Colors.Subtitle
        }
    });

    return (
        <CardItem header style={{paddingTop: 17, paddingBottom: 4}}>
            <Left>
                <ProfilePic url={_.get(props, 'user.profilePic.url')}/>
                <Body>
                <Text style={styles.title}>{'Team ' + _.get(props, 'user.participant.teamName', 'no name')}</Text>
                <Text style={styles.subtitle}>{generateSubtitle(props)}</Text>
                </Body>
            </Left>
        </CardItem>
    );
};

const CardBody = (props) => {

    if (!props.text) {
        return (null);
    }

    return (
        <CardItem>
            <Text>{props.text}</Text>
        </CardItem>
    )
};

const CardMedia = (props) => {

    const url = _.get(props, 'media.url');
    const type = _.get(props, 'media.type');

    if (url) {
        switch (type.toLowerCase()) {
            case 'image':
                return (
                    <Image
                        source={{uri: url}}
                        style={{height: 200, width: null, flex: 1, backgroundColor: Colors.Secondary}}
                        indicator={ProgressBar}
                        cache='force-cache'
                    />
                );
            case 'video':
                return <VideoPlayer url={url}
                                    paused={true}/>;
            default:
                console.error(`Unsupported media type ${type} from url ${url}`);
                return (null);
        }
    } else {
        return (null);
    }
};

function generateSubtitle(props) {
    return `${generateTimeString(props.date)} ${generateLocationString(props.postingLocation)}`;
}

function generateTimeString(timestamp) {
    if (!timestamp) {
        console.warn("No timestamp where we expected to have one");
        return "";
    }

    // TODO: Set moment locale
    return moment.unix(timestamp).fromNow();
}

function generateLocationString(location) {
    if (!location) {
        return "";
    } else {
        const locality = _.get(location, 'locationData.LOCALITY');
        const country = _.get(location, 'locationData.COUNTRY');

        if (locality && country) {
            return `in ${locality}, ${country}`
        } else if (location.latitude && location.longitude) {
            return `(${location.latitude}, ${location.longitude})`
        }
    }
}

const ProfilePic = (props) => {

    if (props.url) {
        return <Thumbnail small source={{uri: props.url}}/>
    } else {
        return <Thumbnail small source={require('../assets/profile_pic_placeholder.jpg')}/>
    }
};