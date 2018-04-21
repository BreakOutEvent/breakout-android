
import React,{Component} from 'react';
import {
  Alert,
	StyleSheet,
	View,
	Text,
	InputText,
	Button,
	ActivityIndicator,
	TouchableOpacity,
  Image,
  ImageBackground,
  TextInput
} from 'react-native';
import GenericButton from '../components/GenericButton';
import 'core-js/es6/symbol';
import 'core-js/fn/symbol/iterator';
import LocalizedStrings from 'react-native-localization';

export default class NewPost extends Component{
	constructor(props){
		super(props);
	}
  render(){
      strings.setLanguage('en-US')
      return(
        <View style={styles.container}>
          <View style={styles.topScreenInput}>
            <TouchableOpacity style={{backgroundColor:'#e6823c', justifyContent:'center'}} text='test'>
              <Image source={require('../assets/ic_close_white_24dp.png')} style={{height:26, width:26, marginHorizontal:24, resizeMode: 'contain'}}/>
            </TouchableOpacity>
            <View style={{flex:1, height:'100%', justifyContent:'center'}}>
              <Text style={{flex:1, height:'100%', textAlignVertical:'center', fontSize:20, color:'#ffffff'}} adjustsFontSizeToFit numberOfLines={1}>
                {strings.newPost}
              </Text>
            </View>
            <TouchableOpacity style={{backgroundColor:'#e6823c', justifyContent:'center'}} text='test'>
              <Image source={require('../assets/ic_check_white_24dp.png')} style={{height:26, width:26, marginHorizontal:24, resizeMode: 'contain'}}/>
            </TouchableOpacity>
          </View>
          <ImageBackground source={require('../assets/bg_login_600dp.png')} style={{height:200, alignItems:'center', flexDirection:'column', justifyContent:'center'}}>
            <View style={{flex:1}}/>
            <TouchableOpacity style={{backgroundColor:'#ffffff80', height:50, width:50, justifyContent:'center', borderRadius:100}} text='test'>
              <Image source={require('../assets/ic_attach_file_black_24dp.png')} style={{flex:0.4, resizeMode: 'contain', alignSelf:'center'}}/>
            </TouchableOpacity>
            <View style={{flex:1}}/>
            <View style={{width:'100%', backgroundColor:'#00000080', justifyContent:'space-between'}}>
              <Text style={{ marginLeft:20, color:'#ffffff'}}>
                {strings.gettingCurrentLocation}
              </Text>
            </View>
          </ImageBackground>
          <View style={styles.challengeSelector}>
            <TouchableOpacity style={{justifyContent:'center'}}>
              <Image source={require('../assets/ic_add_circle_outline_black_24dp.png')} style={{height:26, width:26, marginHorizontal:20, resizeMode: 'contain', tintColor:'#33333333'}}/>
            </TouchableOpacity>
            <Text style={{color:'#33333333', fontSize:15, flex:1, height:'100%', textAlignVertical:'center'}}>
              {strings.chooseChallenge}
            </Text>
          </View>
          <View style={{flex:1, backgroundColor:'#f2f2f2'}}>
            <Text style={{color:'#00000061', fontSize:12, marginHorizontal:16, marginTop:16}}>
              {strings.message}
            </Text>
            <TextInput style={{color:'#000000', height:40, marginHorizontal:16}} placeholderTextColor='#00000061' underlineColorAndroid='#00000061'
           placeholder={strings.whatRUDoing}/>
          </View>
        </View>
      );
  }
}

let strings = new LocalizedStrings({
 "en-US":{
	 newPost:"New post",
   gettingCurrentLocation:"Getting current location...",
   chooseChallenge:"Choose a challenge",
   message:"Message",
   whatRUDoing:"What are you doing?"
 },
 de:{
   newPost:"Neuer post",
   gettingCurrentLocation:"Aktuellen Ort ermitteln...",
   chooseChallenge:"Wähle eine Challenge aus",
   message:"Nachricht",
   whatRUDoing:"Was machst du gerade?"
 }
});

const styles = StyleSheet.create({
  challengeSelector:{
    flexDirection:'row',
    height:70,
    backgroundColor:'#ffffff'
  },
  container:{
    flex:1,
    width:'100%',
    justifyContent:'flex-start'

  },
  topScreenInput:{
    height:56,
    width:'100%',
		backgroundColor:'#e6823c',
    flexDirection:'row'
  }
});
