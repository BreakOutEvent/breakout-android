import React,{Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	Button,
	AsyncStorage
} from 'react-native';
import CardView from "./CardView";
import LoadingButton from './LoadingButton';

export default class LoginForm extends Component{
  constructor(props){
    super(props);
		this.state={username:"",password:""};
  }
	componentDidMount(){
		this.props.username = "";
		this.props.password = "";
		console.log(this.props);
	}
  render(){
    return(
      <CardView style={this.props.style}>
        <TextInput style={{width:"100%"}}
        onChangeText={(text)=>{this.onUsernameEntry(text)}}
        placeholder="Username" />
        <TextInput style={{width:"100%"}}
        onChangeText={(text)=>{this.onPasswordEntry(text)}}
        placeholder="Passwort"
        secureTextEntry={true} />
				<View style={styles.button}>
					<LoadingButton
					onPress={() => {this.onClick()}}
					loggingIn={this.props.loggingIn}
					text="LOGIN"
					/>
				</View>
      </CardView>
    );
  }

  onUsernameEntry = (username) => {
		this.setState(previousState => {return{password:previousState.password,username:username}});
  }

	onPasswordEntry = (password) => {
		this.setState(previousState => {return{password:password,username:previousState.username}});
	}

	onClick = () => {
		this.props.onButtonClick(this.state.username,this.state.password);
	}
}

const styles = StyleSheet.create({
  container:{

  },
	button:{
		marginTop:12,
		paddingTop:20,
		width:200
	}
});
