import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXZxLq37w_RX0r1h3XcI2jAtdnSp0D2Co",
  authDomain: "usuarios-bf881.firebaseapp.com",
  databaseURL: "https://usuarios-bf881-default-rtdb.firebaseio.com",
  projectId: "usuarios-bf881",
  storageBucket: "usuarios-bf881.appspot.com",
  messagingSenderId: "663714432150",
  appId: "1:663714432150:web:e8731496786d5345892eb7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { ref, db, get, set};