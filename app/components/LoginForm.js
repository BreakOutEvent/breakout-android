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
			<View style={styles.container}>
				<View style={styles.logoArea}>
				</View>
	      <View style={styles.loginArea}>
					<View style={styles.loginInput}>
		        <TextInput style={styles.textInput} placeholderTextColor='#ffffff80' underlineColorAndroid='#ffffff80'
		        onChangeText={(text)=>{this.onUsernameEntry(text)}}
		        placeholder="Email" />
		        <TextInput style={styles.textInput} placeholderTextColor='#ffffff80' underlineColorAndroid='#ffffff80'
		        onChangeText={(text)=>{this.onPasswordEntry(text)}}
		        placeholder="Passwort"
		        secureTextEntry={true} />
					</View>
					<View style={styles.button}>
						<LoadingButton
						onPress={() => {this.onClick()}}
						loggingIn={this.props.loggingIn}
						text="EINLOGGEN"
						/>
					</View>
					<View style={styles.button}>
						<LoadingButton
						onPress={() => {this.onClick()}}
						loggingIn={this.props.loggingIn}
						text="KOSTENLOS REGISTRIEREN"
						style={{backgroundColor:'#ffffff80'}}
						/>
					</View>
					<Text style={styles.text}>
					Was ist BreakOut?
					</Text>
	      </View>
			</View>
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
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems:'center',
		backgroundColor: '#000000',
		width: '100%'

  },
	logoArea:{
		backgroundColor: '#e6832c',
		width:'100%',
		height:'40.2%'
	},
	loginArea:{
		flex: 1,
		flexDirection: 'column',
		justifyContent:'flex-start',
		alignItems:'stretch',
		backgroundColor: '#34323b',
		width:'100%',
		paddingTop: 28
	},
	loginInput:{
		width:'100%'

	},
	textInput:{
		marginHorizontal: 40
	},
	button:{
		marginTop:12,
		paddingTop:20,
		marginHorizontal: 40
	},
	text:{
		color:'#ffffffcc',
		paddingTop: 25,
		textAlignVertical: 'center',
		textAlign: 'center'

	}
});
