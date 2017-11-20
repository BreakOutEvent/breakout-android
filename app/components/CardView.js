import React,{Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	InputText,
	Button
} from 'react-native';

export default class CardView extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <View style={this.cardStyles()} >
        {this.props.children}
      </View>
    );
  }

  cardStyles=() => {
    return{
      minWidth: "20%",
      minHeight: 75,
      width: this.props.style.width,
      backgroundColor: this.props.style.backgroundColor,
      borderRadius: 4,
      padding: 15,
      justifyContent: "flex-start",
      alignItems:"center",
      elevation:4
    }
  }
}
