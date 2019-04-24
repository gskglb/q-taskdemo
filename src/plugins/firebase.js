/* eslint no-unused-vars: "off" */

import firebase from 'firebase'
import auth from 'firebase/auth'
import config from './firebase-env.json'

export const fireApp = firebase.initializeApp(config)
export const AUTH = fireApp.auth()
export const DB = fireApp.database()

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$auth = AUTH
  Vue.prototype.$db = DB
}
