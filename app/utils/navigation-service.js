import {NavigationActions} from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

// TODO figure out why this doesn't work for all cases e.g. if "aTeam" is called
function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate(
            {routeName: routeName},
            {params: params},
        )
    );
}

export default {
    navigate,
    setTopLevelNavigator,
};
