import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7Lksbpun72fGnOfWLpkcQtqty1jWPLZ0",
  authDomain: "kriya-fa83f.firebaseapp.com",
  projectId: "kriya-fa83f",
  storageBucket: "kriya-fa83f.appspot.com",
  messagingSenderId: "372727229894",
  appId: "1:372727229894:web:79b35f5419cb7a9d0e56c7",
};

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();

export { db };
export default firebase;
