import React, {
	Component
} from 'react';

import {connect} from 'react-redux';
import Home from './Home'

import {
	StackNavigator
} from 'react-navigation';


class AppContainer extends Component {
	static navigationOptions = {
		header: null
	}
	render() {
		return (
			<Home {...this.props}/>
		);
	}
}

export default AppWithNav = StackNavigator({
	Home: {
		screen: AppContainer
	}
}, {
	headerMode: 'screen'
});
