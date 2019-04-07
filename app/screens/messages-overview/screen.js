import React, {Component} from 'react';
import {Icon} from "native-base";
import {connect} from "react-redux";
import LocalizedStrings from 'react-native-localization';
import {StyleSheet, FlatList, View, Text, TouchableOpacity} from "react-native";
import {fetchGroupMessages} from "./actions";
import _ from 'lodash';
import moment from 'moment';

const strings = new LocalizedStrings({
    "en-US": {
        drawerLabelMessages: 'Messages',
        someUsername: 'Some User'
    },
    de: {
        drawerLabelMessages: 'Nachrichten',
        someUsername: 'Ein Nutzer'
    }
});

class MessagesOverviewScreen extends Component {

    static navigationOptions = {
        drawerLabel: () => strings.drawerLabelMessages,
        title: strings.drawerLabelMessages,
        drawerIcon: () => <Icon name='text'/>
    };

    componentDidMount() {
        this.props.onRefresh();
    }

    groupMessageThreadView(item, props) {
        const usersString = item.users
            .filter(user => user.id != props.userId)
            .map(user => user.firstname ? user.firstname : strings.someUsername)
            .join(", ");
        const lastMessage = _.last(item.messages);
        const lastMessageCutOrEmpty = lastMessage ? lastMessage.text.slice(0, 40).replace(/\n/g, " ") : "";
        const lastMessageCutIdentifier = lastMessageCutOrEmpty.length == 40 ? lastMessageCutOrEmpty + "..." : lastMessageCutOrEmpty;
        const lastMessageFromNow = lastMessage ? moment.unix(lastMessage.date).fromNow() : "";

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

        return (
            <TouchableOpacity
                onPress={() => props.navigation.navigate("messages", {groupMessage: item, userId: props.userId})}>
                <View style={this.style.container}>
                    <Text style={this.style.userString}>{usersString}</Text>
                    <Text>{lastMessageCutIdentifier}</Text>
                    <Text style={this.style.dateString}>{lastMessageFromNow}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const props = this.props;

        return (
            <FlatList data={props.groupMessages}
                      keyExtractor={item => item.id.toString()}
                      renderItem={({item}) => (this.groupMessageThreadView(item, props))}
                      refreshing={props.refreshing}
                      onRefresh={() => props.onRefresh()}
            />
        )
    }

}

const mapStateToProps = (state) => {
    return ({
        groupMessages: state.messages.groupMessages,
        userId: state.messages.userId,
        refreshing: state.messages.refreshing,
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRefresh: () => dispatch(fetchGroupMessages()),
    }
};

const ConnetedMessagesOverview = connect(mapStateToProps, mapDispatchToProps)(MessagesOverviewScreen);
export default ConnetedMessagesOverview;
