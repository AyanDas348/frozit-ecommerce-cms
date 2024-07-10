// Import the functions you need from the SDKs you need
import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// TODO:e
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyD01DsjvDrIbl7cidRSe82BBRXTi-noWtQ',
  authDomain: 'frozit-ecommerce.firebaseapp.com',
  projectId: 'frozit-ecommerce',
  storageBucket: 'frozit-ecommerce.appspot.com',
  messagingSenderId: '198393857131',
  appId: '1:198393857131:web:d7edfcb477e2abf43f9d2e',
}

// Initialize Firebase
let app: FirebaseApp

if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}

export const auth = getAuth(app)
