import React, {Component} from "react";
import {addLike} from "../postings/actions";
import {connect} from "react-redux";
import {Icon} from "native-base";
import PostingList from "../components/posting-list";
import {fetchNewPostingsForTeam} from "./actions";

class Postings extends Component {

    static navigationOptions = {
        tabBarIcon: <Icon style={{color: 'white'}} name='list-box'/>
    };

    render() {
        return <PostingList {...this.props}/>
    }
}

const mapStateToProps = (state) => {
    const teamId = _.get(state, 'login.me.participant.teamId');
    return ({
        teamId,
        postings: state.team[teamId].postings,
        currentPage: 0, // no paging for team postings
        refreshing: false, // state.postings.refreshing,
       // fetchNextPageError: undefined, // state.postings.fetchNextPageError,
       //  fetchNewPostingsError: undefined,//state.postings.fetchNewPostingsError
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        nextPage: () => {
            // no paging for team
        },
        onRefresh: (teamId) => dispatch(fetchNewPostingsForTeam(teamId)),
        addLike: (postingId) => dispatch(addLike(postingId))
    }
};

const ConnectedTeamPostings = connect(mapStateToProps, mapDispatchToProps)(Postings);
export default ConnectedTeamPostings;