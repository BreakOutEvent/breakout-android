import React, {Component} from 'react';
import {Icon} from "native-base";
import {connect} from "react-redux";
import {addLike, fetchNewPostings, fetchNextPage} from "../postings/actions";
import PostingList from "../components/posting-list";

class PostingListScreen extends Component {

    static navigationOptions = {
        drawerLabel: 'Alle Postings', // TODO: i18n
        drawerIcon: () => <Icon name='flag'/>
    };

    render() {
        return <PostingList {...this.props}/>
    }
}

const mapStateToProps = (state) => {
    return ({
        postings: state.postings.postings,
        currentPage: state.postings.currentPage,
        refreshing: state.postings.refreshing,
        fetchNextPageError: state.postings.fetchNextPageError,
        fetchNewPostingsError: state.postings.fetchNewPostingsError
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        nextPage: (page) => dispatch(fetchNextPage(page)),
        onRefresh: () => dispatch(fetchNewPostings()),
        addLike: (postingId) => dispatch(addLike(postingId))
    }
};

const ConnectedPostingList = connect(mapStateToProps, mapDispatchToProps)(PostingListScreen);
export default ConnectedPostingList;