import BreakoutApi from "breakout-api-client";
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD, DEBUG} from "../config/secrets";
import {withAccessToken} from "../utils/utils";
import {ToastAndroid} from "react-native";
import _ from "lodash";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, CLOUDINARY_CLOUD, CLOUDINARY_API_KEY, DEBUG);

export function onUpdateNotificationToken(notificationToken) {
    return async (dispatch, getState) => {
        const userId = _.get(getState(), 'login.me.id', null);

        if(!userId) return;

        try {
            console.log(api);
            console.log(withAccessToken(api));
            await withAccessToken(api).updateUserNotificationToken(userId, {
                token: notificationToken,
            });
            ToastAndroid.show("notification token was updated", 10);
        } catch (err) {
            console.log(err);
        }
    }
}

export function onUpdateNotificationRemove() {
    return async (dispatch, getState) => {
        const userId = _.get(getState(), 'login.me.id', null);

        if(!userId) return;

        try {
            await withAccessToken(api).removeUserNotificationToken(userId);
        } catch (err) {
            console.log(err);
        }
    }
}
