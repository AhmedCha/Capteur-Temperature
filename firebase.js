import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {

  apiKey: "AIzaSyASet9bMGCA8JIl1EJUKKtrgWMlrzf1aeY",

  authDomain: "cothings-esp32.firebaseapp.com",

  databaseURL: "https://cothings-esp32-default-rtdb.firebaseio.com",

  projectId: "cothings-esp32",

  storageBucket: "cothings-esp32.appspot.com",

  messagingSenderId: "863808894385",

  appId: "1:863808894385:web:ee6baa17ff8cf1ab5ff990"

};
// Initialize Firebase and Realtime Database
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

export { database };