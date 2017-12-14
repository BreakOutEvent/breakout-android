import React,{Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	InputText,
	Button,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';

export default class LoadingButton extends Component{
	constructor(props){
		super(props);
	}

	render(){
		console.log(this.props.loggingIn);
		let display = (this.props.loggingIn)? <ActivityIndicator color="#FFF"></ActivityIndicator> : <Text style={{color:"white"}}>{this.props.text}</Text>
		return(
			<TouchableOpacity style={styles.container} onPress={() => this.onClicked()} activeOpacity={0.8}>
				{display}
			</TouchableOpacity>
		);
	}
	onClicked = () =>{
		this.props.onPress();
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#e6823c",
		padding:10,
		elevation:4,
		minHeight:45,
		justifyContent:"center",
		alignItems:"center"
	}
})
