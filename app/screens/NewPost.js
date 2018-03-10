
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
  ImageBackground
} from 'react-native';
import GenericButton from '../components/GenericButton';

export default class NewPost extends Component{
	constructor(props){
		super(props);
	}
  render(){
      return(
        <View style={styles.container}>
          <View style={styles.topScreenInput}>
            <TouchableOpacity style={{backgroundColor:'#e6823c', justifyContent:'center'}} text='test'>
              <Image source={require('../assets/ic_close_white_24dp.png')} style={{height:26, width:26, marginHorizontal:24, resizeMode: 'contain'}}/>
            </TouchableOpacity>
            <View style={{flex:1, height:'100%', justifyContent:'center'}}>
              <Text style={{flex:1, height:'100%', textAlignVertical:'center', fontSize:20, color:'#ffffff'}} adjustsFontSizeToFit numberOfLines={1}>
                Neuer Post
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
              <Text style={{ color:'#ffffff'}}>
                Aktuellen Ort ermitteln...
              </Text>
            </View>
          </ImageBackground>
        </View>
      );
  }
}

const styles = StyleSheet.create({
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
