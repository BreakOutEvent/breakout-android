import React from 'react'
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import LocalizedStrings from 'react-native-localization';
import * as Colors from "../../config/colors";
import placeHolder from "../../assets/profile_pic_placeholder.jpg"
import {sendGroupMessage, setGroupMessageId} from "../messages-overview/actions";
import {connect} from "react-redux";
import {store} from '../../store/store';

class MessagesScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        const groupMessageId = this.props.navigation.getParam("groupMessageId");
        this.props.setGroupMessageId(groupMessageId);

        const onChange = () => {
            setTimeout(() => this.updateData(this.props), 100);
        };
        store.subscribe(onChange)
    }

    state = {
        userId: 1,
        messages: []
    };

    updateData(props) {
        const groupMessage = props.groupMessages.find(x => x.id === props.groupMessageId);
        this.setState({
            messages: groupMessage.messages
                .sort((a, b) => b.date - a.date)
                .map(({id, creator, text, date}) => {
                    const profilePic = () => {
                        if (creator.profilePic) {
                            return creator.profilePic.url;
                        } else {
                            return placeHolder;
                        }
                    };

                    return {
                        _id: id,
                        text: text,
                        createdAt: new Date(date * 1000),
                        user: {
                            _id: creator.id,
                            name: creator.firstname || "",
                            avatar: profilePic(),
                        },
                    };
                }),
            userId: props.navigation.getParam("userId")
        })
    }

    componentWillMount() {
        this.updateData(this.props);
    }

    renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: Colors.White
                    },
                    right: {
                        backgroundColor: Colors.Primary
                    }
                }}
            />
        );
    };


    onSend(messages = [], sendMessage) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));

        messages.map(message => sendMessage(this.props.groupMessageId, message.text));
    }

    render() {
        const props = this.props;

        return (
            <GiftedChat
                messages={this.state.messages}
                renderBubble={this.renderBubble}
                onSend={messages => this.onSend(messages, props.sendMessage)}
                user={{
                    _id: this.state.userId,
                }}
            />
        )
    }
}

let strings = new LocalizedStrings({
    "en-US": {
        drawerLabelMessages: 'Messages'
    },
    de: {
        drawerLabelMessages: 'Nachrichten'
    }
});

const mapStateToProps = (state) => {
    return ({
        groupMessageId: state.messages.groupMessageId,
        groupMessages: state.messages.groupMessages,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (groupMessageId, text) => dispatch(sendGroupMessage(groupMessageId, text)),
        setGroupMessageId: (groupMessageId) => dispatch(setGroupMessageId(groupMessageId)),
    }
};

const ConnectedMessagesScreen = connect(mapStateToProps, mapDispatchToProps)(MessagesScreen);
export default ConnectedMessagesScreen;
