import BreakoutApi from "breakout-api-client";
import {BASE_URL, CLIENT_NAME, CLIENT_SECRET, DEBUG} from "../config/secrets";
import {withAccessToken} from "../utils/utils";
import {ToastAndroid} from "react-native";

const api = new BreakoutApi(BASE_URL, CLIENT_NAME, CLIENT_SECRET, "breakout", "955374861429162", DEBUG);

export function onGeoLocationReceived(location) {
    return async (dispatch, getState) => {
        console.log(location);
        const teamId = _.get(getState(), 'login.me.participant.teamId');

        if (!teamId) {
            console.debug("Not uploading location because user is not in a team");
            return;
        }

        try {
            await withAccessToken(api).uploadLocationForTeam(teamId, {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
            ToastAndroid.show("a new location was uploaded", 10);
        } catch (err) {
            console.log(err);
        }
    }
}

export function onGeoLocationError(error) {
    console.warn("Did not track user location because of error: ", error);
}