import BreakoutApi from "breakout-api-client";
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD, DEBUG} from "../config/secrets";
import {withAccessToken} from "../utils/utils";
import _ from "lodash";
import NavigationService from "../utils/navigation-service";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, CLOUDINARY_CLOUD, CLOUDINARY_API_KEY, DEBUG);

export function onUpdateNotificationToken(notificationToken) {
    return async (dispatch, getState) => {
        const userId = _.get(getState(), 'login.me.id', null);

        if (!userId) return;

        await withAccessToken(api).updateUserNotificationToken(userId, {
            token: notificationToken,
        }).catch(error => {
            console.log("onUpdateNotificationToken", error);
            if (error.includes('401')) NavigationService.navigate("login");
        });
    }
}

export function onUpdateNotificationRemove() {
    return async (dispatch, getState) => {
        const userId = _.get(getState(), 'login.me.id', null);

        if (!userId) return;

        await withAccessToken(api).removeUserNotificationToken(userId).catch(console.error);
    }
}
