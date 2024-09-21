//npm install firebase npm
  // Import the functions you need from the SDKs you need
  // Importar Firebase usando el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
 
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDVEIzoC2ZLqim7-z1gWiWvTXglc92QbOQ",
    authDomain: "floranet.firebaseapp.com",
    projectId: "floranet",
    storageBucket: "floranet.appspot.com",
    messagingSenderId: "483650882111",
    appId: "1:483650882111:web:688b041cb368a3045dc68a",
    measurementId: "G-TG26MPZHDG"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Exportar una sola vez
export { app, auth, analytics };
