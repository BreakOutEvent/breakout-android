import React,{Component} from 'react';
import{
	StyleSheet,
	View,
	Text,
	Button,
	TouchableOpacity,
  Image
} from 'react-native';

export default class Toolbar_BreakOutOrange extends Component{
  constructor(props){
    super(props);
  }

  render(){
    var iconForLeftButton = (this.props.iconForLeftButton != undefined)?this.props.iconForLeftButton : require('../assets/ic_close_black_24dp.png')
    var heading = (this.props.heading != undefined)?this.props.heading : 'BreakOut'
    var iconForRightButton = this.props.iconForLeftButton;

    if (typeof(iconForRightButton) !== 'undefined' || iconForRightButton != null){
      return(
        <View style={styles.toolbar}>
          <TouchableOpacity style={{backgroundColor:'#e6823c', justifyContent:'center'}} text='test'>
            <Image source={iconForLeftButton} style={{height:26, width:26, marginHorizontal:24, resizeMode: 'contain'}}/>
          </TouchableOpacity>
          <View style={{flex:1, height:'100%', justifyContent:'center'}}>
            <Text style={{flex:1, height:'100%', textAlignVertical:'center', fontSize:20, color:'#ffffff'}} adjustsFontSizeToFit numberOfLines={1}>
              {heading}
            </Text>
          </View>
          <TouchableOpacity style={{backgroundColor:'#e6823c', justifyContent:'center'}} text='test'>
            <Image source={iconForRightButton} style={{height:26, width:26, marginHorizontal:24, resizeMode: 'contain'}}/>
          </TouchableOpacity>
        </View>
      )
    } else {
      return(
        <View style={styles.toolbar}>
          <TouchableOpacity style={{backgroundColor:'#e6823c', justifyContent:'center'}} text='test'>
            <Image source={iconForLeftButton} style={{height:26, width:26, marginHorizontal:24, resizeMode: 'contain'}}/>
          </TouchableOpacity>
          <View style={{flex:1, height:'100%', justifyContent:'center'}}>
            <Text style={{flex:1, height:'100%', textAlignVertical:'center', fontSize:20, color:'#ffffff'}} adjustsFontSizeToFit numberOfLines={1}>
              {heading}
            </Text>
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  toolbar:{
    height:56,
    width:'100%',
    backgroundColor:'#e6823c',
    flexDirection:'row'
  }
});
