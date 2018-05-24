import React, {Component} from 'react';
import {Icon} from "native-base";
import {connect} from "react-redux";
import {addLike, fetchNewPostings, fetchNextPage} from "./actions";
import PostingList from "../../components/posting-list";
import LocalizedStrings from 'react-native-localization';

class PostingListScreen extends Component {

    static navigationOptions = {
        drawerLabel: () => strings.allPostingsLabel,
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

let strings = new LocalizedStrings({
 "en-US":{
	 allPostingsLabel:'All Postings'
 },
 de:{
   allPostingsLabel:'Alle Postings'
 }
});

const ConnectedPostingList = connect(mapStateToProps, mapDispatchToProps)(PostingListScreen);
export default ConnectedPostingList;
