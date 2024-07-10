// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD01DsjvDrIbl7cidRSe82BBRXTi-noWtQ',
  authDomain: 'frozit-ecommerce.firebaseapp.com',
  projectId: 'frozit-ecommerce',
  storageBucket: 'frozit-ecommerce.appspot.com',
  messagingSenderId: '198393857131',
  appId: '1:198393857131:web:d7edfcb477e2abf43f9d2e',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }
