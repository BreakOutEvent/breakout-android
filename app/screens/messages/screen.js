import React from 'react'
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import LocalizedStrings from 'react-native-localization';
import * as Colors from "../../config/colors";
import {sendGroupMessage} from "../messages-overview/actions";
import {connect} from "react-redux";

class MessagesScreen extends React.PureComponent {

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
        messages.map(message => sendMessage(this.props.currentGroupMessage.id, message.text));
    }

    render() {
        const props = this.props;

        return (
            <GiftedChat
                messages={props.currentGroupMessage.messages}
                renderBubble={this.renderBubble}
                onSend={messages => messages.map(message => props.sendMessage(props.currentGroupMessage.id, message.text))}
                user={{
                    _id: props.currentGroupMessage.userId,
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
        currentGroupMessage: state.messages.currentGroupMessage
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendMessage: (groupMessageId, text) => dispatch(sendGroupMessage(groupMessageId, text))
    }
};

const ConnectedMessagesScreen = connect(mapStateToProps, mapDispatchToProps)(MessagesScreen);
export default ConnectedMessagesScreen;
