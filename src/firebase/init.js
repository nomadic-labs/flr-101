import * as config from "../../config/firebase-config.json";
import firebase from "firebase";

firebase.initializeApp(config.default[process.env.GATSBY_FIREBASE_ENVIRONMENT]);

export const stagingFirebase = firebase.initializeApp(config.default["staging"], "staging")
export default firebase;