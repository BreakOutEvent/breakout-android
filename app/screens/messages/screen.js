import React from 'react'
import {GiftedChat, Bubble} from 'react-native-gifted-chat'
import LocalizedStrings from 'react-native-localization';
import * as Colors from "../../config/colors";

export default class MessagesScreen extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        userId: 1,
        messages: []
    };

    componentWillMount() {
        console.log(this.props);
        const groupMessage = this.props.navigation.getParam("groupMessage");
        this.setState({
            messages: groupMessage.messages
                .sort((a, b) => b.date - a.date)
                .map(({id, creator, text, date}) => {
                    return {
                        _id: id,
                        text: text,
                        createdAt: new Date(date * 1000),
                        user: {
                            _id: creator.id,
                            name: creator.firstname,
                            avatar: creator.profilePic.url,
                        },
                    };
                }),
            userId: this.props.navigation.getParam("userId")
        })
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


    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                renderBubble={this.renderBubble}
                onSend={messages => this.onSend(messages)}
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

