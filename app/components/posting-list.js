import React from 'react';
import {FlatList, Text, View} from "react-native";
import Posting from "../components/posting";

export default PostingList = (props) => {
    const renderPosting = (row) => <Posting addLike={props.addLike} {...(row.item)} />;
    const errorHeader = <ErrorMessageView error={props.fetchNewPostingsError}/>;
    const errorFooter = <ErrorMessageView error={props.fetchNextPageError}/>;
    return (
        <FlatList ListHeaderComponent={errorHeader}
                  ListFooterComponent={errorFooter}
                  data={props.postings}
                  keyExtractor={item => item.id}
                  style={{margin: 10}}
                  renderItem={renderPosting}
                  onEndReached={() => props.nextPage(props.currentPage)}
                  refreshing={props.refreshing}
                  onRefresh={() => props.onRefresh(props.teamId)} // pass in team id, it is undefined on all postings and teamId on team page
        />
    );
};

const ErrorMessageView = (props) => {
    if (!props.error) {
        return (null);
    }
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 5}}>
            <Text>{props.error.userMessage}</Text>
        </View>
    );
};