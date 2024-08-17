import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDVEIzoC2ZLqim7-z1gWiWvTXglc92QbOQ",
    authDomain: "floranet.firebaseapp.com",
    projectId: "floranet",
    storageBucket: "floranet.appspot.com",
    messagingSenderId: "483650882111",
    appId: "1:483650882111:web:688b041cb368a3045dc68a",
    measurementId: "G-TG26MPZHDG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('signInForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDisplay = document.createElement('p'); // Crear elemento para mostrar errores
    errorDisplay.style.color = 'red';
    errorDisplay.id = 'loginErrorDisplay';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Obtener el nombre del usuario y guardarlo en localStorage
        const userName = user.displayName;
        localStorage.setItem('userName', userName);

        // Redirigir a la página principal
        window.location.href = 'start.html';
    } catch (error) {
        // Manejar errores específicos
        switch (error.code) {
            case 'auth/invalid-email':
                errorDisplay.textContent = 'Correo inválido.';
                break;
            case 'auth/user-disabled':
                errorDisplay.textContent = 'Esta cuenta ha sido deshabilitada.';
                break;
            case 'auth/user-not-found':
                errorDisplay.textContent = 'No se encontró una cuenta con este correo.';
                break;
            case 'auth/wrong-password':
                errorDisplay.textContent = 'Contraseña incorrecta.';
                break;
            default:
                errorDisplay.textContent = `Error: ${error.message}`;
        }

        // Agregar mensaje de error al formulario si no existe
        if (!document.getElementById('loginErrorDisplay')) {
            document.getElementById('signInForm').appendChild(errorDisplay);
        }

        // Ocultar mensaje de error después de 5 segundos
        setTimeout(() => {
            if (errorDisplay) {
                errorDisplay.remove();
            }
        }, 5000);
    }
});
