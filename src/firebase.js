// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDZHSTK0Z1Oc7hZmkGQXc2QhRKc-1Q5CN0',
  authDomain: 'frozit-93a71.firebaseapp.com',
  projectId: 'frozit-93a71',
  storageBucket: 'frozit-93a71.appspot.com',
  messagingSenderId: '670058579127',
  appId: '1:670058579127:web:85d57de7942fc276c6b932',
  measurementId: 'G-VE6JGLQC7K',
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }
