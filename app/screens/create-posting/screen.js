import React from "react";
import {ActivityIndicator, Picker, Text, ToastAndroid, View} from "react-native";
import {Button, Icon, Textarea} from "native-base";
import ImagePicker from "react-native-image-picker";
import Image from 'react-native-image-progress';
import * as Colors from "../../config/colors";
import {onCreatePostingScreenMounted} from "./actions";
import {connect} from "react-redux";
import {
    onChallengeSelected,
    onCreatePostingPressed,
    onImageSelected,
    onPostingTextChanged,
    onVideoSelected
} from "./actions";

import {Pie} from 'react-native-progress';

const SelectOrPreviewImage = (props) => {

    const progress = (props.progress && props.progress !== 0)
        ? <Pie progress={props.progress} size={70} style={{marginBottom: 30}} color={Colors.Primary}/>
        : (null);

    if (!props.uri) {
        return (
            <View style={{
                height: 200,
                width: '100%',
                backgroundColor: Colors.Secondary,
                display: 'flex',
                flexDirection: 'row',
                // TODO: this can be changed to space-evenly with newer react versions
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingBottom: 30
            }}>
                <Button style={{alignSelf: 'center', backgroundColor: 'transparent', elevation: 0}}
                        onPress={props.onSelectImage}>
                    <Icon name="camera" style={{color: 'white', fontSize: 60}}/>
                </Button>
                <Button style={{alignSelf: 'center', backgroundColor: 'transparent', elevation: 0}}
                        onPress={props.onSelectVideo}>
                    <Icon name="videocam" style={{color: 'white', fontSize: 60}}/>
                </Button>
                <ShowLocation coords={props.coords}/>
            </View>
        );
    } else {
        return (
            <View style={{
                height: 200,
                width: '100%'
            }}>
                <Image source={{uri: props.uri}}
                       style={{
                           height: '100%',
                           width: '100%',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center'
                       }}>
                    {progress}
                </Image>
                <ShowLocation coords={props.coords}/>
            </View>
        )
    }
};

const SelectChallenge = (props) => {

    const renderPickers = () => {
        if (props.error) {
            return <Picker.Item key={-1} label="Unable to load challenges" value={-1}/>
        } else {
            const label = <Picker.Item key={-1} label="Select a challenge!" value={-1}/>;
            const pickers = props.challenges.map(challenge => <Picker.Item key={challenge.id}
                                                                           label={challenge.description}
                                                                           value={challenge.id}/>);

            return [label, ...pickers]
        }
    };

    return (
        <Picker
            style={{
                backgroundColor: 'white',
                width: '100%',
            }}
            selectedValue={props.selectedChallenge}
            onValueChange={props.onChallengeSelected}>
            {renderPickers()}
        </Picker>
    );
};

const PostingText = (props) => {
    return <Textarea
        style={{marginTop: 10, marginLeft: 7}}
        rowSpan={5}
        placeholder="Was machst du gerade?"
        onChangeText={props.onPostingTextChanged}
        value={props.text}
    />
};

const SubmitPostingButton = (props) => {
    console.log(props);
    if (props.inProgress) {
        return <View style={{marginRight: 10}}><ActivityIndicator size="small" color="white"/></View>;
    } else {
        return (
            <Button style={{backgroundColor: 'transparent', elevation: 0, marginTop: 5}} onPress={props.onSubmit}
                    isLoading={true}>
                <Icon large name='send'/>
            </Button>
        )
    }
};

const ShowLocation = (props) => {

    const latitude = _.get(props, 'coords.latitude');
    const longitude = _.get(props, 'coords.longitude');

    const text = (latitude && longitude)
        ? `Your location: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
        : `Could not determine location`;

    return (
        <View style={{
            height: 30,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Text style={{color: 'grey', fontWeight: 'bold', paddingLeft: 14}}>{text}</Text>
        </View>
    );
};

const ConnectedSubmitPostingButton = connect((state) => ({
    inProgress: state.createPosting.inProgress,
}), (dispatch) => ({
    onSubmit: () => dispatch(onCreatePostingPressed())
}))(SubmitPostingButton);

class CreatePostingScreen extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Einen Status posten',
        drawerIcon: () => <Icon name='send'/>,
        headerRight: <ConnectedSubmitPostingButton/>
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (!this.props.isLoggedIn) {
            this.props.navigation.navigate("drawerLogin", {});
        } else {
            this.props.onCreatePostingScreenMounted(this.props.teamId);
        }
    }

    handleMediaSelect(mediaType) {
        const options = {
            title: `Select a ${mediaType}`,
            mediaType: mediaType,
            quality: 0.1,
            videoQuality: 'low',
            storageOptions: {
                skipBackup: true,
                path: `breakout${mediaType}`
            }
        };

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                // TODO: handle me!
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                // TODO: handle me!
                console.log('ImagePicker Error: ', response.error);
            }
            else {
                if (mediaType === 'image') {
                    this.props.onImageSelected(response);
                } else if (mediaType === 'video') {
                    this.props.onVideoSelected(response);
                } else {
                    console.error("Unsupported mediaType " + mediaType);
                }
            }
        });
    }

    displayErrorsAndSuccesses() {
        let message;

        if (this.props.uploadPostingError) {
            message = "Failed to upload posting";
        } else if (this.props.success && this.props.fulfillChallengeError) {
            message = "Created new posting but couldn't fulfill challenge";
        } else if (this.props.success) {
            message = "Created new posting";
        }

        if (message) {
            ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.TOP);
        }
    }

    render() {

        this.displayErrorsAndSuccesses();

        return (
            <View>
                <SelectOrPreviewImage
                    uri={_.get(this.props, 'media.uri')}
                    onSelectImage={() => this.handleMediaSelect('image')}
                    onSelectVideo={() => this.handleMediaSelect('video')}
                    progress={this.props.progress}
                    coords={this.props.coords}/>

                <SelectChallenge challenges={this.props.challenges || []}
                                 onChallengeSelected={this.props.onChallengeSelected}
                                 selectedChallenge={this.props.selectedChallenge}
                                 error={this.props.fetchChallengesForTeamError}/>

                <PostingText onPostingTextChanged={this.props.onPostingTextChanged}
                             postingText={this.props.text}/>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const teamId = _.get(state, 'login.me.participant.teamId');

    return {
        isLoggedIn: _.get(state, 'login.access_token'),
        teamId: teamId,
        challenges: state.createPosting.challenges,
        media: state.createPosting.media,
        text: state.createPosting.text,
        selectedChallenge: state.createPosting.selectedChallenge,
        coords: _.get(state, 'createPosting.location.coords'),
        inProgress: state.createPosting.inProgress,
        success: state.createPosting.success,

        getCurrentPositionError: state.createPosting.getCurrentPositionError,
        fetchChallengesForTeamError: state.createPosting.fetchChallengesForTeamError,
        uploadPostingError: state.createPosting.uploadPostingError,
        fulfillChallengeError: state.createPosting.fulfillChallengeError,

        progress: state.createPosting.uploadProgress
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCreatePostingScreenMounted: (teamId) => dispatch(onCreatePostingScreenMounted(teamId)),
        onImageSelected: (response) => dispatch(onImageSelected(response)),
        onVideoSelected: (response) => dispatch(onVideoSelected(response)),
        onPostingTextChanged: (text) => {dispatch(onPostingTextChanged(text))},
        onChallengeSelected: (challengeId) => dispatch(onChallengeSelected(challengeId))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostingScreen)