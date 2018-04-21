import React,{Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	InputText,
  ImageBackground,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default class ChallengeItem extends Component{
  constructor(props){
		super(props);
	}
  render(){
    return(
      <TouchableOpacity style={styles.container}>
        <View>
          <Text style={styles.challengeSponsor}>{this.props.amount} von {this.props.sponsorname}</Text>
          <Text style={styles.challengeDescription}> {this.props.challengeDescription} </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column',
    width:'100%',
    marginHorizontal:14,
    marginTop:24
  },
  challengeSponsor:{
    fontSize:16,
    fontWeight:'bold',
    color:'#000000'
  },
  challengeDescription:{
    fontSize:14,
    color:'#0000008a'
  }
})
