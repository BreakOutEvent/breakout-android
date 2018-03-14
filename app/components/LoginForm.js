import React,{Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	Button,
	AsyncStorage,
	Image,
	TouchableOpacity
} from 'react-native';
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
					<TouchableOpacity style={{height:20, width:30, marginTop:21, marginLeft:21}}>
						<Image source={require('../assets/ic_close_black_24dp.png')} style={{height:26, width:26}}/>
					</TouchableOpacity>
					<View style={{flex:1, justifyContent:'flex-start', alignItems:'center'}}>
						<Image source={require('../assets/logo_login.png')} style={{height:163, width:160}}/>
					</View>
				</View>
	      <View style={styles.loginArea}>
					<View style={styles.loginInput}>
						<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
							<Image source={require('../assets/ic_mail_outline_black_24dp.png')} style={{height:26, width:26, tintColor:'#ffffff80'}}/>
			        <TextInput style={styles.textInput} placeholderTextColor='#ffffff80' underlineColorAndroid='#ffffff80'
			        onChangeText={(text)=>{this.onUsernameEntry(text)}}
			        placeholder="Email" />
						</View>
						<View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
							<Image source={require('../assets/ic_lock_outline_black_24dp.png')} style={{height:26, width:26, tintColor:'#ffffff80'}}/>
			        <TextInput style={styles.textInput} placeholderTextColor='#ffffff80' underlineColorAndroid='#ffffff80'
			        onChangeText={(text)=>{this.onPasswordEntry(text)}}
			        placeholder="Passwort"
			        secureTextEntry={true} />
						</View>
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
		backgroundColor: '#34323b',
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
		width:'84%',
		paddingTop: 28,
		marginHorizontal: 40
	},
	loginInput:{
		width:'100%',
		alignItems:'center',
		justifyContent:'center'

	},
	textInput:{
		flex:1,
		fontSize:16
	},
	button:{
		marginTop:12,
		paddingTop:20

	},
	text:{
		color:'#ffffffcc',
		paddingTop: 25,
		textAlignVertical: 'center',
		textAlign: 'center'

	}
});
