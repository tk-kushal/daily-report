import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";

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
const analytics = getAnalytics(app);
