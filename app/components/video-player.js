import {StyleSheet, View} from "react-native";
import Video from "react-native-video";
import React from "react";
import {Icon} from "native-base";
import {Button} from "./posting";

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
            playing: false
        }
    }

    togglePlaying() {
        this.setState({
            playing: !this.state.playing
        })
    }

    render() {

        if (!this.state.playing) {
            return (
                <View style={style.view}>
                    <Button onPress={this.togglePlaying.bind(this)}>
                        <Icon name='play'
                              style={style.playIconStyle}
                              active/>
                    </Button>
                </View>
            )
        } else {
            return (
                <View style={style.view}>
                    <Video style={style.video} source={{uri: this.props.url}}/>
                    <Button onPress={this.togglePlaying.bind(this)}>
                        <Icon name='pause'
                              style={style.pauseIconStyle}
                              active/>
                    </Button>
                </View>
            );
        }
    }
}