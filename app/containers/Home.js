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

class Home extends Component{
  constructor(props){
    super(props);
  }
  static navigationOptions = {
    header: null
  }

  render(){
    return(
      <View style={styles.container}>
        <Text>Hallo BreakOut!</Text>
      </View>
    );
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
	return {
		searchedProduct: state.searchedProduct,
		results: state.searchResults,
		aId: state.analyticsId,
		searching: state.searching,
		genUuid: state.uuid,
		initStatus: state.initLoading,
		showClosed: state.showClosed,
		highToLow: state.highToLow,
		lowToHigh: state.lowToHigh,
		userLocation: state.userLocation
	}
}

//Make actions available as functions in props
function mapDispatchToProps(dispatch){
	return bindActionCreators(ActionCreators, dispatch);
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Home));
