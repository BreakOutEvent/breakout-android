import React, {Component} from 'react';
import {Icon} from "native-base";
import {connect} from "react-redux";
import LocalizedStrings from 'react-native-localization';
import {StyleSheet, FlatList, View, Text} from "react-native";
import {fetchGroupMessages} from "./actions";
import _ from 'lodash';
import moment from 'moment';

const strings = new LocalizedStrings({
    "en-US": {
        drawerLabelMessages: 'Messages'
    },
    de: {
        drawerLabelMessages: 'Nachrichten'
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

    groupMessageThreadView(row) {

        const usersString = row.item.users.map(user => user.firstname).join(", ");
        const lastMessage = _.last(row.item.messages);
        const lastMessageCutOrEmpty = lastMessage ? lastMessage.text.slice(0, 20).replace(/\n/g, " ") : "";
        const lastMessageCutIdentifier = lastMessageCutOrEmpty.length == 20 ? lastMessageCutOrEmpty + "..." : lastMessageCutOrEmpty;
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
            <View style={this.style.container}>
                <Text style={this.style.userString}>{usersString}</Text>
                <Text>{lastMessageCutIdentifier}</Text>
                <Text style={this.style.dateString}>{lastMessageFromNow}</Text>
            </View>
        );
    }

    render() {
        const props = this.props;

        return (
            <FlatList data={props.groupMessages}
                      keyExtractor={item => item.id.toString()}
                      renderItem={this.groupMessageThreadView}
                      refreshing={props.refreshing}
                      onRefresh={() => props.onRefresh()}
            />
        )
    }

}

const mapStateToProps = (state) => {
    return ({
        groupMessages: state.messages.groupMessages,
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
