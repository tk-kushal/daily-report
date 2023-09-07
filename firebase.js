import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCZFx8mYEq_uzvQbaSzIc-m75Vc6X9_a8",
  authDomain: "daytrkr.firebaseapp.com",
  projectId: "daytrkr",
  storageBucket: "daytrkr.appspot.com",
  messagingSenderId: "312194239306",
  appId: "1:312194239306:web:dc4375c92b2068e8b7cfb3",
  measurementId: "G-MZ87T393WX",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)
let uid = null;
let journalCollection = null;
auth.onAuthStateChanged((user)=>{
  if(user){
    uid = auth.currentUser.uid;
    journalCollection = collection(db,uid);

  }
})
export function signIn(){
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}
export function getdocuments(){
  if(journalCollection){
    getDocs(journalCollection).then(snapshot=>snapshot.docs.map(doc=>console.log(doc.data())))
  }
}
export function createDocument(key,data){
  if(uid){
    let docRef = doc(db,uid,key);
    setDoc(docRef,data).then().catch(e=>console.log(e))
  }
}
export function signOut(){
  auth.signOut();
}
const analytics = getAnalytics(app);
