import React from 'react';
import {Icon, List, ListItem} from "native-base";
import {store} from "../../store/store";
import {Text} from "react-native";
import NavigationService from "../../utils/navigation-service";

class SettingsScreen extends React.PureComponent {

    static navigationOptions = {
        drawerLabel: () => "Settings",
        drawerIcon: () => <Icon name='settings'/>
    };

    resetApp() {
        store.dispatch({
            type: 'CLEAN_ALL'
        });
        NavigationService.navigate("login");
    }

    render() {
        return (
            <List>
                <ListItem onPress={this.resetApp}>
                    <Text>Reset app</Text>
                </ListItem>
            </List>
        );
    }
}

export default SettingsScreen;

