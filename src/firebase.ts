// Import the functions you need from the SDKs you need
import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// TODO:e
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDZHSTK0Z1Oc7hZmkGQXc2QhRKc-1Q5CN0',
  authDomain: 'frozit-93a71.firebaseapp.com',
  projectId: 'frozit-93a71',
  storageBucket: 'frozit-93a71.appspot.com',
  messagingSenderId: '670058579127',
  appId: '1:670058579127:web:85d57de7942fc276c6b932',
  measurementId: 'G-VE6JGLQC7K',
}
// Initialize Firebase
let app: FirebaseApp

if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}

export const auth = getAuth(app)
