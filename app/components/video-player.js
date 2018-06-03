import {StyleSheet, View} from "react-native";
import Video from "react-native-video";
import React from "react";
import {Icon} from "native-base";
import {Button} from "./posting";
import Image from 'react-native-image-progress';
import {transform} from "../screens/all-teams/screen";

const style = StyleSheet.create({
    view: {
        height: 200,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    button: {
        alignSelf: 'center'
    },
    playIconStyle: {
        fontSize: 35,
        color: 'white'
    },
    pauseIconStyle: {
        position: 'absolute',
        left: 15,
        bottom: 10,
        fontSize: 35,
        color: 'white'
    },
    video: {
        height: 200,
        flex: 1
    }
});

export default class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            initialView: true
        }
    }

    togglePlaying() {
        this.setState({
            playing: !this.state.playing,
            initialView: false
        })
    }

    render() {
        if (this.state.initialView) {
            const previewUrl = transform('h_400,f_auto,q_auto:eco', getPosterForVideo(this.props.url));
            return (
                <View style={style.view}>
                    <Image style={style.video} source={{uri: previewUrl}}/>
                    <Button onPress={this.togglePlaying.bind(this)}>
                        {(!this.state.playing) ? <Icon name='play' style={style.pauseIconStyle} active/>
                            : <Icon name='pause' style={style.pauseIconStyle} active/>}
                    </Button>
                </View>
            )
        } else {
            return (
                <View style={style.view}>
                    <Video style={style.video}
                           resizeMode="contain"
                           source={{uri: transformVideo('f_auto,q_auto:eco', this.props.url)}}
                           paused={!this.state.playing}
                    />
                    <Button onPress={this.togglePlaying.bind(this)}>
                        {(!this.state.playing) ? <Icon name='play' style={style.pauseIconStyle} active/>
                            : <Icon name='pause' style={style.pauseIconStyle} active/>}
                    </Button>
                </View>
            );
        }
    }
}

function getPosterForVideo(url) {
    return url.replace(/\.[^/.]+$/, ".png");
}

function transformVideo(parameters, url) {
    if (!url) {
        return;
    }

    let newUrl;
    if (!url.includes('cloudinary')) {
        // cannot transform images that are not from cloudinary
        return url;
    } else {
        newUrl = url.replace(/video\/upload\/.*\//, `video/upload/${parameters}/`);
        return newUrl;
    }
};
