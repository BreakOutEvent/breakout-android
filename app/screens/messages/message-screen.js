import React from 'react'
import {GiftedChat, Bubble} from 'react-native-gifted-chat/index'
import * as Colors from "../../config/colors";
import {sendGroupMessage} from "./actions";
import {connect} from "react-redux";

class MessageScreen extends React.PureComponent {

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

const ConnectedMessageScreen = connect(mapStateToProps, mapDispatchToProps)(MessageScreen);
export default ConnectedMessageScreen;
