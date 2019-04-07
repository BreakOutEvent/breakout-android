import React from 'react';
import {FlatList, Text, View} from "react-native";
import Posting from "../components/posting";

export default class PostingList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.renderPosting = this.renderPosting.bind(this);
    }

    renderPosting(row) {
        return <Posting addLike={this.props.addLike} {...row.item} />;
    }

    componentDidMount() {
        if (this.props.postings && this.props.postings.length === 0) {
            this.props.nextPage(0);
        }
    }

    render() {
        const props = this.props;
        const errorHeader = <ErrorMessageView error={props.fetchNewPostingsError}/>;
        const errorFooter = <ErrorMessageView error={props.fetchNextPageError}/>;
        return (
            <FlatList ListHeaderComponent={errorHeader}
                      ListFooterComponent={errorFooter}
                      data={props.postings}
                      keyExtractor={item => item.id.toString()}
                      renderItem={this.renderPosting}
                      onEndReached={() => props.nextPage(props.currentPage)}
                      refreshing={props.refreshing}
                      onRefresh={() => props.onRefresh(props.teamId)} // pass in team id, it is undefined on all postings and teamId on team page
            />
        );
    }
}

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
