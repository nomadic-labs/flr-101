import * as config from "../../config/firebase-config.json";
import firebase from "firebase/app";
import "firebase/auth"
import "firebase/database"

firebase.initializeApp(config.default[process.env.GATSBY_FIREBASE_ENVIRONMENT || "staging"]);
const stagingFirebase = firebase.initializeApp(config.default["staging"], "staging")

export default firebase;
export { stagingFirebase }