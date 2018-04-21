import React,{Component} from 'react';
import {
	StyleSheet,
  View
} from 'react-native';
import Toolbar_BreakOutOrange from '../components/Toolbar_BreakOutOrange';
import ChallengeItem from '../components/ChallengeItem';

export default class ChallengeList extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View>
        <Toolbar_BreakOutOrange iconForLeftButton={require('../assets/ic_arrow_back_white_24dp.png')} heading='Challenge wählen'/>
        <View style={styles.itemlist}>
          <ChallengeItem amount='12€' sponsorname='Hertha' challengeDescription='Lauf Forest, lauf!'/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemlist:{
    flex:1,
    flexDirection:'column',
    justifyContent:'flex-start'
  }

})
