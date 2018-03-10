//A generic Button component that offers some styles necessitated by the UI-Design document
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

export default class GenericButton extends Component{
	constructor(props){
		super(props);
	}

	render(){
		console.log(this.props.loggingIn);
		let customstyle
		//rather inelegant solution to prevent app from crashing when the 'style'-prop is undefined
		if(this.props.style != undefined){
			customstyle = [styles.default,this.props.style]
		}else{
			customstyle = styles.default
		}
		return(
			 <TouchableOpacity style={customstyle} onPress={() => this.onClicked()} activeOpacity={0.8}><Text style={{color:"white"}}>{this.props.text}</Text></TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	default: {
		backgroundColor: "#e6823c",
		padding:10,
		elevation:4,
		minHeight:45,
		justifyContent:"center",
		alignItems:"center",
	}
})
