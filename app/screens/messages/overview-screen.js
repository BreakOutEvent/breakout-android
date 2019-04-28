import React, {Component} from 'react';
import {Icon} from "native-base";
import {connect} from "react-redux";
import LocalizedStrings from 'react-native-localization';
import {StyleSheet, FlatList, View, Text, TouchableOpacity} from "react-native";
import {fetchGroupMessages, setCurrentGroupMessage, redirectToThread} from "./actions";
import _ from 'lodash';
import moment from 'moment';
import ActionButton from 'react-native-action-button';
import * as Colors from "../../config/colors";

export const strings = new LocalizedStrings({
    "en-US": {
        drawerLabelMessages: 'Messages',
        someUsername: 'Some User'
    },
    de: {
        drawerLabelMessages: 'Nachrichten',
        someUsername: 'Ein Nutzer'
    }
});

const GroupMessageThreadView = ({item, ...props}) => {
    const lastMessage = item.messages[0];
    const lastMessageCutOrEmpty = lastMessage ? lastMessage.text.slice(0, 40).replace(/\n/g, " ") : "";
    const lastMessageCutIdentifier = lastMessageCutOrEmpty.length == 40 ? lastMessageCutOrEmpty + "..." : lastMessageCutOrEmpty;
    const lastMessageFromNow = lastMessage ? moment.unix(lastMessage.createdAt / 1000).fromNow() : "";

    this.style = StyleSheet.create({
        container: {
            padding: 10,
            borderBottomColor: 'lightgray',
            borderBottomWidth: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
        },
        userString: {
            fontWeight: "600",
            fontSize: 16
        },
        dateString: {
            fontWeight: "200",
            fontSize: 9
        }
    });

    return <TouchableOpacity
        onPress={() => props.redirectToThread(item)}>
        <View style={this.style.container}>
            <Text style={this.style.userString}>{item.usersString}</Text>
            <Text>{lastMessageCutIdentifier}</Text>
            <Text style={this.style.dateString}>{lastMessageFromNow}</Text>
        </View>
    </TouchableOpacity>;
};

class MessagesOverviewScreen extends Component {

    static navigationOptions = {
        drawerLabel: () => strings.drawerLabelMessages,
        title: strings.drawerLabelMessages,
        drawerIcon: () => <Icon name='text'/>
    };

    componentDidMount() {
        if (!this.props.isLoggedIn) {
            this.props.navigation.navigate("drawerLogin", {});
        }

        this.props.onRefresh();
    }

    render() {
        const props = this.props;

        return (
            <View>
                <FlatList data={props.groupMessages}
                          keyExtractor={item => item.id.toString()}
                          renderItem={({item}) => <GroupMessageThreadView item={item} {...props}/>}
                          refreshing={props.refreshing}
                          onRefresh={() => props.onRefresh()}
                />
                <ActionButton
                    buttonColor={Colors.Primary}
                    onPress={() => {
                        props.navigation.navigate("newMessage")
                    }}
                />
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    return ({
        isLoggedIn: _.get(state, 'login.access_token'),
        groupMessages: state.messages.groupMessages,
        userId: state.messages.userId,
        refreshing: state.messages.refreshing,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentGroupMessage: (currentGroupMessage) => dispatch(setCurrentGroupMessage(currentGroupMessage)),
        onRefresh: () => dispatch(fetchGroupMessages()),
        redirectToThread: (thread) => dispatch(redirectToThread(thread)),
    }
};

const ConnetedMessagesOverview = connect(mapStateToProps, mapDispatchToProps)(MessagesOverviewScreen);
export default ConnetedMessagesOverview;
