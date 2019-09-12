import * as firebase from 'firebase';
import firebaseConfig from './config';

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const fs = firebase.firestore();
const auth = firebase.auth();

//fs.settings({timestampsInSnapshots: true,});

export { db, auth, fs };