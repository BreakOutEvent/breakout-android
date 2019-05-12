import React from 'react'
import {connect} from "react-redux";
import {View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator} from "react-native";
import LocalizedStrings from 'react-native-localization';
import {Textarea} from "native-base";
import {newMessageUserSearch, resetUserSearch, createGroupMessage} from './actions';
import * as Colors from "../../config/colors";

const SearchResultView = ({item, ...props}) => {
    const nameString = item.firstname ? `${item.firstname} ${item.lastname}` : "";
    const teamString = item.teamId ? `(${item.teamname} #${item.teamId})` : "";

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
        }
    });

    return <TouchableOpacity onPress={() => props.createGroupMessage(item, props.groupMessages, props.userId)}>
        <View style={this.style.container}>
            <Text style={this.style.userString}>{nameString} {teamString}</Text>
        </View>
    </TouchableOpacity>;
};

class NewMessageScreen extends React.PureComponent {

    componentWillMount() {
        this.props.resetUserSearch();
    }

    render() {
        const props = this.props;

        this.style = StyleSheet.create({
            loadingBackground: {
                opacity: 0.3
            },
            loading: {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 50,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center'
            }
        });

        return (
            <View pointerEvents={props.createMessageRefreshing ? 'none' : 'auto'}>
                {props.createMessageRefreshing ?
                    (<View style={this.style.loading}><ActivityIndicator size={100} color={Colors.Primary}/></View>)
                    : null}
                <View style={props.createMessageRefreshing ? this.style.loadingBackground : null}>
                    <Textarea
                        style={{margin: 5}}
                        rowSpan={2}
                        placeholder={strings.searchPlaceholder}
                        onChangeText={props.newMessageUserSearch}
                        value={props.newMessageSearchString}
                    />
                    <FlatList data={props.newMessageSearchResults}
                              keyExtractor={item => item.id.toString()}
                              renderItem={({item}) => <SearchResultView item={item} {...props}/>}
                              refreshing={props.newMessageSearchRefreshing}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return ({
        newMessageSearchString: state.messages.newMessageSearchString,
        newMessageSearchResults: state.messages.newMessageSearchResults,
        newMessageSearchRefreshing: state.messages.newMessageSearchRefreshing,
        createMessageRefreshing: state.messages.createMessageRefreshing,
        groupMessages: state.messages.groupMessages,
        userId: state.messages.userId
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        newMessageUserSearch: (text) => dispatch(newMessageUserSearch(text)),
        createGroupMessage: (item, groupMessages, userId) => dispatch(createGroupMessage(item, groupMessages, userId)),
        resetUserSearch: () => dispatch(resetUserSearch())
    }
};

let strings = new LocalizedStrings({
    "en-US": {
        searchPlaceholder: 'Search for Name, Teamname, ...'
    },
    de: {
        searchPlaceholder: 'Suchen nach Name, Teamname, ...'
    }
});

const ConnectedMessagesScreen = connect(mapStateToProps, mapDispatchToProps)(NewMessageScreen);
export default ConnectedMessagesScreen;
