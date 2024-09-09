import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/database";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC6f7_WV3SASJ91vmAfJ9guftm2qVz1qLA",
    authDomain: "smit-hackathon-project.firebaseapp.com",
    databaseURL: "https://smit-hackathon-project-default-rtdb.firebaseio.com",
    projectId: "smit-hackathon-project",
    storageBucket: "smit-hackathon-project.appspot.com",
    messagingSenderId: "156058478214",
    appId: "1:156058478214:web:8544d0559d45a2ef0c9307"
  };

firebase.initializeApp(firebaseConfig);


export const db = firebase.database()
export const auth = firebase.auth();
export const storage = firebase.storage();
export const store = firebase.firestore();

export default firebase