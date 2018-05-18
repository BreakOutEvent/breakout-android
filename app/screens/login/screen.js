import React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import * as Colors from "../../config/colors";
import {Form, Icon, Input, Item, Label} from "native-base";
import {connect} from "react-redux";
import {onPasswordChanged, onPressLogin, onUsernameChanged} from "./actions";

class LoginScreen extends React.PureComponent {

    static navigationOptions = {
        drawerLabel: 'Login',
        drawerIcon: () => <Icon name='person'/>
    };

    render() {
        const style = StyleSheet.create({
            view: {
                flex: 1,
                width: '100%'
            },
            top: {
                flex: 2,
                backgroundColor: Colors.Primary,
                alignItems: 'center',
                justifyContent: 'center'
            },
            image: {
                width: '30%',
                resizeMode: 'contain'
            },
            bottom: {
                flex: 3,
                backgroundColor: Colors.Secondary,
                padding: 20,
                alignItems: 'center'
            },
            form: {
                width: '100%'
            },
            item: {
                marginLeft: 0
            },
            label: {
                color: Colors.Subtitle
            },
            buttonView: {
                paddingTop: 30
            }
        });

        const props = this.props;

        // TODO: i18n
        return (
            <View style={style.view}>
                <View style={style.top}>
                    <Image style={style.image} source={require('../../assets/breakout_logo.png')}/>
                </View>
                <View style={style.bottom}>
                    <Form style={style.form}>
                        <Item floatingLabel style={style.item}>
                            <Label style={style.label}>Email</Label>
                            <Input style={style.label}
                                   onChangeText={props.onUsernameChanged}
                                   value={props.username}
                            />
                        </Item>
                        <Item floatingLabel style={style.item}>
                            <Label style={style.label}>Password</Label>
                            <Input secureTextEntry={true}
                                   style={style.label}
                                   onChangeText={props.onPasswordChanged}
                                   value={props.password}
                            />
                        </Item>
                    </Form>
                    <ErrorMessageView error={props.error}/>
                    <View style={style.buttonView}>
                        <Button color={Colors.Primary} title='Login'
                                onPress={() => props.onPressLogin(props.username, props.password)}/>
                        <View style={{height: 10}} />
                        <Button color={Colors.Grey} title='Continue without login'
                                onPress={() => props.navigation.navigate('drawer')}/>
                    </View>
                </View>
            </View>
        );
    }
}

const ErrorMessageView = (props) => {
    if (!props.error) {
        return (null)
    }

    return (
        <View style={{paddingTop: 30}}>
            <Text style={{color: Colors.LikeRed}}>{props.error.userMessage}</Text>
        </View>
    );

}
const mapStateToProps = (state) => {
    return {
        username: state.login.username,
        password: state.login.password,
        error: state.login.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUsernameChanged: (username) => dispatch(onUsernameChanged(username)),
        onPasswordChanged: (password) => dispatch(onPasswordChanged(password)),
        onPressLogin: (username, password) => dispatch(onPressLogin(username, password))
    }
};

export default ConnectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
