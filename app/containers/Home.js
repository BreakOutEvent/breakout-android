
import React, {
	Component
} from 'react';

import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	StyleSheet,
	ScrollView,
	LayoutAnimation,
	Platform,
	UIManager,
	Alert,
	ActivityIndicator,
	AsyncStorage,
} from 'react-native';
import {connect} from 'react-redux';
import {ActionCreators} from '../actions';
import {bindActionCreators} from 'redux';
import {withNavigation} from 'react-navigation';

import LoginForm from '../components/LoginForm';
import NewPost from '../screens/NewPost';
import ChallengeItem from '../components/ChallengeItem';
import ChallengeList from './ChallengeList';
class Home extends Component{
  constructor(props){
    super(props);
  }
  static navigationOptions = {
    header: null
  }

  render(){
		console.log(this.props.loggingIn);
    return(
      <View style={styles.container}>
				<LoginForm/>
      </View>
    );
  }

	onLoginPressed = (username,password) => {
		console.log(username+" "+password);
		console.log(this.props);
		this.props.login(username,password);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
//Make state available as props
function mapStateToProps(state){
	console.log(state);
	return {
		loggingIn: state.isLoggingIn,
	}
}

//Make actions available as functions in props
function mapDispatchToProps(dispatch){
	return bindActionCreators(ActionCreators, dispatch);
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Home));
